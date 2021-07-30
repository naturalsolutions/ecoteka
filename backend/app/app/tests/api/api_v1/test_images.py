import pytest
from fastapi.testclient import TestClient
from app.tests.utils.security import users_parameters
from app.core import settings


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
def test_upload_images(
    client: TestClient,
    mode_organization: str,
    role: str,
    status_code: int,
    headers_user_and_organization_from_organization_role,
    generate_image,
    create_tree,
):
    mock_data = headers_user_and_organization_from_organization_role(
        mode_organization, role
    )
    organization_id = mock_data["organization"].id
    tree = create_tree(organization_id, mock_data["user"].id)
    image_one = generate_image(100, 100)
    image_two = generate_image(150, 200)

    response = client.post(
        f"/organization/{organization_id}/trees/{tree.id}/images",
        headers=mock_data["headers"],
        files=[
            ("images", ("file1.jpg", image_one, "image/jpeg")),
            ("images", ("file2.jpg", image_two, "image/jpeg")),
        ],
    )

    assert response.status_code == status_code


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
def test_get_images(
    client: TestClient,
    mode_organization: str,
    role: str,
    status_code: int,
    headers_user_and_organization_from_organization_role,
    generate_image,
    create_tree,
):
    mock_data = headers_user_and_organization_from_organization_role(
        mode_organization, role
    )
    organization_id = mock_data["organization"].id
    tree = create_tree(organization_id, mock_data["user"].id)
    image_one = generate_image(100, 100)
    image_two = generate_image(150, 200)

    response = client.post(
        f"/organization/{organization_id}/trees/{tree.id}/images",
        headers=mock_data["headers"],
        files=[
            ("images", ("file1.jpg", image_one, "image/jpeg")),
            ("images", ("file2.jpg", image_two, "image/jpeg")),
        ],
    )

    response = client.get(
        f"/organization/{organization_id}/trees/{tree.id}/images",
        headers=mock_data["headers"],
    )

    files = [
        f"{settings.EXTERNAL_PATH}/organization/{organization_id}/trees/{tree.id}/images/file1.jpg",
        f"{settings.EXTERNAL_PATH}/organization/{organization_id}/trees/{tree.id}/images/file2.jpg",
    ]

    assert response.status_code == status_code

    if status_code == 200:
        response.json() == files


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
def test_get_image(
    client: TestClient,
    mode_organization: str,
    role: str,
    status_code: int,
    headers_user_and_organization_from_organization_role,
    generate_image,
    create_tree,
):
    mock_data_create = headers_user_and_organization_from_organization_role(
        mode_organization, "owner"
    )
    organization_id = mock_data_create["organization"].id
    tree = create_tree(organization_id, mock_data_create["user"].id)
    image = generate_image(100, 100)

    response = client.post(
        f"/organization/{organization_id}/trees/{tree.id}/images",
        headers=mock_data_create["headers"],
        files=[("images", ("file1.jpg", image, "image/jpeg"))],
    )

    mock_data = headers_user_and_organization_from_organization_role(
        mode_organization, role
    )

    response = client.get(
        f"/organization/{organization_id}/trees/{tree.id}/images/file1.jpg",
        headers=mock_data["headers"],
    )

    assert response.status_code == status_code


# @pytest.mark.parametrize(
#     "mode_organization, role, status_code",
#     users_parameters(
#         {
#             "private": ["admin", "owner", "manager", "contributor"],
#             "open": ["admin", "owner", "manager", "contributor"],
#             "participatory": ["admin", "owner", "manager", "contributor"],
#         }
#     ),
# )
# def test_delete_images(
#     client: TestClient,
#     mode_organization: str,
#     role: str,
#     status_code: int,
#     headers_user_and_organization_from_organization_role,
#     generate_image,
#     create_tree,
# ):
#     mock_data_create = headers_user_and_organization_from_organization_role(
#         mode_organization, "owner"
#     )
#     organization_id = mock_data_create["organization"].id
#     tree = create_tree(organization_id, mock_data_create["user"].id)
#     image = generate_image(100, 100)

#     client.post(
#         f"/organization/{organization_id}/trees/{tree.id}/images",
#         headers=mock_data_create["headers"],
#         files=[("images", ("file1.jpg", image, "image/jpeg"))],
#     )

#     mock_data = headers_user_and_organization_from_organization_role(
#         mode_organization, role
#     )

#     response = client.delete(
#         f"/organization/{organization_id}/trees/{tree.id}/images",
#         headers=mock_data["headers"],
#     )

#     assert response.status_code == status_code


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
def test_delete_image(
    client: TestClient,
    mode_organization: str,
    role: str,
    status_code: int,
    headers_user_and_organization_from_organization_role,
    generate_image,
    create_tree,
):
    mock_data_create = headers_user_and_organization_from_organization_role(
        mode_organization, "owner"
    )
    organization_id = mock_data_create["organization"].id
    tree = create_tree(organization_id, mock_data_create["user"].id)
    image = generate_image(100, 100)

    client.post(
        f"/organization/{organization_id}/trees/{tree.id}/images",
        headers=mock_data_create["headers"],
        files=[("images", ("file1.jpg", image, "image/jpeg"))],
    )

    mock_data = headers_user_and_organization_from_organization_role(
        mode_organization, role
    )

    response = client.delete(
        f"/organization/{organization_id}/trees/{tree.id}/images/file1.jpg",
        headers=mock_data["headers"],
    )

    assert response.status_code == status_code
