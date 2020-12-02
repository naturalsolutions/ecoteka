from datetime import datetime
from typing import Optional, Any
from pydantic import BaseModel

# Shared properties
class OrganizationBase(BaseModel):
    name: str = ""
    archived: bool = False
    config: Optional[Any]


class OrganizationCreate(OrganizationBase):
    parent_id: Optional[int]
    

class OrganizationUpdate(OrganizationBase):
    pass


# Additional properties to return via API


class Organization(OrganizationBase):
    id: int
    path: Optional[Any]
    has_working_area: bool = False
    slug: Optional[str]
    total_trees: Optional[int] = 0
    total_members: Optional[int] = 0
    archived: bool = False
    archived_at: Optional[datetime]

    class Config:
        orm_mode = True


class OrganizationCurrentUser(Organization):
    pass
