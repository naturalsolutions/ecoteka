from datetime import datetime
from typing import Optional, Any
from pydantic import BaseModel, EmailStr

# Shared properties
class OrganizationBase(BaseModel):
    name: str = ""
    archived: bool = False
    config: Optional[Any]


class OrganizationCreate(OrganizationBase):
    parent_id: Optional[int]

class OrganizationCreateRoot(OrganizationBase):
    owner_email: Optional[EmailStr]
    pass


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
    current_user_role: Optional[str]

    class Config:
        orm_mode = True

class OrganizationCurrentUser(Organization):
    pass

class OrganizationMetrics(BaseModel):
    total_tree_count: int
    logged_trees_count: int
    planted_trees_count: int
    planned_interventions_cost: float
    scheduled_interventions_cost: float


