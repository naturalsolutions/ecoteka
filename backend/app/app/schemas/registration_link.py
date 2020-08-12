from datetime import datetime
from pydantic import BaseModel


# Shared properties
class RegistrationLinkBase(BaseModel):
    fk_user: int
    value: str
    creation_date: datetime


class RegistrationLinkCreate(RegistrationLinkBase):
    pass


class RegistrationLinkUpdate(RegistrationLinkBase):
    pass


# Additional properties to return via API
class Registration_Link(RegistrationLinkUpdate):

    class Config:
        orm_mode = True
