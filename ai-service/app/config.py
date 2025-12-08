from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    # Google API
    google_api_key: str = ""
    
    # MySQL Database
    mysql_host: str = "localhost"
    mysql_port: int = 3306
    mysql_database: str = "matcha_db"
    mysql_user: str = "root"
    mysql_password: str = ""
    
    # ChromaDB
    chroma_persist_directory: str = "./chroma_data"
    
    # Server
    host: str = "0.0.0.0"
    port: int = 8001
    
    class Config:
        env_file = ".env"
        case_sensitive = False


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()
