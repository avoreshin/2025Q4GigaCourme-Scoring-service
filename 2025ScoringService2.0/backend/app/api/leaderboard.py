from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import desc, func, and_
from typing import List, Optional
from app.core.database import get_db
from app.models import Startup, Scoring
from app.schemas.startup import StartupResponse

router = APIRouter(prefix="/api/leaderboard", tags=["leaderboard"])


@router.get("/", response_model=List[dict])
def get_leaderboard(
    limit: int = 50,
    industry: Optional[str] = None,
    stage: Optional[str] = None,
    geography: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get top startups leaderboard"""
    # Get latest scoring for each startup
    subquery = db.query(
        Scoring.startup_id,
        func.max(Scoring.created_at).label('latest_date')
    ).group_by(Scoring.startup_id).subquery()
    
    query = db.query(
        Startup,
        Scoring.total_score,
        Scoring.id.label('scoring_id')
    ).join(
        Scoring, Startup.id == Scoring.startup_id
    ).join(
        subquery,
        and_(
            Scoring.startup_id == subquery.c.startup_id,
            Scoring.created_at == subquery.c.latest_date
        )
    )
    
    if industry:
        query = query.filter(Startup.industry == industry)
    if stage:
        query = query.filter(Startup.stage == stage)
    if geography:
        query = query.filter(Startup.geography == geography)
    
    results = query.order_by(desc(Scoring.total_score)).limit(limit).all()
    
    leaderboard = []
    for rank, (startup, score, scoring_id) in enumerate(results, 1):
        leaderboard.append({
            "rank": rank,
            "startup": {
                "id": startup.id,
                "name": startup.name,
                "industry": startup.industry,
                "stage": startup.stage,
                "geography": startup.geography
            },
            "score": float(score),
            "scoring_id": scoring_id
        })
    
    return leaderboard

