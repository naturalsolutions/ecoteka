import pytest
from typing import Optional
from app.crud import crud_health_assessment
from app.schemas.health_assessment import HealthAssessmentCreate
from app.models.health_assessment import HealthAssessment
from datetime import datetime


@pytest.fixture
def generate_health_assessment_data(faker):
    def decorator_generate_health_assessment_data(
        organization_id: int,
        tree_id: int
    ) -> HealthAssessmentCreate:
        obj_in = HealthAssessmentCreate(
            tree_id=tree_id,
            organization_id=organization_id,
            date=datetime.now(),
            organ="crown",
            score=1,
            intervention_needed=True,
            problem="Bois mort",
            recommendation="Surveillance",
            comment=faker.sentence(nb_words=10),
            created_at=datetime.now(),
            updated_at=datetime.now()
        )

        return obj_in
    return decorator_generate_health_assessment_data

@pytest.fixture
def create_health_assessment(
    db, 
    generate_health_assessment_data):
    def decorator_create_health_assessment(
        organization_id: int,
        tree_id: int = None
    ) -> HealthAssessment:
        obj_in = generate_health_assessment_data(
            organization_id=organization_id,
            tree_id=tree_id
        )
        return crud_health_assessment.health_assessment.create(db, obj_in=obj_in)
    return decorator_create_health_assessment

@pytest.fixture
def delete_health_assessment(
    db
):
    def decorator(
        health_assessment_id: int
    ):
        crud_health_assessment.health_assessment.remove(db, id=health_assessment_id)
    return decorator