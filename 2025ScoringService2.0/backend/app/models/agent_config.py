from sqlalchemy import Column, Integer, String, Text, Float, Boolean, DateTime, JSON, UniqueConstraint
from sqlalchemy.sql import func
from app.core.database import Base


class AgentConfig(Base):
    __tablename__ = "agent_configs"

    id = Column(Integer, primary_key=True, index=True)
    agent_name = Column(String, nullable=False, unique=True, index=True)
    model = Column(String, nullable=False)  # GigaChat model name
    system_prompt = Column(Text, nullable=False)
    prompts = Column(JSON, nullable=False)  # Template prompts
    temperature = Column(Float, default=0.7)
    max_tokens = Column(Integer, default=2000)
    is_active = Column(Boolean, default=True)
    mcp_server_config = Column(JSON, nullable=True)  # MCP server configuration (port, timeout, etc.)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    __table_args__ = (UniqueConstraint('agent_name', name='uq_agent_name'),)

