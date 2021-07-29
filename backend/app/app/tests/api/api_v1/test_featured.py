from fastapi.testclient import TestClient

def test_get_featured_open_organizations(
    client: TestClient
):
    response = client.get("/featured/organizations")
    assert response.status_code == 200
