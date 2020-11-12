from typing import Optional
from pydantic import BaseModel, Json
from typing import Any, Set
from datetime import datetime
from enum import Enum


class EnumInterventionType(str, Enum):
    pruning = 'pruning'
    felling = 'felling'
    streanremoval = 'streanremoval'
    indepthdiagnostic = 'indepthdiagnostic'
    treatment = 'treatment'
    surveillance = 'surveillance'


class InterventionBase(BaseModel):
    intervention_type: EnumInterventionType
    tree_id: int
    intervenant: str
    intervention_start_date: Optional[datetime]
    intervention_end_date: Optional[datetime]
    date: Optional[datetime]
    done: bool = False
    estimated_cost: int
    required_documents: Set[str] = []
    required_material: Set[str] = []
    properties: Any


class InterventionCreate(InterventionBase):
    pass


class InterventionUpdate(InterventionBase):
    intervention_type: Optional[EnumInterventionType]
    tree_id: Optional[int]
    intervenant: Optional[str]
    intervention_start_date: Optional[datetime]
    intervention_end_date: Optional[datetime]
    date: Optional[datetime]
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
