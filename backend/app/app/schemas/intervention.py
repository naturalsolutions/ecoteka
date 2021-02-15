from typing import Optional
from pydantic import BaseModel, Json
from typing import Any, List
from datetime import datetime
from enum import Enum


class EnumInterventionType(str, Enum):
    pruning = "pruning"
    felling = "felling"
    streanremoval = "streanremoval"
    indepthdiagnostic = "indepthdiagnostic"
    treatment = "treatment"
    surveillance = "surveillance"


class InterventionBase(BaseModel):
    tree_id: int
    organization_id: Optional[int]
    intervention_type: EnumInterventionType
    intervenant: Optional[str]
    intervention_start_date: Optional[datetime]
    intervention_end_date: Optional[datetime]
    date: Optional[datetime]
    done: Optional[bool] = False
    estimated_cost: Optional[int]
    required_documents: Optional[List[str]] = []
    required_material: Optional[List[str]] = []
    properties: Any


class InterventionCreate(InterventionBase):
    pass


class InterventionUpdate(InterventionBase):
    pass


class Intervention(InterventionBase):
    id: int
    organization_id: int

    class Config:
        orm_mode = True
