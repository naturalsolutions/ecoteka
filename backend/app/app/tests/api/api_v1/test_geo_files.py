from fastapi.testclient import TestClient


def test_post_upload_invalid_format(client: TestClient):
    filename = "/app/app/tests/fixtures/files/geo_file.csv"
    file = open(filename, "rb")
    files = {"file": ("geofile.ext", file, "text/undefined")}
    response = client.post(f"/geo_files/upload", files=files)
    file.close()

    assert response.status_code == 415


def test_post_upload_invalid_file_csv(client: TestClient):
    filename = "/app/app/tests/fixtures/files/geo_file.geojson"
    file = open(filename, "rb")
    files = {"file": ("geofile.csv", file, "text/csv")}
    response = client.post(f"/geo_files/upload", files=files)
    file.close()

    assert response.status_code == 415


def test_post_upload_invalid_file_excel(client: TestClient):
    filename = "/app/app/tests/fixtures/files/geo_file.geojson"
    file = open(filename, "rb")
    files = {"file": ("geofile.xslx", file, "text/xslx")}
    response = client.post(f"/geo_files/upload", files=files)
    file.close()

    assert response.status_code == 415


def test_post_upload_invalid_file_shp(client: TestClient):
    filename = "/app/app/tests/fixtures/files/geo_file.geojson"
    file = open(filename, "rb")
    files = {"file": ("geofile.zip", file, "text/zip")}
    response = client.post(f"/geo_files/upload", files=files)
    file.close()

    assert response.status_code == 415


def test_post_upload_invalid_file_geojson(client: TestClient):
    filename = "/app/app/tests/fixtures/files/geo_file.zip"
    file = open(filename, "rb")
    files = {"file": ("geofile.geojson", file, "text/geojson")}
    response = client.post(f"/geo_files/upload", files=files)
    file.close()

    assert response.status_code == 415


def test_post_upload_valid_csv(client: TestClient):
    filename = "/app/app/tests/fixtures/files/geo_file.csv"
    file = open(filename, "rb")
    files = {"file": ("geofile.csv", file, "text/csv")}
    response = client.post(f"/geo_files/upload", files=files)
    file.close()

    assert response.status_code == 200


def test_post_upload_valid_xlsx(client: TestClient):
    filename = "/app/app/tests/fixtures/files/geo_file.xlsx"
    file = open(filename, "rb")
    files = {"file": ("geofile.xlsx", file, "text/xslx")}
    response = client.post(f"/geo_files/upload", files=files)
    file.close()

    assert response.status_code == 200


def test_post_upload_valid_shp(client: TestClient):
    filename = "/app/app/tests/fixtures/files/geo_file.zip"
    file = open(filename, "rb")
    files = {"file": ("geofile.zip", file, "text/zip")}
    response = client.post(f"/geo_files/upload", files=files)
    file.close()

    assert response.status_code == 200


def test_post_upload_valid_geojson(client: TestClient):
    filename = "/app/app/tests/fixtures/files/geo_file.geojson"
    file = open(filename, "rb")
    files = {"file": ("geofile.geojson", file, "text/geojson")}
    response = client.post(f"/geo_files/upload", files=files)
    file.close()

    assert response.status_code == 200
