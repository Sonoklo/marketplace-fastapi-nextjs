from pydantic import BaseModel
from datetime import datetime

class AccountBase(BaseModel):
    username: str

class AccountRegister(AccountBase):
    password:str

class AccountLogin(BaseModel):
    access_token: str
    token_type: str

class AccountResponse(AccountBase):
    id: int
    created_at: datetime
    updated_at: datetime

class TokenData(BaseModel):
    username: str
    user_id: int

class Token(BaseModel):
    access_token: str
    token_type: str

class ItemBase(BaseModel):
    name: str
    description: str
    count: int
    price: float
    category: str 

class ItemCreate(ItemBase):
    pass

class ItemResponse(ItemBase):
    id: int
    user_id: int

class ItemUpdate(BaseModel):
    name: str
    price: float
