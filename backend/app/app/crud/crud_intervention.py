from app.models import Intervention
from app.schemas import (
    InterventionCreate,
    InterventionUpdate
)
from app.crud.base import CRUDBase

class CRUDIntervention (CRUDBase[Intervention, InterventionCreate, InterventionUpdate]):
    pass

intervention = CRUDIntervention(Intervention)