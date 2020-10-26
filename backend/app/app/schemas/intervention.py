from typing import Optional
from pydantic import BaseModel, Json
from typing import Any
from datetime import date

class InterventionBase(BaseModel):
    tree_id: int
    done: bool
    plan_date_from: date
    plan_date_to: date
    properties: Any

class InterventionCreate(InterventionBase):
    pass

class InterventionUpdate(InterventionBase):
    pass

class Intervention(InterventionBase):
    id: int

    class Config:
        orm_mode = True