from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models import Scoring, Startup, PitchDocument
from app.schemas.scoring import ScoringResponse, ScoringCreate
from app.schemas.comment import CommentCreate, CommentResponse
from app.services.scoring.scoring_service import ScoringService
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/scorings", tags=["scorings"])


@router.post("/startups/{startup_id}/score", response_model=ScoringResponse)
def create_scoring(startup_id: int, db: Session = Depends(get_db)):
    """Create scoring for startup"""
    logger.info(f"[API] Starting scoring request for startup_id={startup_id}")
    
    startup = db.query(Startup).filter(Startup.id == startup_id).first()
    if not startup:
        logger.warning(f"[API] Startup not found: startup_id={startup_id}")
        raise HTTPException(status_code=404, detail="Startup not found")
    
    # Get latest pitch document
    pitch_doc = db.query(PitchDocument).filter(
        PitchDocument.startup_id == startup_id
    ).order_by(PitchDocument.created_at.desc()).first()
    
    if not pitch_doc:
        logger.warning(f"[API] No pitch document found for startup_id={startup_id}")
        raise HTTPException(status_code=404, detail="No pitch document found for this startup")
    
    text = pitch_doc.text_content
    if not text:
        logger.warning(f"[API] No text content available for startup_id={startup_id}")
        raise HTTPException(status_code=400, detail="No text content available for scoring")
    
    logger.info(f"[API] Pitch document found. Text length: {len(text)} chars")
    
    # Run scoring service
    logger.info(f"[API] Calling ScoringService.score_startup()")
    scoring_service = ScoringService(db)
    scoring_result = scoring_service.score_startup(text, startup_id)
    logger.info(f"[API] Scoring completed. Total score: {scoring_result.get('total_score', 'N/A')}")
    
    # Create scoring record
    scoring = Scoring(
        startup_id=startup_id,
        total_score=scoring_result["total_score"],
        breakdown=scoring_result["breakdown"],
        risks=scoring_result["risks"],
        recommendations=scoring_result["recommendations"],
        team_info=scoring_result.get("team_info", {})
    )
    db.add(scoring)
    db.commit()
    db.refresh(scoring)
    
    return scoring


@router.get("/", response_model=List[ScoringResponse])
def get_scorings(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get list of scorings"""
    return db.query(Scoring).order_by(Scoring.created_at.desc()).offset(skip).limit(limit).all()


@router.get("/{scoring_id}", response_model=ScoringResponse)
def get_scoring(scoring_id: int, db: Session = Depends(get_db)):
    """Get scoring by ID"""
    scoring = db.query(Scoring).filter(Scoring.id == scoring_id).first()
    if not scoring:
        raise HTTPException(status_code=404, detail="Scoring not found")
    
    # Include startup information
    if scoring.startup:
        # This will be serialized automatically by Pydantic
        pass
    
    return scoring


@router.post("/{scoring_id}/comments", response_model=CommentResponse)
def create_comment(
    scoring_id: int,
    comment: CommentCreate,
    db: Session = Depends(get_db)
):
    """Add comment to scoring"""
    scoring = db.query(Scoring).filter(Scoring.id == scoring_id).first()
    if not scoring:
        raise HTTPException(status_code=404, detail="Scoring not found")
    
    from app.models import Comment
    db_comment = Comment(scoring_id=scoring_id, text=comment.text)
    db.add(db_comment)
    db.commit()
    db.refresh(db_comment)
    
    return db_comment

