from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base


class Startup(Base):
    __tablename__ = "startups"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    industry = Column(String, nullable=True, index=True)
    stage = Column(String, nullable=True, index=True)
    geography = Column(String, nullable=True, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    pitch_documents = relationship("PitchDocument", back_populates="startup", cascade="all, delete-orphan")
    scorings = relationship("Scoring", back_populates="startup", cascade="all, delete-orphan")

