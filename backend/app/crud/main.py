from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime, timezone, timedelta
from jose import jwt
from fastapi import HTTPException, status

from app.models.models import Account, Item, Purchase, Category, Bookmark
from app.core.security import get_password_hash, verify_password
from app.core.config import settings
from app.schemas.schemas import *

def get_account_by_username(username:str, db:Session) -> Account:
    return db.query(Account).filter_by(username=username).first()

def get_account_by_email(email:str, db:Session) -> Account:
    return db.query(Account).filter_by(email=email).first()

def get_account_by_id(user_id:int, db:Session) -> Account:
    return db.query(Account).filter_by(id=user_id).first()

def create_account(account:AccountRegister, db:Session) -> AccountResponse:
    if account.password != account.repeat_password:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Пароли не совпадают")
    if get_account_by_username(account.username, db):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Аккаунт с данным юзернеймом уже существует")
    if get_account_by_email(account.email, db):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Аккаунт с данным email уже существует")
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

def get_account_items(user_id:int, db:Session) -> list[Item]:
    return db.query(Item).filter_by(user_id=user_id).all()

def get_account_purchases(user_id:int, db:Session) -> list[Purchase]:
    return db.query(Purchase).filter_by(account_id=user_id).all()

def get_profile(user_id:int, db:Session) -> ProfileResponse:
    account: Account = get_account_by_id(user_id, db)
    items: list[Item] = get_account_items(user_id, db)
    purchases: list[Purchase] = get_account_purchases(user_id, db)
    return ProfileResponse(id=account.id, username=account.username, email=account.email, items=items, purchases=purchases)

def update_account(account:AccountUpdate, db:Session, user_id:int) -> Account:
    db_account: Account = get_account_by_id(user_id, db)
    if account.username:
        user = get_account_by_username(account.username, db)
        if user and user.id != user_id:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Юзернейм уже занят")
        db_account.username = account.username
    if account.email:
        user = get_account_by_email(account.email, db)
        if user and user.id != user_id:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email уже занят")
        db_account.email = account.email
    if account.password:
        if not account.repeat_password:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Подтвердите пароль")
        if account.password != account.repeat_password:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Пароли не совпадают")
        db_account.password = get_password_hash(account.password)
    db.commit()
    db.refresh(db_account)
    access_token_expires = timedelta(minutes=settings.TOKEN_EXPIRES_TIME)
    token = create_access_token(data={"sub": db_account.username, "user_id": db_account.id, "exp":access_token_expires})
    return AccountUpdateWithTokenResponse(access_token=token, token_type="bearer", db_account=AccountResponse.model_validate(db_account))

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
        
def get_items(db:Session) -> list[ItemResponse]:
    items: list[Item] = db.query(Item).all()
    return items

def create_item(item: ItemCreate, db: Session, user_id: int) -> Item:
    category_names = {name.strip() for name in item.categories.split(",")}
    categories = []
    for name in category_names:
        category = db.query(Category).filter_by(name=name).first()
        if category is None:
            category = Category(name=name)
            db.add(category)
            db.flush()
        categories.append(category)
    db_item = Item(
        name=item.name,
        description=item.description,
        count=item.count,
        price=item.price,
        user_id=user_id,
        categories=categories,
    )
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

def update_item(user_id:int,item_id:int, item:ItemUpdate, db:Session) -> ItemResponse:
    db_item= db.query(Item).filter_by(id=item_id).first()
    if not db_item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Предмет не найден")
    if db_item.user_id != user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Нет прав на редактирование этого товара")
    if item.name:
        db_item.name = item.name
    if item.description:
        db_item.description = item.description
    if item.price:
        db_item.price = item.price
    if item.count:
        db_item.count = item.count
    if item.category:
        category_names = {name.strip() for name in item.category}
        categories = []
        for name in category_names:
            category = db.query(Category).filter_by(name=name).first()
            if category is None:
                category = Category(name=name)
                db.add(category)
                db.flush()
            categories.append(category)
        db_item.categories = categories
    db.commit()
    db.refresh(db_item)
    return db_item

def delete_item(user_id:int,item_id:int, db:Session) -> None:
    db_item = db.query(Item).filter_by(id=item_id).first()
    if not db_item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Предмет не найден")
    if db_item.user_id != user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Нет прав на удаление этого товара")
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

def buy_item(user_id:int, item_id:int, count:int, db:Session) -> PurchaseResponse:
    db_item = get_item(item_id, db)
    if db_item.user_id == user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Запрещено покупать свой товар")
    if db_item.count < count:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Недостаточно товара")
    purchase = Purchase(account_id=user_id, item_id=item_id, count=count, price=count*db_item.price)
    db_item.count -= count
    db.add(db_item)
    db.add(purchase)
    db.commit()
    db.refresh(db_item)
    db.refresh(purchase)
    purchase.item = db_item
    return purchase

def add_bookmark(bookmark:BookmarkCreate, db:Session, user_id:int) -> Bookmark:
    db_bookmark = Bookmark(account_id=user_id, item_id=bookmark.item_id)
    db.add(db_bookmark)
    db.commit()
    db.refresh(db_bookmark)
    return db_bookmark

def get_bookmarks(user_id:int, db:Session) -> list[BookmarkResponse]:
    bookmarks: list[Bookmark] = db.query(Bookmark).filter_by(account_id=user_id).all()
    return bookmarks

def delete_bookmark(user_id:int, db:Session, bookmark_id:int) -> None:
    bookmark = db.query(Bookmark).filter_by(account_id=user_id, id=bookmark_id).first()
    if not bookmark:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Закладка не найдена")
    db.delete(bookmark)
    db.commit()
    return None