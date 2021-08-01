from datetime import datetime
from typing import Optional, Any
from pydantic import BaseModel, EmailStr
from enum import Enum
from geojson_pydantic.types import BBox
from geojson_pydantic.features import FeatureCollection, Feature

class OrganizationMode(str, Enum):
    PRIVATE = "private"
    OPEN = "open"
    PARTICIPATORY = "participatory"

class FindModeEnum(str, Enum):
    by_id = "by_id"
    by_slug = "by_slug"

# Shared properties
class OrganizationBase(BaseModel):
    name: str = ""
    archived: bool = False
    featured: bool = False
    mode: OrganizationMode
    osm_id: Optional[int]
    osm_place_id: Optional[int]
    osm_type: Optional[str]
    boundary_bbox_coords: Optional[BBox]
    boundary: Optional[FeatureCollection]
    coords: Optional[Feature]
    config: Optional[Any]
    population_size: Optional[int]
    area_sq_km: Optional[float]


class OrganizationCreate(OrganizationBase):
    parent_id: Optional[int]
    mode: OrganizationMode = OrganizationMode.PRIVATE
    created_at: datetime = datetime.now()
    updated_at: datetime = datetime.now()


class OrganizationCreateRoot(OrganizationBase):
    owner_email: Optional[EmailStr]
    created_at: datetime = datetime.now()
    updated_at: datetime = datetime.now()


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
    created_at: Optional[datetime]
    updated_at: Optional[datetime]
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


