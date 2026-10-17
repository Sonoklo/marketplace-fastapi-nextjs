from pydantic import BaseModel, Field, EmailStr
from datetime import datetime

class AccountBase(BaseModel):
    username: str

class AccountRegister(AccountBase):
    email: EmailStr = Field(min_length=1, max_length=255, description="Email address of the user")
    password: str = Field(
        min_length=8,
        max_length=128,
        pattern=r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':\"\\|,.<>/?]).+$",
        description="Password of the user"
    )

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
