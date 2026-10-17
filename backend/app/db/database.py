from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.ext.declarative import declarative_base
from typing import Generator
from app.core.config import settings

engine = create_engine(
    settings.DATABASE_URL,
    echo=settings.ECHO,
    pool_pre_ping=settings.POOL_PRE_PING,
    pool_size=settings.POOL_SIZE,
    max_overflow=settings.MAX_OVERFLOW
)


SessionLocal = sessionmaker(bind=engine,autocommit=False,autoflush=False,class_=Session)

Base = declarative_base()

def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    Base.metadata.create_all(bind=engine)