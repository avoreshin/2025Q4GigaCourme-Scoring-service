from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models import AgentConfig
from app.schemas.agent_config import AgentConfigResponse, AgentConfigUpdate
import yaml
import os

router = APIRouter(prefix="/api/agents", tags=["agents"])


@router.get("/configs", response_model=List[AgentConfigResponse])
def get_all_agent_configs(db: Session = Depends(get_db)):
    """Get all agent configurations"""
    return db.query(AgentConfig).all()


@router.get("/configs/{agent_name}", response_model=AgentConfigResponse)
def get_agent_config(agent_name: str, db: Session = Depends(get_db)):
    """Get agent configuration by name"""
    config = db.query(AgentConfig).filter(AgentConfig.agent_name == agent_name).first()
    if not config:
        raise HTTPException(status_code=404, detail=f"Agent config '{agent_name}' not found")
    return config


@router.put("/configs/{agent_name}", response_model=AgentConfigResponse)
def update_agent_config(
    agent_name: str,
    update: AgentConfigUpdate,
    db: Session = Depends(get_db)
):
    """Update agent configuration"""
    config = db.query(AgentConfig).filter(AgentConfig.agent_name == agent_name).first()
    if not config:
        raise HTTPException(status_code=404, detail=f"Agent config '{agent_name}' not found")
    
    update_data = update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(config, field, value)
    
    db.commit()
    db.refresh(config)
    return config


@router.post("/configs/{agent_name}/reset", response_model=AgentConfigResponse)
def reset_agent_config(agent_name: str, db: Session = Depends(get_db)):
    """Reset agent configuration to default from YAML"""
    config = db.query(AgentConfig).filter(AgentConfig.agent_name == agent_name).first()
    if not config:
        raise HTTPException(status_code=404, detail=f"Agent config '{agent_name}' not found")
    
    # Load default config from YAML
    config_path = os.path.join(
        "app", "services", "agents", agent_name, "config.yaml"
    )
    
    if os.path.exists(config_path):
        with open(config_path, 'r', encoding='utf-8') as f:
            default_config = yaml.safe_load(f)
        
        config.model = default_config.get("model", config.model)
        config.system_prompt = default_config.get("system_prompt", config.system_prompt)
        config.prompts = default_config.get("prompts", config.prompts)
        config.temperature = default_config.get("temperature", config.temperature)
        config.max_tokens = default_config.get("max_tokens", config.max_tokens)
        config.mcp_server_config = default_config.get("mcp_server_config", config.mcp_server_config)
        
        db.commit()
        db.refresh(config)
    
    return config

