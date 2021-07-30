import pytest
import json

from fastapi.testclient import TestClient

from app.tests.utils.security import users_parameters


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
# def test_upload_geo_file(
#     client: TestClient,
#     mode_organization: str,
#     role: str,
#     status_code: int,
#     headers_user_and_organization_from_organization_role,
#     geojson,
# ) -> None:
#     auth = headers_user_and_organization_from_organization_role(
#         mode_organization, role
#     )
#     organization_id = auth["organization"].id
#     response = client.post(
#         f"/organization/{organization_id}/geo_files",
#         headers=auth["headers"],
#         files=[
#             (
#                 "file",
#                 (
#                     "geofile.geojson",
#                     geojson.encode(),
#                     "application/vnd.geo+json",
#                 ),
#             )
#         ],
#     )
#     print(response.json())
#     assert response.status_code == status_code


# @pytest.mark.parametrize(
#     "mode_organization, role, status_code",
#     users_parameters(
#         {
#             "private": ["admin", "owner", "manager", "contributor", "reader"],
#             "open": ["admin", "owner", "manager", "contributor", "reader"],
#             "participatory": [
#                 "admin",
#                 "owner",
#                 "manager",
#                 "contributor",
#                 "reader",
#             ],
#         }
#     ),
# )
# def test_read_geo_files(
#     client: TestClient,
#     mode_organization: str,
#     role: str,
#     status_code: int,
#     headers_user_and_organization_from_organization_role,
# ) -> None:
#     auth = headers_user_and_organization_from_organization_role(
#         mode_organization, role
#     )
#     organization_id = auth["organization"].id
#     response = client.get(
#         f"/organization/{organization_id}/geo_files", headers=auth["headers"]
#     )

#     assert response.status_code == status_code


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
def test_read_geofile_by_name(
    client: TestClient,
    mode_organization: str,
    role: str,
    status_code: int,
    headers_user_and_organization_from_organization_role,
    create_geo_file,
    delete_geo_file,
) -> None:
    auth = headers_user_and_organization_from_organization_role(
        mode_organization, role
    )
    organization_id = auth["organization"].id

    # NOT FOUND
    response = client.get(
        f"/organization/{organization_id}/geo_files/not_found",
        headers=auth["headers"],
    )

    if status_code == 200:
        assert response.status_code == 404
    else:
        assert response.status_code == status_code

    geo_file = create_geo_file(
        organization_id=organization_id, user_id=auth["user"].id
    )
    response = client.get(
        f"/organization/{organization_id}/geo_files/{geo_file.name}",
        headers=auth["headers"],
    )

    assert response.status_code == status_code

    if status_code == 200:
        assert response.json()["id"] == geo_file.id

    delete_geo_file(name=geo_file.name)


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
# def test_update_geo_file(
#     client: TestClient,
#     mode_organization: str,
#     role: str,
#     status_code: int,
#     headers_user_and_organization_from_organization_role,
# ) -> None:
#     auth = headers_user_and_organization_from_organization_role(
#         mode_organization, role
#     )
#     organization_id = auth["organization"].id
#     response = client.put(f"/organization/{organization_id}/geo_files")

#     assert response.status_code == status_code


@pytest.mark.parametrize(
    "mode_organization, role, status_code",
    users_parameters(
        {
            "private": ["admin", "owner", "manager"],
            "open": ["admin", "owner", "manager"],
            "participatory": ["admin", "owner", "manager"],
        }
    ),
)
def test_delete_geo_file(
    client: TestClient,
    mode_organization: str,
    role: str,
    status_code: int,
    headers_user_and_organization_from_organization_role,
    create_geo_file,
) -> None:
    auth = headers_user_and_organization_from_organization_role(
        mode_organization, role
    )
    organization_id = auth["organization"].id
    name = "geofile.geojson"

    # NOT FOUND
    response = client.delete(
        f"/organization/{organization_id}/geo_files/{name}",
        headers=auth["headers"],
    )

    if status_code == 200:
        assert response.status_code == 404
        assert (
            response.json()["detail"]
            == f"The geofile with name {name} does not exist in the system"
        )
    else:
        assert response.status_code == status_code

    # DELETE
    geo_file = create_geo_file(
        organization_id=organization_id, user_id=auth["user"].id
    )

    response = client.delete(
        f"/organization/{organization_id}/geo_files/{geo_file.name}",
        headers=auth["headers"],
    )

    assert response.status_code == status_code
