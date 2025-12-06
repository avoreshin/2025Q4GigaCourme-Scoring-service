from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    DATABASE_URL: str
    GIGACHAT_API_KEY: Optional[str] = None
    GIGACHAT_AUTH_URL: str = "https://ngw.devices.sberbank.ru:9443/api/v2/oauth"
    SECRET_KEY: str = "your-secret-key-change-in-production"
    UPLOAD_DIR: str = "./uploads"
    MCP_BASE_PORT: int = 8000
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()

