from pydantic import BaseModel
from datetime import datetime
from typing import Dict, Any, Optional


class AgentConfigResponse(BaseModel):
    id: int
    agent_name: str
    model: str
    system_prompt: str
    prompts: Dict[str, Any]
    temperature: float
    max_tokens: int
    is_active: bool
    mcp_server_config: Optional[Dict[str, Any]]
    updated_at: datetime

    class Config:
        from_attributes = True


class AgentConfigUpdate(BaseModel):
    model: Optional[str] = None
    system_prompt: Optional[str] = None
    prompts: Optional[Dict[str, Any]] = None
    temperature: Optional[float] = None
    max_tokens: Optional[int] = None
    is_active: Optional[bool] = None
    mcp_server_config: Optional[Dict[str, Any]] = None

