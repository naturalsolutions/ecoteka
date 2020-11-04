from typing import Optional
from pydantic import BaseModel, Json
from typing import Any, Set
from datetime import date


class InterventionBase(BaseModel):
    intervention_type: str
    tree_id: int
    intervenant: str
    intervention_start_date: Optional[date]
    intervention_end_date: Optional[date]
    date: Optional[date]
    done: bool = False
    estimated_cost: int
    required_documents: Set[str] = []
    required_material: Set[str] = []
    properties: Any


class InterventionCreate(InterventionBase):
    pass


class InterventionUpdate(InterventionBase):
    intervention_type: Optional[str]
    tree_id: Optional[int]
    intervenant: Optional[str]
    intervention_start_date: Optional[date]
    intervention_end_date: Optional[date]
    date: Optional[date]
    done: Optional[bool]
    estimated_cost: Optional[int]
    required_documents: Optional[Set[str]]
    required_material: Optional[Set[str]]
    properties: Optional[Any]


class Intervention(InterventionBase):
    id: int
    organization_id: int

    class Config:
        orm_mode = True
