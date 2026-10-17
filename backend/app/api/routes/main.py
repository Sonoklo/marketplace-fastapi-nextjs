from fastapi import APIRouter, status, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta

from app.db.database import get_db
import app.crud.main as crud
from app.schemas.schemas import *
from app.models.models import Account, Item

from app.core import config
from app.core.dependencies import get_current_user

router_register = APIRouter(prefix="/register",tags=["Account","Auth"])
router_login = APIRouter(prefix="/login",tags=["Account","Auth"])
router_profile = APIRouter(prefix="/profile",tags=["Account","Auth"])
router_items = APIRouter(prefix="/items",tags=["Item"])

@router_register.post("/", status_code=status.HTTP_201_CREATED)
def register(account:AccountRegister, db:Session=Depends(get_db)) -> None:
    if account.password != account.repeat_password:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Пароли не совпадают")
    if crud.get_account_by_username(account.username, db):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Аккаунт с данным юзернеймом уже существует")
    if crud.get_account_by_email(account.email, db):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Аккаунт с данным email уже существует")
    crud.create_account(account, db)
    return None

@router_login.post("/", response_model=Token, status_code=status.HTTP_200_OK)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db:Session=Depends(get_db)) -> Token:
    db_account: Account = crud.get_account(username=form_data.username, password=form_data.password, db=db)
    if db_account:
        access_token_expires = timedelta(minutes=config.settings.TOKEN_EXPIRES_TIME)
        token = crud.create_access_token(data={"sub": db_account.username, "user_id": db_account.id, "exp":access_token_expires},)
        return Token(access_token=token, token_type="bearer")

@router_profile.get("/", response_model=AccountResponse, status_code=status.HTTP_200_OK)
def get_profile(current_user: Account = Depends(get_current_user)) -> Account:
    return current_user

@router_profile.post("/items", response_model=ItemResponse, status_code=status.HTTP_201_CREATED)
def add_item(item: ItemCreate, db: Session = Depends(get_db), current_user: Account = Depends(get_current_user)) -> Item:
    return crud.create_item(item=item, db=db, user_id=current_user.id)

