from backend.app.db.database import Base
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

class Account(Base):
    __tablename__ = "accounts"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    username = Column(String(20), unique=True, nullable=False)
    email = Column(String(30), unique=True, index=True, nullable=False)
    password = Column(String(255), nullable=False)

    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)