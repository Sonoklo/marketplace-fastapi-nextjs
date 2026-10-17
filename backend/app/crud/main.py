from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime, timezone
from jose import jwt
from fastapi import HTTPException, status

from app.models.models import Account, Item
from app.core.security import get_password_hash, verify_password
from app.core.config import settings
from app.schemas.schemas import *

def get_account_by_username(username:str, db:Session) -> Account:
    return db.query(Account).filter_by(username=username).first()

def get_account_by_email(email:str, db:Session) -> Account:
    return db.query(Account).filter_by(email=email).first()

def create_account(account:AccountRegister, db:Session) -> AccountResponse:
    hash_password = get_password_hash(account.password)
    db_account = Account(username = account.username, password=hash_password, email=account.email)
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
        
def get_items(user_id:int, db:Session) -> list[ItemResponse]:
    items: list[Item] = db.query(Item).filter_by(user_id=user_id).all()
    return items

def create_item(item: ItemCreate, db: Session, user_id: int) -> Item:
    db_item = Item(name=item.name, description=item.description, count=item.count, price=item.price, category=item.category, user_id=user_id)
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

def update_item(item_id:int, item:ItemUpdate, db:Session) -> ItemResponse:
    db_item= db.query(Item).filter_by(id=item_id).first()
    if not db_item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Предмет не найден")
    db_item.name = item.name
    db_item.price = item.price
    db.commit()
    db.refresh(db_item)
    return db_item

def delete_item(item_id:int, db:Session) -> None:
    db_item = db.query(Item).filter_by(id=item_id).first()
    if not db_item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Предмет не найден")
    db.delete(db_item)
    db.commit()

def get_item(item_id:int, db:Session) -> ItemResponse:
    db_item = db.query(Item).filter_by(id=item_id).first()
    if not db_item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Предмет не найден")
    return db_item

def get_items_by_user(user_id:int, db:Session) -> list[ItemResponse]:
    items: list[Item] = db.query(Item).filter_by(user_id=user_id).all()
    return items