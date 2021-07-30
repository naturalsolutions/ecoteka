import pytest
from fastapi import HTTPException
from fastapi.testclient import TestClient
from app.tests.utils.security import users_parameters


@pytest.mark.parametrize(
    "mode_organization, role, status_code",
    users_parameters(
        {
            "private": ["admin", "owner", "manager", "contributor"],
            "open": ["admin", "owner", "manager", "contributor"],
            "participatory": ["admin", "owner", "manager", "contributor"],
        }
    ),
)
def test_add(
    client: TestClient,
    mode_organization: str,
    role: str,
    status_code: int,
    headers_user_and_organization_from_organization_role,
    create_tree,
):
    mock_data = headers_user_and_organization_from_organization_role(
        mode_organization, role
    )
    organization_id = mock_data["organization"].id
    tree = create_tree(organization_id, mock_data["user"].id).to_xy()
    new_tree_data = {"x": tree.x, "y": tree.y}

    response = client.post(
        f"/organization/{organization_id}/trees",
        headers=mock_data["headers"],
        json=new_tree_data,
    )

    assert response.status_code == status_code

    if status_code == 200:
        response_data = response.json()
        del response_data["id"]
        assert response_data == {
            "properties": None,
            "geofile_id": None,
            "user_id": mock_data["user"].id,
            "organization_id": organization_id,
            "x": tree.x,
            "y": tree.y,
        }


@pytest.mark.parametrize(
    "mode_organization, role, status_code",
    users_parameters(
        {
            "private": ["admin", "owner", "manager", "contributor"],
            "open": ["admin", "owner", "manager", "contributor"],
            "participatory": ["admin", "owner", "manager", "contributor"],
        }
    ),
)
def test_update(
    client: TestClient,
    mode_organization: str,
    role: str,
    status_code: int,
    headers_user_and_organization_from_organization_role,
    create_tree,
):
    mock_data = headers_user_and_organization_from_organization_role(
        mode_organization, role
    )
    organization_id = mock_data["organization"].id
    tree = create_tree(organization_id, mock_data["user"].id)
    tree.properties = {"name": "name"}
    tree_data = {"properties": tree.properties}

    response = client.put(
        f"/organization/{organization_id}/trees/{tree.id}",
        headers=mock_data["headers"],
        json=tree_data,
    )

    assert response.status_code == status_code

    if status_code == 200:
        response.json() == tree.to_xy()


@pytest.mark.parametrize(
    "mode_organization, role, status_code",
    users_parameters(
        {
            "private": ["admin", "owner", "manager", "contributor", "reader"],
            "open": ["admin", "owner", "manager", "contributor", "reader"],
            "participatory": [
                "admin",
                "owner",
                "manager",
                "contributor",
                "reader",
            ],
        }
    ),
)
def test_get(
    client: TestClient,
    mode_organization: str,
    role: str,
    status_code: int,
    headers_user_and_organization_from_organization_role,
    create_tree,
):
    mock_data = headers_user_and_organization_from_organization_role(
        mode_organization, role
    )
    organization_id = mock_data["organization"].id
    tree = create_tree(organization_id, mock_data["user"].id)
    response = client.get(
        f"/organization/{organization_id}/trees/{tree.id}",
        headers=mock_data["headers"],
    )

    assert response.status_code == status_code

    if status_code == 200:
        response.json() == tree.to_xy()


@pytest.mark.parametrize(
    "mode_organization, role, status_code",
    users_parameters(
        {
            "private": ["admin", "owner", "manager", "contributor", "reader"],
            "open": ["admin", "owner", "manager", "contributor", "reader"],
            "participatory": [
                "admin",
                "owner",
                "manager",
                "contributor",
                "reader",
            ],
        }
    ),
)
def test_get_interventions(
    client: TestClient,
    mode_organization: str,
    role: str,
    status_code: int,
    headers_user_and_organization_from_organization_role,
    create_intervention,
):
    mock_data = headers_user_and_organization_from_organization_role(
        mode_organization, role
    )
    organization_id = mock_data["organization"].id
    intervention = create_intervention(organization_id, mock_data["user"].id)
    response = client.get(
        f"/organization/{organization_id}/trees/{intervention.tree_id}",
        headers=mock_data["headers"],
    )

    assert response.status_code == status_code

    if status_code == 200:
        response.json() == [intervention]


@pytest.mark.parametrize(
    "mode_organization, role, status_code",
    users_parameters(
        {
            "private": ["admin", "owner", "manager", "contributor"],
            "open": ["admin", "owner", "manager", "contributor"],
            "participatory": ["admin", "owner", "manager", "contributor"],
        }
    ),
)
def test_delete(
    client: TestClient,
    mode_organization: str,
    role: str,
    status_code: int,
    headers_user_and_organization_from_organization_role,
    create_tree,
):
    mock_data = headers_user_and_organization_from_organization_role(
        mode_organization, role
    )
    organization_id = mock_data["organization"].id
    tree = create_tree(organization_id, mock_data["user"].id)
    response = client.delete(
        f"/organization/{organization_id}/trees/{tree.id}",
        headers=mock_data["headers"],
    )

    assert response.status_code == status_code

    if status_code == 200:
        response.json() == tree.to_xy()


@pytest.mark.parametrize(
    "mode_organization, role, status_code",
    users_parameters(
        {
            "private": ["admin", "owner", "manager", "contributor"],
            "open": ["admin", "owner", "manager", "contributor"],
            "participatory": ["admin", "owner", "manager", "contributor"],
        }
    ),
)
def test_bulk_delete(
    client: TestClient,
    mode_organization: str,
    role: str,
    status_code: int,
    headers_user_and_organization_from_organization_role,
    create_tree,
):
    mock_data = headers_user_and_organization_from_organization_role(
        mode_organization, role
    )
    organization_id = mock_data["organization"].id
    tree_one = create_tree(organization_id, mock_data["user"].id)
    tree_two = create_tree(organization_id, mock_data["user"].id)
    trees = [tree_one.id, tree_two.id]
    response = client.delete(
        f"/organization/{organization_id}/trees/bulk_delete",
        headers=mock_data["headers"],
        json={"trees": trees},
    )

    assert response.status_code == status_code

    if status_code == 200:
        response.json() == trees


@pytest.mark.parametrize(
    "mode_organization, role, status_code",
    users_parameters(
        {
            "private": ["admin", "owner", "manager", "contributor"],
            "open": ["admin", "owner", "manager", "contributor"],
            "participatory": ["admin", "owner", "manager", "contributor"],
        }
    ),
)
def test_trees_import(
    client: TestClient,
    mode_organization: str,
    role: str,
    status_code: int,
    db,
    headers_user_and_organization_from_organization_role,
    create_geo_file,
    delete_geo_file,
):
    auth = headers_user_and_organization_from_organization_role(
        mode_organization, role
    )
    organization_id = auth["organization"].id
    geo_file = create_geo_file(
        organization_id=organization_id, user_id=auth["user"].id
    )
    crs = geo_file.crs
    geo_file.crs = None
    db.commit()

    # NOT FOUND
    response = client.post(
        f"/organization/{organization_id}/trees/import?name=abcde.geojson",
        headers=auth["headers"],
    )

    if status_code == 200:
        assert response.status_code == 404
        assert response.json()["detail"] == "abcde.geojson not found"

    # NOT CRS
    response = client.post(
        f"/organization/{organization_id}/trees/import?name={geo_file.name}",
        headers=auth["headers"],
    )

    if status_code == 200:
        assert response.status_code == 415
        assert response.json()["detail"] == "crs not found"

    # IMPORT
    geo_file.crs = crs
    db.commit()

    response = client.post(
        f"/organization/{organization_id}/trees/import?name={geo_file.name}",
        headers=auth["headers"],
    )

    assert response.status_code == status_code

    delete_geo_file(name=geo_file.name)


@pytest.mark.parametrize(
    "mode_organization, role, status_code",
    users_parameters(
        {
            "private": ["admin", "owner", "manager", "contributor"],
            "open": ["admin", "owner", "manager", "contributor"],
            "participatory": ["admin", "owner", "manager", "contributor"],
        }
    ),
)
def test_trees_export(
    client: TestClient,
    mode_organization: str,
    role: str,
    status_code: int,
    headers_user_and_organization_from_organization_role,
    create_tree,
    delete_tree,
):
    mock_data = headers_user_and_organization_from_organization_role(
        mode_organization, role
    )
    organization_id = mock_data["organization"].id

    ## NO DATA
    response = client.get(
        f"/organization/{organization_id}/trees/export?format=geojson",
        headers=mock_data["headers"],
    )

    if status_code == 200:
        assert response.status_code == 404
        assert response.json()["detail"] == "this organization has no trees"
    else:
        assert response.status_code == status_code

    tree_one = create_tree(organization_id, mock_data["user"].id)
    tree_two = create_tree(organization_id, mock_data["user"].id)
    trees = [tree_one, tree_two]

    ## INVALID FORMAT
    response = client.get(
        f"/organization/{organization_id}/trees/export?format=invalid_format",
        headers=mock_data["headers"],
    )

    if status_code == 200:
        assert response.status_code == 404
        assert response.json()["detail"] == "format not found"

    ## GEOJSON
    response = client.get(
        f"/organization/{organization_id}/trees/export?format=geojson",
        headers=mock_data["headers"],
    )

    assert response.status_code == status_code

    if status_code == 200:
        response.json()["type"] == "FeatureCollection"
        len(response.json()["features"]) == len(trees)

    ## CSV
    response = client.get(
        f"/organization/{organization_id}/trees/export?format=csv",
        headers=mock_data["headers"],
    )

    assert response.status_code == status_code

    ## EXCEL
    response = client.get(
        f"/organization/{organization_id}/trees/export?format=xlsx",
        headers=mock_data["headers"],
    )

    assert response.status_code == status_code

    # Clean
    delete_tree(tree_one.id)
    delete_tree(tree_two.id)
