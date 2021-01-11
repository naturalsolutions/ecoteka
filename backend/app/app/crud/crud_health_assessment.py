from app.models import HealthAssessment
from app.schemas import HealthAssessmentCreate, HealthAssessmentUpdate
from app.crud.base import CRUDBase
import sqlalchemy as sa
from sqlalchemy.orm import Session

class CRUDHealthAssessment(CRUDBase[HealthAssessment, HealthAssessmentCreate, HealthAssessmentUpdate]):
    pass

health_assessment = CRUDHealthAssessment(HealthAssessment)
