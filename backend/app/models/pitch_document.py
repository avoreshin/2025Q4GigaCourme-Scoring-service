from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base


class PitchDocument(Base):
    __tablename__ = "pitch_documents"

    id = Column(Integer, primary_key=True, index=True)
    startup_id = Column(Integer, ForeignKey("startups.id"), nullable=False, index=True)
    file_path = Column(String, nullable=True)
    content_type = Column(String, nullable=False)  # pdf, text, url, markdown, pptx
    source_type = Column(String, nullable=False)  # file or url
    extracted_text = Column(Text, nullable=True)
    edited_text = Column(Text, nullable=True)
    is_edited = Column(Boolean, default=False)
    missing_info = Column(JSON, nullable=True)  # List of missing information
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    startup = relationship("Startup", back_populates="pitch_documents")

    @property
    def text_content(self):
        """Returns edited text if available, otherwise extracted text"""
        return self.edited_text if self.is_edited and self.edited_text else self.extracted_text

