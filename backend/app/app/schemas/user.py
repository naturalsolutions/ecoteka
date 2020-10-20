from typing import (
    List,
    Optional
)
from pydantic import (
    BaseModel,
    EmailStr
)


class UserPrimaryKey(BaseModel):
    id: int


# Shared properties
class UserBase(BaseModel):
    email: Optional[EmailStr] = None
    organization_id: int
    status: str = None
    is_superuser: bool = False
    full_name: Optional[str] = None
    is_verified: Optional[bool] = False


# Properties to receive via API on creation
class UserCreate(BaseModel):
    full_name: str
    email: EmailStr
    organization: str
    organization_id: Optional[int]
    password: str


# Properties to receive via API on update
class UserUpdate(UserBase):
    password: Optional[str] = None


class OrganizationBase(BaseModel):
    name: str = ''
    slug: str = ''


class Organization(OrganizationBase):
    id: int

    class Config:
        orm_mode = True


class UserOut(UserPrimaryKey, UserBase):

    # organization: Organization

    class Config:
        orm_mode = True


class UserMeOut(UserPrimaryKey, UserBase):

    organization: Organization

    class Config:
        orm_mode = True


class UserDB(UserPrimaryKey, UserBase):
    hashed_password: str

    class Config:
        orm_mode = True
