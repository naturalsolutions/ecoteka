from typing import Optional, List
from pydantic import BaseModel, EmailStr
from app.schemas.organization import OrganizationCurrentUser
import sqlalchemy


class UserPrimaryKey(BaseModel):
    id: int


# Shared properties
class UserBase(BaseModel):
    email: Optional[EmailStr] = None
    status: str = 'pending'
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


class CurrentUser(UserOut):
    organizations: List[OrganizationCurrentUser]


class UserDB(UserPrimaryKey, UserBase):
    hashed_password: str

    class Config:
        orm_mode = True


class UserInvite(BaseModel):
    email: EmailStr
    role: Optional[str]


class UserWithRole(UserOut):
    role: Optional[str]
