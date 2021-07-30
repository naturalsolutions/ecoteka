# import pytest

# from fastapi.testclient import TestClient

# from app.tests.utils.security import users_parameters


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
#     csv,
# ) -> None:
#     auth = headers_user_and_organization_from_organization_role(
#         mode_organization, role
#     )
#     organization_id = auth["organization"].id
#     file = (("file", ("geofile.geojson", geojson, "application/vnd.geo+json")),)
#     response = client.post(
#         f"/organization/{organization_id}/geo_files",
#         headers=auth["headers"],
#         files=file,
#     )
#     assert response.status_code == status_code

#     file = (("file", ("geofile.csv", csv, "text/csv")),)
#     response = client.post(
#         f"/organization/{organization_id}/geo_files",
#         headers=auth["headers"],
#         files=file,
#     )
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
# def test_read_geofile_by_name(
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
#     response = client.get(f"/organization/{organization_id}/geo_files")

#     assert response.status_code == status_code


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


# @pytest.mark.parametrize(
#     "mode_organization, role, status_code",
#     users_parameters(
#         {
#             "private": ["admin", "owner", "manager"],
#             "open": ["admin", "owner", "manager"],
#             "participatory": ["admin", "owner", "manager"],
#         }
#     ),
# )
# def test_delete_geo_file(
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
#     response = client.delete(
#         f"/organization/{organization_id}/geo_files/geofile.geojson",
#         headers=auth["headers"],
#     )

#     assert response.status_code == status_code
