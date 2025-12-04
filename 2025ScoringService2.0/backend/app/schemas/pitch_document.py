from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List, Dict, Any


class PitchDocumentBase(BaseModel):
    content_type: str
    source_type: str


class PitchDocumentCreate(PitchDocumentBase):
    startup_id: int
    file_path: Optional[str] = None
    extracted_text: Optional[str] = None


class PitchDocumentUpdate(BaseModel):
    edited_text: Optional[str] = None
    is_edited: Optional[bool] = None
    missing_info: Optional[List[Dict[str, Any]]] = None


class PitchDocumentResponse(PitchDocumentBase):
    id: int
    startup_id: int
    file_path: Optional[str]
    extracted_text: Optional[str]
    edited_text: Optional[str]
    is_edited: bool
    missing_info: Optional[List[Dict[str, Any]]]
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True

