import pytest
from typing import Dict
from fastapi.testclient import TestClient
from app.tests.utils.security import users_parameters
from app.core import settings

@pytest.mark.parametrize(
    'mode_organization, role, status_code', 
    users_parameters({
        "private": ["admin", "owner", "manager", "contributor"],
        "open": ["admin", "owner", "manager", "contributor"],
        "participatory": ["admin", "owner", "manager", "contributor"]
    })
)
def test_add(
    client: TestClient,
    mode_organization: str,
    role: str,
    status_code: int,
    headers_user_and_organization_from_organization_role,
    create_tree
):
    mock_data = headers_user_and_organization_from_organization_role(mode_organization, role)
    organization_id = mock_data["organization"].id
    tree = create_tree(organization_id, mock_data["user"].id).to_xy()
    new_tree_data = {
        "x": tree.x,
        "y": tree.y
    }

    response = client.post(
        f"/organization/{organization_id}/trees", 
        headers=mock_data["headers"],
        json=new_tree_data
    )

    assert response.status_code == status_code

    if status_code == 200:
        response_data = response.json()
        del response_data['id']
        assert response_data == {
            'properties': None, 
            'geofile_id': None, 
            'user_id': mock_data["user"].id, 
            'organization_id': organization_id, 
            'x': tree.x, 
            'y': tree.y
        }

@pytest.mark.parametrize(
    'mode_organization, role, status_code', 
    users_parameters({
        "private": ["admin", "owner", "manager", "contributor"],
        "open": ["admin", "owner", "manager", "contributor"],
        "participatory": ["admin", "owner", "manager", "contributor"]
    })
)
def test_update(
    client: TestClient,
    mode_organization: str,
    role: str,
    status_code: int,
    headers_user_and_organization_from_organization_role,
    create_tree
):
    mock_data = headers_user_and_organization_from_organization_role(mode_organization, role)
    organization_id = mock_data["organization"].id
    tree = create_tree(organization_id, mock_data["user"].id)
    tree.properties = {
        "name": "name"
    }
    tree_data = {
        "properties": tree.properties
    }

    response = client.put(
        f"/organization/{organization_id}/trees/{tree.id}", 
        headers=mock_data["headers"],
        json=tree_data
    )

    assert response.status_code == status_code

    if status_code == 200:
        response.json() == tree.to_xy()

@pytest.mark.parametrize(
    'mode_organization, role, status_code', 
    users_parameters({
        "private": ["admin", "owner", "manager", "contributor", "reader"],
        "open": ["admin", "owner", "manager", "contributor", "reader"],
        "participatory": ["admin", "owner", "manager", "contributor", "reader"]
    })
)
def test_get(
    client: TestClient,
    mode_organization: str,
    role: str,
    status_code: int,
    headers_user_and_organization_from_organization_role,
    create_tree
):
    mock_data = headers_user_and_organization_from_organization_role(mode_organization, role)
    organization_id = mock_data["organization"].id
    tree = create_tree(organization_id, mock_data["user"].id)   
    response = client.get(
        f"/organization/{organization_id}/trees/{tree.id}", 
        headers=mock_data["headers"]
    )

    assert response.status_code == status_code

    if status_code == 200:
        response.json() == tree.to_xy()

@pytest.mark.parametrize(
    'mode_organization, role, status_code', 
    users_parameters({
        "private": ["admin", "owner", "manager", "contributor", "reader"],
        "open": ["admin", "owner", "manager", "contributor", "reader"],
        "participatory": ["admin", "owner", "manager", "contributor", "reader"]
    })
)
def test_get_interventions(
    client: TestClient,
    mode_organization: str,
    role: str,
    status_code: int,
    headers_user_and_organization_from_organization_role,
    create_intervention
):
    mock_data = headers_user_and_organization_from_organization_role(mode_organization, role)
    organization_id = mock_data["organization"].id
    intervention = create_intervention(organization_id, mock_data["user"].id)
    response = client.get(
        f"/organization/{organization_id}/trees/{intervention.tree_id}", 
        headers=mock_data["headers"]
    )

    assert response.status_code == status_code

    if status_code == 200:
        response.json() == [intervention]

@pytest.mark.parametrize(
    'mode_organization, role, status_code', 
    users_parameters({
        "private": ["admin", "owner", "manager", "contributor"],
        "open": ["admin", "owner", "manager", "contributor"],
        "participatory": ["admin", "owner", "manager", "contributor"]
    })
)
def test_delete(
    client: TestClient,
    mode_organization: str,
    role: str,
    status_code: int,
    headers_user_and_organization_from_organization_role,
    create_tree
):
    mock_data = headers_user_and_organization_from_organization_role(mode_organization, role)
    organization_id = mock_data["organization"].id
    tree = create_tree(organization_id, mock_data["user"].id)   
    response = client.delete(
        f"/organization/{organization_id}/trees/{tree.id}", 
        headers=mock_data["headers"]
    )

    assert response.status_code == status_code

    if status_code == 200:
        response.json() == tree.to_xy()


@pytest.mark.parametrize(
    'mode_organization, role, status_code', 
    users_parameters({
        "private": ["admin", "owner", "manager", "contributor"],
        "open": ["admin", "owner", "manager", "contributor"],
        "participatory": ["admin", "owner", "manager", "contributor"]
    })
)
def test_bulk_delete(
    client: TestClient,
    mode_organization: str,
    role: str,
    status_code: int,
    headers_user_and_organization_from_organization_role,
    create_tree
):
    mock_data = headers_user_and_organization_from_organization_role(mode_organization, role)
    organization_id = mock_data["organization"].id
    tree_one = create_tree(organization_id, mock_data["user"].id)  
    tree_two = create_tree(organization_id, mock_data["user"].id)   
    trees = [tree_one.id, tree_two.id]
    response = client.delete(
        f"/organization/{organization_id}/trees/bulk_delete", 
        headers=mock_data["headers"],
        json={"trees": trees}
    )

    assert response.status_code == status_code

    if status_code == 200:
        response.json() == trees


@pytest.mark.parametrize(
    'mode_organization, role, status_code', 
    users_parameters({
        "private": ["admin", "owner", "manager", "contributor"],
        "open": ["admin", "owner", "manager", "contributor"],
        "participatory": ["admin", "owner", "manager", "contributor"]
    })
)
def test_upload_images(
    client: TestClient,
    mode_organization: str,
    role: str,
    status_code: int,
    headers_user_and_organization_from_organization_role,
    generate_image,
    create_tree
):
    mock_data = headers_user_and_organization_from_organization_role(mode_organization, role)
    organization_id = mock_data["organization"].id
    tree = create_tree(organization_id, mock_data["user"].id)
    image_one = generate_image(100, 100)
    image_two = generate_image(150, 200)

    response = client.post(
        f"/organization/{organization_id}/trees/{tree.id}/images", 
        headers=mock_data["headers"],
        files=[
            ("images", ("file1.jpg", image_one, "image/jpeg")),
            ("images", ("file2.jpg", image_two, "image/jpeg"))
        ]
    )

    assert response.status_code == status_code

@pytest.mark.parametrize(
    'mode_organization, role, status_code', 
    users_parameters({
        "private": ["admin", "owner", "manager", "contributor", "reader"],
        "open": ["admin", "owner", "manager", "contributor", "reader"],
        "participatory": ["admin", "owner", "manager", "contributor", "reader"]
    })
)
def test_get_images(
    client: TestClient,
    mode_organization: str,
    role: str,
    status_code: int,
    headers_user_and_organization_from_organization_role,
    generate_image,
    create_tree
):
    mock_data = headers_user_and_organization_from_organization_role(mode_organization, role)
    organization_id = mock_data["organization"].id
    tree = create_tree(organization_id, mock_data["user"].id)
    image_one = generate_image(100, 100)
    image_two = generate_image(150, 200)

    response = client.post(
        f"/organization/{organization_id}/trees/{tree.id}/images", 
        headers=mock_data["headers"],
        files=[
            ("images", ("file1.jpg", image_one, "image/jpeg")),
            ("images", ("file2.jpg", image_two, "image/jpeg"))
        ]
    )

    response = client.get(
        f"/organization/{organization_id}/trees/{tree.id}/images", 
        headers=mock_data["headers"],
    )

    files = [
        f"{settings.EXTERNAL_PATH}/organization/{organization_id}/trees/{tree.id}/images/file1.jpg",
        f"{settings.EXTERNAL_PATH}/organization/{organization_id}/trees/{tree.id}/images/file2.jpg"
    ]


    assert response.status_code == status_code
    
    if status_code == 200:
        response.json() == files

@pytest.mark.parametrize(
    'mode_organization, role, status_code', 
    users_parameters({
        "private": ["admin", "owner", "manager", "contributor", "reader"],
        "open": ["admin", "owner", "manager", "contributor", "reader"],
        "participatory": ["admin", "owner", "manager", "contributor", "reader"]
    })
)
def test_get_image(
    client: TestClient,
    mode_organization: str,
    role: str,
    status_code: int,
    headers_user_and_organization_from_organization_role,
    generate_image,
    create_tree
):
    mock_data_create = headers_user_and_organization_from_organization_role(mode_organization, "owner")
    organization_id = mock_data_create["organization"].id
    tree = create_tree(organization_id, mock_data_create["user"].id)
    image = generate_image(100, 100)

    
    response = client.post(
        f"/organization/{organization_id}/trees/{tree.id}/images", 
        headers=mock_data_create["headers"],
        files=[
            ("images", ("file1.jpg", image, "image/jpeg"))
        ]
    )

    mock_data = headers_user_and_organization_from_organization_role(mode_organization, role)

    response = client.get(
        f"/organization/{organization_id}/trees/{tree.id}/images/file1.jpg", 
        headers=mock_data["headers"],
    )

    assert response.status_code == status_code


@pytest.mark.parametrize(
    'mode_organization, role, status_code', 
    users_parameters({
        "private": ["admin", "owner", "manager", "contributor"],
        "open": ["admin", "owner", "manager", "contributor"],
        "participatory": ["admin", "owner", "manager", "contributor"]
    })
)
def test_delete_images(
    client: TestClient,
    mode_organization: str,
    role: str,
    status_code: int,
    headers_user_and_organization_from_organization_role,
    generate_image,
    create_tree
):
    mock_data_create = headers_user_and_organization_from_organization_role(mode_organization, "owner")
    organization_id = mock_data_create["organization"].id
    tree = create_tree(organization_id, mock_data_create["user"].id)
    image = generate_image(100, 100)

    
    client.post(
        f"/organization/{organization_id}/trees/{tree.id}/images", 
        headers=mock_data_create["headers"],
        files=[
            ("images", ("file1.jpg", image, "image/jpeg"))
        ]
    )

    mock_data = headers_user_and_organization_from_organization_role(mode_organization, role)

    response = client.delete(
        f"/organization/{organization_id}/trees/{tree.id}/images", 
        headers=mock_data["headers"]
    )

    assert response.status_code == status_code

@pytest.mark.parametrize(
    'mode_organization, role, status_code', 
    users_parameters({
        "private": ["admin", "owner", "manager", "contributor"],
        "open": ["admin", "owner", "manager", "contributor"],
        "participatory": ["admin", "owner", "manager", "contributor"]
    })
)
def test_delete_image(
    client: TestClient,
    mode_organization: str,
    role: str,
    status_code: int,
    headers_user_and_organization_from_organization_role,
    generate_image,
    create_tree
):
    mock_data_create = headers_user_and_organization_from_organization_role(mode_organization, "owner")
    organization_id = mock_data_create["organization"].id
    tree = create_tree(organization_id, mock_data_create["user"].id)
    image = generate_image(100, 100)

    
    client.post(
        f"/organization/{organization_id}/trees/{tree.id}/images", 
        headers=mock_data_create["headers"],
        files=[
            ("images", ("file1.jpg", image, "image/jpeg"))
        ]
    )

    mock_data = headers_user_and_organization_from_organization_role(mode_organization, role)
    
    response = client.delete(
        f"/organization/{organization_id}/trees/{tree.id}/images/file1.jpg", 
        headers=mock_data["headers"]
    )

    assert response.status_code == status_code