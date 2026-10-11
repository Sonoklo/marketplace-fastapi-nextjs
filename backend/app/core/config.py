from pydantic_settings import BaseSettings
from functools import lru_cache
from dotenv import load_dotenv
import os

load_dotenv()

class Settings(BaseSettings):
    DOCS_URL:str ="/docs"
    OPENAPI_URL: str = "/openapi.json"
    
    DEBUG: bool = True

    DATABASE_URL:str = os.getenv("DATABASE_URL")
    ECHO:bool = True
    POOL_PRE_PING:bool=True
    POOL_SIZE:int=5
    MAX_OVERFLOW:int=10

    TOKEN_EXPIRES_TIME: int = os.getenv("TOKEN_EXPIRES_TIME")
    SECRET_KEY: str = os.getenv("SECRET_KEY")
    ALGORITHM: str = os.getenv("ALGORITHM")

@lru_cache()
def get_settings() -> Settings:
    settings = Settings()
    return settings

settings = get_settings()