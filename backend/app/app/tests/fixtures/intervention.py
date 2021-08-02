from typing import Optional
import pytest
from app.models.intervention import Intervention
from app.schemas.intervention import EnumInterventionType, InterventionCreate
from app.crud import crud_intervention

@pytest.fixture
def create_intervention(db, create_tree):
    def decorator(
        organization_id: int, 
        user_id: int, 
        tree_id: Optional[int] = None,
        intervention_type: EnumInterventionType = EnumInterventionType.pruning,
        **kwargs
    ) -> Intervention:
        if tree_id is None:
            tree = create_tree(organization_id, user_id)
            tree_id = tree.id
        
        kwargs.get("intervention_type", "pruning")

        new_intervention = InterventionCreate(
            tree_id = tree_id,
            organization_id = organization_id,
            intervention_type=intervention_type,
            **kwargs
        )
        return crud_intervention.intervention.create(db, obj_in=new_intervention)

    return decorator

