from datetime import datetime
from pydantic import BaseModel, EmailStr


class ForgotPasswordLinkPrimaryKey(BaseModel):
    fk_user: int


# Shared properties
class ForgotPasswordLinkBase(BaseModel):
    value: str
    creation_date: datetime


class ForgotPasswordLinkCreate(
    ForgotPasswordLinkPrimaryKey,
    ForgotPasswordLinkBase
):
    pass


class ForgotPasswordLinkUpdate(
    ForgotPasswordLinkPrimaryKey,
    ForgotPasswordLinkBase
):
    pass


class ForgotPasswordLinkOut(
    ForgotPasswordLinkPrimaryKey,
    ForgotPasswordLinkBase
):
    pass


class ForgotPasswordLinkForm(BaseModel):
    user_mail: EmailStr


class ForgotPasswordChangeForm(BaseModel):
    new_password: str
    confirm_new_password: str


# Additional properties to return via API
class ForgotPasswordLinkDB(
    ForgotPasswordLinkPrimaryKey,
    ForgotPasswordLinkBase
):

    class Config:
        orm_mode = True
