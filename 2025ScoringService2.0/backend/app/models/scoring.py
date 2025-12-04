from sqlalchemy import Column, Integer, Float, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base


class Scoring(Base):
    __tablename__ = "scorings"

    id = Column(Integer, primary_key=True, index=True)
    startup_id = Column(Integer, ForeignKey("startups.id"), nullable=False, index=True)
    total_score = Column(Float, nullable=False)  # 0-100
    breakdown = Column(JSON, nullable=False)  # Scores by 8 categories
    risks = Column(JSON, nullable=False)  # Top 5 risks
    recommendations = Column(JSON, nullable=False)  # Recommendations
    team_info = Column(JSON, nullable=True)  # Team information from team_analyzer
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    startup = relationship("Startup", back_populates="scorings")
    comments = relationship("Comment", back_populates="scoring", cascade="all, delete-orphan")

