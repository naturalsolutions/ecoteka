from typing import Optional
from pydantic import (
    BaseModel,
    EmailStr
)


class UserPrimaryKey(BaseModel):
    id: int


# Shared properties
class UserBase(BaseModel):
    email: Optional[EmailStr] = None
    status: str = None
    is_superuser: bool = False
    full_name: Optional[str] = None
    is_verified: Optional[bool] = False


# Properties to receive via API on creation
class UserCreate(UserBase):
    email: EmailStr
    password: str


# Properties to receive via API on update
class UserUpdate(UserPrimaryKey, UserBase):
    password: Optional[str] = None


class UserOut(UserPrimaryKey, UserBase):
    pass


class UserDB(UserPrimaryKey, UserBase):
    hashed_password: str

    class Config:
        orm_mode = True
