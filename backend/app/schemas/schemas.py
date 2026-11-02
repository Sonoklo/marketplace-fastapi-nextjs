import re
from pydantic import BaseModel, Field, field_validator, EmailStr, ConfigDict
from datetime import datetime

class AccountBase(BaseModel):
    username: str = Field(
        min_length=1,
        max_length=20,
        pattern=r"^[a-zA-Z0-9_]+$",
        description="Username of the user",
    )

class AccountRegister(AccountBase):
    email: EmailStr = Field(min_length=1, max_length=255, description="Email address of the user")
    password: str = Field(
        min_length=8,
        max_length=128,
        description="Password of the user"
    )
    repeat_password: str = Field(
        min_length=8,
        max_length=128,
        description="Repeat password of the user"
    )

    @field_validator("password")
    @classmethod
    def validate_password(cls, value: str) -> str:
        if not re.search(r"[a-z]", value):
            raise ValueError("Password must contain a lowercase letter")

        if not re.search(r"[A-Z]", value):
            raise ValueError("Password must contain an uppercase letter")

        if not re.search(r"\d", value):
            raise ValueError("Password must contain a digit")

        if not re.search(r"""[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]""", value):
            raise ValueError("Password must contain a special character")

        return value

class AccountResponse(AccountBase):
    id: int
    created_at: datetime
    updated_at: datetime

class AccountUpdate(BaseModel):
    username: str | None = Field(default=None, min_length=1, max_length=20, pattern=r"^[a-zA-Z0-9_]+$", description="Username of the user")
    email: EmailStr | None = Field(default=None, min_length=1, max_length=255, description="Email address of the user")
    password: str | None = Field(default=None, min_length=8, max_length=128, description="Password of the user")

class TokenData(BaseModel):
    username: str
    user_id: int

class Token(BaseModel):
    access_token: str = Field(
        description="JWT токен доступа",
        examples=["vcnbxcvbxcvbx..."]
    )
    token_type: str = Field(
        default="bearer",
        description="Тип токена"
    )

class CategoryResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    
class ItemBase(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    description: str | None = Field(default=None, max_length=1000)
    count: int = Field(default=1, ge=1)
    price: float = Field(gt=0)

class ItemCreate(ItemBase):
    categories: str

class ItemResponse(ItemBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    categories: list[CategoryResponse]

class ItemUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=255, description="Name of the item")
    description: str | None = Field(default=None, min_length=1, max_length=255, description="Description of the item")
    count: int | None = Field(default=None, gt=1, description="Count of the item")
    price: float | None = Field(default=None, gt=0, description="Price of the item")
    category: list[str] | None = Field(default=None, description="List of categories for the item")

class PurchaseRequest(BaseModel):
    item_id: int
    count: int = Field(gt=0, description="Quantity of items to buy")

class PurchaseBase(BaseModel):
    account_id: int
    item_id: int
    price: float
    count: int

class PurchaseResponse(PurchaseBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    created_at: datetime
    item: ItemResponse | None = None

class ProfileResponse(BaseModel):
    id: int
    username: str
    email: str
    items: list[ItemResponse]
    purchases: list[PurchaseResponse]