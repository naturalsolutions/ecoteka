from typing import Optional
from pydantic import BaseModel, Json
from typing import Any, Set
from datetime import datetime

class InterventionPeriod (BaseModel):
    startDate: datetime
    endDate: datetime

class InterventionBase(BaseModel):
    intervention_type: str
    x: int
    y: int
    intervenant: str
    intervention_period: InterventionPeriod
    done: bool = False
    estimated_cost : int
    required_documents: Set[str] = []
    required_material: Set[str] = []
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