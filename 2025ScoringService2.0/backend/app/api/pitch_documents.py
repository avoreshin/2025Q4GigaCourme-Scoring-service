from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models import PitchDocument
from app.schemas.pitch_document import PitchDocumentResponse, PitchDocumentUpdate
from app.services.analysis.missing_info_analyzer import MissingInfoAnalyzer

router = APIRouter(prefix="/api/pitch-documents", tags=["pitch-documents"])


@router.get("/{document_id}", response_model=PitchDocumentResponse)
def get_pitch_document(document_id: int, db: Session = Depends(get_db)):
    """Get pitch document by ID"""
    doc = db.query(PitchDocument).filter(PitchDocument.id == document_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Pitch document not found")
    return doc


@router.put("/{document_id}/text", response_model=PitchDocumentResponse)
def update_pitch_text(
    document_id: int,
    update: PitchDocumentUpdate,
    db: Session = Depends(get_db)
):
    """Update extracted text of pitch document"""
    doc = db.query(PitchDocument).filter(PitchDocument.id == document_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Pitch document not found")
    
    if update.edited_text is not None:
        doc.edited_text = update.edited_text
        doc.is_edited = True
    
    if update.missing_info is not None:
        doc.missing_info = update.missing_info
    
    db.commit()
    db.refresh(doc)
    return doc


@router.post("/{document_id}/analyze-missing", response_model=PitchDocumentResponse)
def analyze_missing_info(document_id: int, db: Session = Depends(get_db)):
    """Analyze missing information in pitch document"""
    doc = db.query(PitchDocument).filter(PitchDocument.id == document_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Pitch document not found")
    
    text = doc.text_content
    if not text:
        raise HTTPException(status_code=400, detail="No text content available")
    
    analyzer = MissingInfoAnalyzer()
    missing_info = analyzer.analyze(text)
    
    doc.missing_info = missing_info
    db.commit()
    db.refresh(doc)
    
    return doc

