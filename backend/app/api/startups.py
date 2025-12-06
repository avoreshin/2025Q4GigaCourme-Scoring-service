from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from app.core.database import get_db
from app.models import Startup, PitchDocument, Scoring
from app.schemas.startup import StartupCreate, StartupResponse, StartupUpdate
from app.schemas.pitch_document import PitchDocumentResponse
from app.services.parsers.document_parser_factory import DocumentParserFactory
import os
from app.core.config import settings

router = APIRouter(prefix="/api/startups", tags=["startups"])


@router.post("/", response_model=StartupResponse)
def create_startup(startup: StartupCreate, db: Session = Depends(get_db)):
    """Create a new startup"""
    db_startup = Startup(**startup.dict())
    db.add(db_startup)
    db.commit()
    db.refresh(db_startup)
    return db_startup


@router.get("/", response_model=List[dict])
def get_startups(
    skip: int = 0,
    limit: int = 100,
    industry: Optional[str] = None,
    stage: Optional[str] = None,
    geography: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get list of startups with optional filters and latest scoring info"""
    # Get all startups
    query = db.query(Startup)
    
    if industry:
        query = query.filter(Startup.industry == industry)
    if stage:
        query = query.filter(Startup.stage == stage)
    if geography:
        query = query.filter(Startup.geography == geography)
    
    startups_list = query.offset(skip).limit(limit).all()
    
    # Get latest scoring for each startup
    startups = []
    for startup in startups_list:
        latest_scoring = db.query(Scoring).filter(
            Scoring.startup_id == startup.id
        ).order_by(Scoring.created_at.desc()).first()
        
        startup_dict = {
            "id": startup.id,
            "name": startup.name,
            "industry": startup.industry,
            "stage": startup.stage,
            "geography": startup.geography,
            "created_at": startup.created_at,
            "latest_scoring_id": latest_scoring.id if latest_scoring else None,
            "latest_score": float(latest_scoring.total_score) if latest_scoring else None
        }
        startups.append(startup_dict)
    
    return startups


@router.get("/{startup_id}", response_model=StartupResponse)
def get_startup(startup_id: int, db: Session = Depends(get_db)):
    """Get startup by ID"""
    startup = db.query(Startup).filter(Startup.id == startup_id).first()
    if not startup:
        raise HTTPException(status_code=404, detail="Startup not found")
    return startup


@router.put("/{startup_id}", response_model=StartupResponse)
def update_startup(
    startup_id: int,
    startup_update: StartupUpdate,
    db: Session = Depends(get_db)
):
    """Update startup"""
    startup = db.query(Startup).filter(Startup.id == startup_id).first()
    if not startup:
        raise HTTPException(status_code=404, detail="Startup not found")
    
    update_data = startup_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(startup, field, value)
    
    db.commit()
    db.refresh(startup)
    return startup


@router.delete("/{startup_id}")
def delete_startup(startup_id: int, db: Session = Depends(get_db)):
    """Delete startup"""
    startup = db.query(Startup).filter(Startup.id == startup_id).first()
    if not startup:
        raise HTTPException(status_code=404, detail="Startup not found")
    
    db.delete(startup)
    db.commit()
    return {"message": "Startup deleted successfully"}


@router.post("/upload", response_model=PitchDocumentResponse)
async def upload_pitch(
    name: str = Form(...),
    industry: Optional[str] = Form(None),
    stage: Optional[str] = Form(None),
    geography: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None),
    url: Optional[str] = Form(None),
    text: Optional[str] = Form(None),
    db: Session = Depends(get_db)
):
    """Upload pitch document (PDF, text, URL, MD, PPTX)"""
    # Create or get startup
    startup = db.query(Startup).filter(Startup.name == name).first()
    if not startup:
        startup = Startup(name=name, industry=industry, stage=stage, geography=geography)
        db.add(startup)
        db.commit()
        db.refresh(startup)
    
    # Determine content type and source
    content_type = None
    source_type = "file"
    extracted_text = None
    file_path = None
    
    if file:
        # File upload
        content_type = file.filename.split('.')[-1].lower() if '.' in file.filename else "text"
        os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
        file_path = os.path.join(settings.UPLOAD_DIR, f"{startup.id}_{file.filename}")
        
        with open(file_path, "wb") as f:
            content = await file.read()
            f.write(content)
        
        # Parse document
        parser = DocumentParserFactory.get_parser(content_type)
        extracted_text = parser.parse(file_path)
        
    elif url:
        # URL upload
        source_type = "url"
        content_type = "url"
        parser = DocumentParserFactory.get_parser("url")
        extracted_text = parser.parse(url)
        
    elif text:
        # Direct text
        source_type = "text"
        content_type = "text"
        extracted_text = text
    
    # Create pitch document
    pitch_doc = PitchDocument(
        startup_id=startup.id,
        file_path=file_path,
        content_type=content_type,
        source_type=source_type,
        extracted_text=extracted_text
    )
    db.add(pitch_doc)
    db.commit()
    db.refresh(pitch_doc)
    
    return pitch_doc

