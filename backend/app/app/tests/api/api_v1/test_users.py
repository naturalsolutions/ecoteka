from fastapi.testclient import TestClient

def test_read_users(
  client: TestClient,
  auth_user,
  delete_user
):
  auth = auth_user(is_superuser=True)
  response = client.get(
    "/users",
    headers=auth["headers"]
  )
  delete_user(auth["user"].id)

  assert response.status_code == 200
  assert len(response.json()) > 0

def test_create_user(
  client: TestClient,
  auth_user,
  generate_user_data,
  delete_user
):
  auth = auth_user(is_superuser=True)
  user_data = generate_user_data()
  
  response = client.post("/users", headers=auth["headers"], json=user_data)
  assert response.status_code == 200

  response = client.post("/users", headers=auth["headers"], json=user_data)
  assert response.status_code == 400

  delete_user(auth["user"].id)