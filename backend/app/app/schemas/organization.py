from datetime import datetime
from uuid import UUID
from typing import Optional, Any

from pydantic import BaseModel, Field


# Shared properties
class OrganizationBase(BaseModel):
    name: str = ''
    slug: str = ''


class OrganizationCreate(OrganizationBase):
    pass


class OrganizationUpdate(OrganizationBase):
    pass


# Additional properties to return via API


class Organization(OrganizationBase):
    id: int

    class Config:
        orm_mode = True
