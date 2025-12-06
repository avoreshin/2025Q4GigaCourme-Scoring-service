from pydantic import BaseModel
from datetime import datetime


class CommentCreate(BaseModel):
    text: str


class CommentResponse(BaseModel):
    id: int
    scoring_id: int
    text: str
    created_at: datetime

    class Config:
        from_attributes = True

