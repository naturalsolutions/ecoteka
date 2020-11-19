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
class UserCreate(BaseModel):
    full_name: str
    email: EmailStr
    password: str


# Properties to receive via API on update
class UserUpdate(UserBase):
    password: Optional[str] = None


class UserOut(UserPrimaryKey, UserBase):

    class Config:
        orm_mode = True


class UserDB(UserPrimaryKey, UserBase):
    hashed_password: str

    class Config:
        orm_mode = True

class UserInvite(BaseModel):
    email: EmailStr
    role: Optional[str]
