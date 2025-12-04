from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class StartupBase(BaseModel):
    name: str
    industry: Optional[str] = None
    stage: Optional[str] = None
    geography: Optional[str] = None


class StartupCreate(StartupBase):
    pass


class StartupUpdate(BaseModel):
    name: Optional[str] = None
    industry: Optional[str] = None
    stage: Optional[str] = None
    geography: Optional[str] = None


class StartupResponse(StartupBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

