from pydantic import BaseModel, Field
from datetime import datetime

class AccountBase(BaseModel):
    username: str
    email: str

class AccountRegister(AccountBase):
    password:str

class AccountLogin(BaseModel):
    access_token: str
    token_type: str

class AccountResponse(AccountBase):
    id: int
    created_at: datetime
    updated_at: datetime

