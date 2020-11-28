from datetime import datetime
from pydantic import BaseModel


class RegistrationLinkPrimaryKey(BaseModel):
    fk_user: int


# Shared properties
class RegistrationLinkBase(BaseModel):
    value: str
    creation_date: datetime


class RegistrationLinkCreate(RegistrationLinkPrimaryKey, RegistrationLinkBase):
    pass


class RegistrationLinkUpdate(RegistrationLinkPrimaryKey, RegistrationLinkBase):
    pass


class RegistrationLinkOut(RegistrationLinkPrimaryKey, RegistrationLinkBase):
    pass


# Additional properties to return via API
class RegistrationLinkDB(RegistrationLinkPrimaryKey, RegistrationLinkBase):
    class Config:
        orm_mode = True
