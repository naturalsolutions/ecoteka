from fastapi.testclient import TestClient


def test_read_taxrefs(client: TestClient, auth_user, delete_user):
    auth = auth_user()
    response = client.get("/taxref", headers=auth["headers"])
    delete_user(auth["user"].id)

    assert response.status_code == 200


def test_read_taxrefs_trees(client: TestClient, auth_user, delete_user):
    auth = auth_user()
    response = client.get("/taxref/trees", headers=auth["headers"])
    delete_user(auth["user"].id)

    assert response.status_code == 200


def test_read_taxref(client: TestClient, auth_user, delete_user):
    auth = auth_user(is_superuser=True)
    response = client.get("/taxref/1234567890", headers=auth["headers"])

    assert response.status_code == 404
    assert (
        response.json()["detail"]
        == "The taxon with this id does not exist in the system"
    )

    response = client.get("/taxref/232787", headers=auth["headers"])
    delete_user(auth["user"].id)
    assert response.status_code == 200
