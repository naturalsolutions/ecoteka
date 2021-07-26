from typing import Dict

import pytest
from fastapi.testclient import TestClient

from app import crud, schemas
from app.tests.utils.test_db import TestingSessionLocal

class OrganizationTest:
    def __init__(self) -> None:
        self.organization_in = {
            "name": "test_organization"
        }
        self.data: None

    def set_data(self, organization):
        self.data = organization

@pytest.fixture(scope="module")
def organization():
    return OrganizationTest()

def test_create_organization(
    organization: OrganizationTest,
    client: TestClient,
    superuser_access_token_headers: Dict[str, str]
) -> None:
    response = client.post(
        "/organization", 
        json=organization.organization_in,
        headers=superuser_access_token_headers
    )
   
    organization.set_data({**response.json()})
    assert response.status_code == 200
    assert organization.data["name"] == organization.organization_in["name"]

def test_get_one(
    organization: OrganizationTest,
    client: TestClient, 
    superuser_access_token_headers: Dict[str, str]) -> None:
    organization_id = organization.data["id"]
    
    error_response = client.get(
        "/organization/1000", 
        headers=superuser_access_token_headers
    )
    assert error_response.status_code == 404
    assert error_response.json() == { "detail": "Organization not found!" }

    response = client.get(
        f"/organization/{organization_id}", 
        headers=superuser_access_token_headers
    )
    assert response.status_code == 200
    assert response.json()["id"] == organization_id    

def test_update_organization(
    organization: OrganizationTest,
    client: TestClient,
    superuser_access_token_headers: Dict[str, str]
) -> None:
    new_organization_data = organization.data
    new_organization_data["name"] = "test_organization_2"
    
    error_response = client.patch(
        "/organization/1000", 
        json=new_organization_data,
        headers=superuser_access_token_headers
    )
    assert error_response.status_code == 404
    assert error_response.json() == { "detail": "Organization not found" }

    organization_id = organization.data["id"]
    response = client.patch(
        f"/organization/{organization_id}", 
        json=new_organization_data,
        headers=superuser_access_token_headers
    )
   
    organization.set_data({**response.json()})
    assert response.status_code == 200
    assert organization.data["name"] == new_organization_data["name"]

def test_get_center_from_organization(
    db: TestingSessionLocal,
    organization: OrganizationTest,
    client: TestClient,
    superuser_access_token_headers: Dict[str, str]
) -> None:
    organization_id = organization.data["id"]
    tree_1 = schemas.TreeCreate(
        geom=f"POINT(4.219118928658703 43.945198019395136)",
        properties=None,
        user_id=1,
        organization_id=organization_id,
    )

    tree_2 = schemas.TreeCreate(
        geom=f"POINT(4.319118928658703 43.645198019395136)",
        properties=None,
        user_id=1,
        organization_id=organization_id,
    )

    crud.tree.create(db, obj_in=tree_1)
    crud.tree.create(db, obj_in=tree_2)

    response = client.get(
        f"/organization/{organization_id}/get-centroid-organization", 
        headers=superuser_access_token_headers
    ) 

    assert response.status_code == 200
    assert response.json() == {
        'longitude': 4.269118928658703, 
        'latitude': 43.79519801939514
    }

def test_get_metrics_by_year(
    organization: OrganizationTest,
    client: TestClient,
    superuser_access_token_headers: Dict[str, str]
) -> None:
    organization_id = organization.data["id"]
    response = client.get(
        f"/organization/{organization_id}/metrics_by_year/2021", 
        headers=superuser_access_token_headers
    )

    error_response = client.get(
        f"/organization/1000/metrics_by_year/2021", 
        headers=superuser_access_token_headers
    )

    assert error_response.status_code == 404
    assert error_response.json () == { "detail": "Organization not found"}

    assert response.status_code == 200
    assert response.json() == {
        'total_tree_count': 2, 
        'logged_trees_count': 0, 
        'planted_trees_count': 0, 
        'planned_interventions_cost': 0.0, 
        'scheduled_interventions_cost': 0.0
    }
