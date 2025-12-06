from app.core.database import engine, Base
from app.models import Startup, PitchDocument, Scoring, Comment, AgentConfig
from app.core.init_agents import init_agent_configs


def init_db():
    """Initialize database tables"""
    Base.metadata.create_all(bind=engine)
    print("Database tables created successfully!")
    
    # Initialize agent configurations
    try:
        init_agent_configs()
    except Exception as e:
        print(f"Warning: Could not initialize agent configs: {e}")


if __name__ == "__main__":
    init_db()

