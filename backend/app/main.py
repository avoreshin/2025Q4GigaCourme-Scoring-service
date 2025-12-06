from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api import startups, pitch_documents, scorings, leaderboard, export, agents
from app.core.database import engine, Base
from app.core.init_agents import init_agent_configs
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)
logger.info("Starting Startup Scoring API")

app = FastAPI(
    title="Startup Scoring API",
    description="API для системы скоринга стартапов",
    version="1.0.0"
)

@app.on_event("startup")
async def startup_event():
    """Initialize database on startup"""
    try:
        logger.info("Initializing database...")
        # Create all tables if they don't exist
        Base.metadata.create_all(bind=engine)
        logger.info("Database tables created/verified successfully!")
        
        # Initialize agent configurations
        try:
            init_agent_configs()
            logger.info("Agent configurations initialized successfully!")
        except Exception as e:
            logger.warning(f"Could not initialize agent configs: {e}")
    except Exception as e:
        logger.error(f"Database initialization error: {e}")
        # Don't fail startup, but log the error

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "https://lealu.ru",
        "http://lealu.ru",
        "http://109.69.21.37",
        "http://www.lealu.ru",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(startups.router)
app.include_router(pitch_documents.router)
app.include_router(scorings.router)
app.include_router(leaderboard.router)
app.include_router(export.router)
app.include_router(agents.router)

@app.get("/")
async def root():
    return {"message": "Startup Scoring API"}

@app.get("/health")
async def health():
    return {"status": "ok"}
