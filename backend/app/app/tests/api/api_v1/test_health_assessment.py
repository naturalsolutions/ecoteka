import pytest
import json
from fastapi.testclient import TestClient
from app.tests.utils.security import users_parameters

@pytest.mark.parametrize(
    'mode_organization, role, status_code', 
    users_parameters({
        "private": ["admin", "owner", "manager", "contributor"],
        "open": ["admin", "owner", "manager", "contributor"],
        "participatory": ["admin", "owner", "manager", "contributor"]
    })
)
def test_create(
    client: TestClient,
    mode_organization: str,
    role: str,
    status_code: int,
    headers_user_and_organization_from_organization_role,
    generate_health_assessment_data,
    create_tree,
    delete_health_assessment,
    delete_tree
):
    mock_data = headers_user_and_organization_from_organization_role(
        mode_organization, 
        role
    )
    organization_id = mock_data["organization"].id
    tree = create_tree(
        organization_id=organization_id,
        user_id=mock_data["user"].id
    )
    data = generate_health_assessment_data(
        organization_id=organization_id,
        tree_id=tree.id
    )

    response = client.post(
        f"/organization/{organization_id}/trees/{data.tree_id}/health_assessments", 
        headers=mock_data["headers"],
        json=json.loads(data.json())
    )

    assert response.status_code == status_code

    if status_code == 200:
        assert response.json()["organ"] == data.organ
        delete_health_assessment(response.json()["id"])
        delete_tree(tree_id=tree.id)

@pytest.mark.parametrize(
    'mode_organization, role, status_code', 
    users_parameters({
        "private": ["admin", "owner", "manager"],
        "open": ["admin", "owner", "manager"],
        "participatory": ["admin", "owner", "manager"]
    })
)
def test_delete(
    client: TestClient,
    mode_organization: str,
    role: str,
    status_code: int,
    headers_user_and_organization_from_organization_role,
    create_health_assessment,
    create_tree,
    delete_tree,
    delete_health_assessment
):
    mock_data = headers_user_and_organization_from_organization_role(
        mode_organization, 
        role
    )
    organization_id = mock_data["organization"].id
    tree = create_tree(
        organization_id=organization_id,
        user_id=mock_data["user"].id
    )
    health_assessment = create_health_assessment(
        organization_id=organization_id,
        tree_id=tree.id
    )

    health_assessment_id = health_assessment.id

    response = client.delete(
        f"/organization/{organization_id}/trees/{tree.id}/health_assessments/{health_assessment_id}", 
        headers=mock_data["headers"]
    )

    assert response.status_code == status_code
    
    if status_code == 200:
        assert response.json()["id"] == health_assessment_id
    else:
        delete_health_assessment(health_assessment_id)

    delete_tree(tree_id=tree.id)
