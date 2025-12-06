from pydantic import BaseModel
from datetime import datetime
from typing import Dict, List, Any, Optional


class ScoringCreate(BaseModel):
    startup_id: int
    total_score: float
    breakdown: Dict[str, float]
    risks: List[Dict[str, Any]]
    recommendations: List[str]


class ScoringResponse(BaseModel):
    id: int
    startup_id: int
    total_score: float
    breakdown: Dict[str, float]
    risks: List[Dict[str, Any]]
    recommendations: List[str]
    team_info: Optional[Dict[str, Any]] = None
    created_at: datetime

    class Config:
        from_attributes = True

