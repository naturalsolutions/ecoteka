from datetime import datetime
import pytest

from app.models.tree import Tree
from app.models.intervention import Intervention
from app.models.user import User
from app.models.organization import Organization
from app.schemas.intervention import EnumInterventionType
from app.crud import crud_intervention

@pytest.fixture(scope="function", autouse=True)
def remove_data(db):
    db.query(Organization).delete()
    db.query(User).delete()
    db.query(Intervention).delete()
    db.query(Tree).delete()
    db.commit()

def test_get_by_organization(
    db,
    create_user, 
    create_organization_root,
    create_intervention
):
    user = create_user()
    organization = create_organization_root()
    interventions = [
        create_intervention(
            organization_id=organization.id, 
            user_id=user.id, 
            intervention_type=EnumInterventionType.felling
        ),
        create_intervention(
            organization_id=organization.id, 
            user_id=user.id,
            intervention_type=EnumInterventionType.pruning
        ),
        create_intervention(
            organization_id=organization.id, 
            user_id=user.id,
            intervention_type=EnumInterventionType.treatment
        )
    ]
    ids_interventions = [intervention.id for intervention in interventions]

    
    interventions_filtered = crud_intervention.intervention.get_by_organization(
        db, 
        organization_id=organization.id
    )
    ids_interventions_filtered = [intervention.id for intervention in interventions_filtered]

    assert len(interventions_filtered) == 3
    assert sorted(ids_interventions) == sorted(ids_interventions_filtered)

def test_get_planned_by_year(
    db,
    create_user, 
    create_organization_root,
    create_intervention
):
    user = create_user()
    organization = create_organization_root()
    interventions = [
        create_intervention(
            organization_id=organization.id, 
            user_id=user.id, 
            intervention_type=EnumInterventionType.felling,
            intervention_start_date=datetime(2019, 5, 13),
            intervention_end_date=datetime(2020, 6, 5)
        ),
        create_intervention(
            organization_id=organization.id, 
            user_id=user.id,
            intervention_type=EnumInterventionType.pruning,
            intervention_start_date=datetime(2020, 7, 13),
            intervention_end_date=datetime(2020, 10, 5)
        ),
        create_intervention(
            organization_id=organization.id, 
            user_id=user.id,
            intervention_type=EnumInterventionType.treatment,
            intervention_start_date=datetime(2021, 5, 13),
            intervention_end_date=datetime(2021, 6, 5)
        )
    ]
    ids_interventions = [intervention.id for intervention in interventions]

    
    interventions_filtered = crud_intervention.intervention.get_planned_by_year(
        db, 
        organization_id=organization.id,
        year=2020
    )
    ids_interventions_filtered = [intervention.id for intervention in interventions_filtered]

    assert len(interventions_filtered) == 2
    assert sorted([interventions[0].id, interventions[1].id]) == sorted(ids_interventions_filtered)

    
def test_get_by_intervention_type_and_year(
    db,
    create_user, 
    create_organization_root,
    create_intervention
):
    user = create_user()
    organization = create_organization_root()
    interventions = [
        create_intervention(
            organization_id=organization.id, 
            user_id=user.id, 
            intervention_type=EnumInterventionType.felling,
            intervention_start_date=datetime(2019, 5, 13),
            intervention_end_date=datetime(2020, 6, 5)
        ),
        create_intervention(
            organization_id=organization.id, 
            user_id=user.id,
            intervention_type=EnumInterventionType.pruning,
            intervention_start_date=datetime(2020, 7, 13),
            intervention_end_date=datetime(2020, 10, 5)
        ),
        create_intervention(
            organization_id=organization.id, 
            user_id=user.id,
            intervention_type=EnumInterventionType.treatment,
            intervention_start_date=datetime(2021, 5, 13),
            intervention_end_date=datetime(2021, 6, 5)
        )
    ]

    
    interventions_filtered = crud_intervention.intervention.get_by_intervention_type_and_year(
        db, 
        organization_id=organization.id,
        intervention_type=EnumInterventionType.felling,
        year=2020
    )
    
    assert len(interventions_filtered) == 1
    assert interventions[0].id == interventions_filtered[0].id

def test_get_scheduled_by_year(
    db,
    create_user, 
    create_organization_root,
    create_intervention
):
    user = create_user()
    organization = create_organization_root()
    interventions = [
        create_intervention(
            organization_id=organization.id, 
            user_id=user.id, 
            intervention_type=EnumInterventionType.felling,
            intervention_start_date=datetime(2019, 5, 13),
            intervention_end_date=datetime(2020, 6, 5)
        ),
        create_intervention(
            organization_id=organization.id, 
            user_id=user.id,
            intervention_type=EnumInterventionType.pruning,
            intervention_start_date=datetime(2020, 7, 13),
            intervention_end_date=datetime(2020, 10, 5),
            date=datetime(2020, 10, 4)
        ),
        create_intervention(
            organization_id=organization.id, 
            user_id=user.id,
            intervention_type=EnumInterventionType.treatment,
            intervention_start_date=datetime(2021, 5, 13),
            intervention_end_date=datetime(2021, 6, 5),
            date=datetime(2021, 6, 4)
        )
    ]
   
    
    interventions_filtered = crud_intervention.intervention.get_scheduled_by_year(
        db, 
        organization_id=organization.id,
        year=2020
    )
   
    assert len(interventions_filtered) == 1
    assert interventions[1].id == interventions_filtered[0].id

def test_get_by_tree(
    db,
    create_user, 
    create_organization_root,
    create_tree,
    create_intervention
):
    user = create_user()
    organization = create_organization_root()
    tree = create_tree(organization_id=organization.id, user_id=user.id)
    interventions = [
        create_intervention(
            organization_id=organization.id, 
            user_id=user.id, 
            tree_id=tree.id
        ),
        create_intervention(
            organization_id=organization.id, 
            user_id=user.id,
            tree_id=tree.id
        ),
        create_intervention(
            organization_id=organization.id, 
            user_id=user.id
        )
    ]
   
    
    interventions_filtered = crud_intervention.intervention.get_by_tree(
        db, 
        tree_id=tree.id
    )
    ids_interventions_filtered = [i.id for i in interventions_filtered]
   
    assert len(interventions_filtered) == 2
    assert sorted([interventions[0].id, interventions[1].id]) == sorted(ids_interventions_filtered)
