from sqlalchemy.orm import Session
from backend.app.models.models import Account
from typing import Optional
from backend.app.core.security import get_password_hash, verify_password
import datetime
from jose import jwt
from backend.app.core.config import settings
from fastapi import HTTPException

def create_access_token(data: dict["sub":str, "user_id": int, "exp":datetime.timedelta]) -> str:
    data["exp"] = datetime.datetime.now() + data["exp"]
    token = jwt.encode(data, settings.SECRET_KEY, settings.ALGORITHM)
    return token

def verify_access_token(token:str) -> Optional[dict]:
    try:
        data = jwt.decode(token, settings.SECRET_KEY, settings.ALGORITHM)
        return data
    except:
        return None