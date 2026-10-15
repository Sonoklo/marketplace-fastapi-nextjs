from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime, timezone
from jose import jwt
from fastapi import HTTPException, status

from app.models.models import Account
from app.core.security import get_password_hash, verify_password
from app.core.config import settings
from app.schemas.schemas import *

def get_account_by_username(username:str, db:Session) -> Account:
    return db.query(Account).filter_by(username=username).first()

def create_account(account:AccountRegister, db:Session) -> AccountResponse:
    hash_password = get_password_hash(account.password)
    db_account = Account(username = account.username, password=hash_password)
    db.add(db_account)
    db.commit()
    db.refresh(db_account)
    return db_account

def get_account(username:str, password:str, db:Session) -> Account:
    account: Account = get_account_by_username(username, db)
    if not account:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Аккаунта с данным юзернеймом не существует")
    if not verify_password(password, account.password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Пароль не верный")
    return account
    
def create_access_token(data:dict)->str:
    to_encode=data.copy()
    expire=datetime.now(timezone.utc)+to_encode["exp"]
    to_encode["exp"]=expire
    token=jwt.encode(to_encode,settings.SECRET_KEY,algorithm=settings.ALGORITHM)
    return token

def verify_access_token(token:str) -> Optional[dict]:
    try:
        data = jwt.decode(token, settings.SECRET_KEY, settings.ALGORITHM)
        return data
    except:
        return None