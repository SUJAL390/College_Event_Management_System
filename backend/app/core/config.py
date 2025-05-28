from typing import Any, Dict, Optional, List, Union
from pydantic import BaseModel

class Settings(BaseModel):
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "College Event Management System"
    
    # CORS Configuration
    BACKEND_CORS_ORIGINS: List[str] = ["http:# localhost:3000", "http:# localhost:8000"]
    
    # Database settings
    DATABASE_URL: str = "sqlite:# /./college_events.db"
    
    # JWT settings
    SECRET_KEY: str = "your-secret-key-here-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8  # 8 days

settings = Settings()

