"""
Initialize agent configurations in database from YAML files
"""
import os
import yaml
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.models import AgentConfig


def init_agent_configs():
    """Initialize agent configurations from YAML files"""
    db: Session = SessionLocal()
    
    agent_names = [
        "text_analyzer",
        "financial_analyzer",
        "market_analyzer",
        "team_analyzer",
        "risk_predictor"
    ]
    
    for agent_name in agent_names:
        # Check if config already exists
        existing = db.query(AgentConfig).filter(
            AgentConfig.agent_name == agent_name
        ).first()
        
        if existing:
            print(f"Config for {agent_name} already exists, skipping...")
            continue
        
        # Load from YAML
        config_path = os.path.join(
            "app", "services", "agents", agent_name, "config.yaml"
        )
        
        if not os.path.exists(config_path):
            print(f"Config file not found for {agent_name}: {config_path}")
            continue
        
        with open(config_path, 'r', encoding='utf-8') as f:
            config_data = yaml.safe_load(f)
        
        # Create config in DB
        agent_config = AgentConfig(
            agent_name=agent_name,
            model=config_data.get("model", "GigaChat-Pro"),
            system_prompt=config_data.get("system_prompt", ""),
            prompts=config_data.get("prompts", {}),
            temperature=config_data.get("temperature", 0.7),
            max_tokens=config_data.get("max_tokens", 2000),
            is_active=True,
            mcp_server_config=config_data.get("mcp_server_config", {})
        )
        
        db.add(agent_config)
        print(f"Initialized config for {agent_name}")
    
    db.commit()
    db.close()
    print("Agent configurations initialized successfully!")


if __name__ == "__main__":
    init_agent_configs()

