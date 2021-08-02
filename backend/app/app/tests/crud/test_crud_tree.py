import pytest

from app.models.tree import Tree
from app.models.intervention import Intervention
from app.models.user import User
from app.models.organization import Organization
from app.schemas.intervention import EnumInterventionType
from app.crud import crud_tree

@pytest.fixture(scope="function", autouse=True)
def remove_data(db):
    db.query(Organization).delete()
    db.query(User).delete()
    db.query(Intervention).delete()
    db.query(Tree).delete()
    db.commit()

def test_get_filters(db, create_organization_root, create_tree):
    organization = create_organization_root()
    properties_a = {
        "canonicalName": "cn_a",
        "vernacularName": "vn_a",
        "diameter": 10,
        "height": 10
    }
    properties_b = {
        "canonicalName": "cn_b",
        "vernacularName": "vn_b",
        "diameter": 1,
        "height": 10
    }
    
    create_tree(organization_id=organization.id, properties=properties_a), 
    create_tree(organization_id=organization.id, properties=properties_b)
    
    filters = crud_tree.tree.get_filters(db, organization_id=organization.id)

    assert filters == {
        'canonicalName': [
            {'value': 'cn_a', 'total': 1, 'background': [0, 0, 0]}, 
            {'value': 'cn_b', 'total': 1, 'background': [0, 0, 0]}
        ], 
        'vernacularName': [
            {'value': 'vn_a', 'total': 1, 'background': [0, 0, 0]}, 
            {'value': 'vn_b', 'total': 1, 'background': [0, 0, 0]}
        ], 
        'diameter': [
            {'value': '1', 'total': 1, 'background': [0, 0, 0]}, 
            {'value': '10', 'total': 1, 'background': [0, 0, 0]}
        ], 
        'height': [
            {'value': '10', 'total': 2, 'background': [0, 0, 0]}
        ]
    }

def test_get_properties_completion_ratio(db, create_organization_root, create_tree):
    organization = create_organization_root()
    properties_a = {
        "canonicalName": "cn_a",
        "vernacularName": "vn_a",
        "diameter": 10,
        "height": 10
    }
    properties_b = {
        "diameter": 1,
        "height": 10
    }
    fields = properties_a.keys()
    
    create_tree(organization_id=organization.id, properties=properties_a)
    create_tree(organization_id=organization.id, properties=properties_b)
    
    ratio = crud_tree.tree.get_properties_completion_ratio(
        db, 
        organization_id=organization.id, 
        fields=fields
    )

    assert ratio == {
        'canonicalName': 50.0, 
        'vernacularName': 50.0, 
        'diameter': 100.0, 
        'height': 100.0
    }

def test_get_properties_aggregates(db, create_organization_root, create_tree):
    organization = create_organization_root()
    properties_a = {
        "canonicalName": "cn_a",
        "vernacularName": "vn_a",
        "diameter": 10,
        "height": 10
    }
    properties_b = {
        "diameter": 1,
        "height": 10
    }
    fields = properties_a.keys()
    
    create_tree(organization_id=organization.id, properties=properties_a) 
    create_tree(organization_id=organization.id, properties=properties_b)

    properties = crud_tree.tree.get_properties_aggregates(
        db, 
        organization_id=organization.id, 
        fields=fields
    )

    assert properties == {
        'canonicalName': [
            {'value': 'cn_a', 'total': 1}
        ], 
        'vernacularName': [
            {'value': 'vn_a', 'total': 1}
        ], 
        'diameter': [
            {'value': '1', 'total': 1}, 
            {'value': '10', 'total': 1}
        ], 
        'height': [
            {'value': '10', 'total': 2}
        ]
    }
    