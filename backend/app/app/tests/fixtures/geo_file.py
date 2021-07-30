import pytest
import geopandas as gpd
import uuid
from shapely.geometry import Point

from app.core import settings
from app.models.geo_file import GeoFile


@pytest.fixture
def geojson(faker):
    d = {"geometry": []}
    for _ in range(5):
        coords = faker.latlng()
        d["geometry"].append(Point(coords[0], coords[1]))

    df = gpd.GeoDataFrame(d)
    df.set_crs("epsg:4326")

    return df.to_json()


@pytest.fixture
def csv(faker):
    d = {"latitude": [], "longitude": []}
    for _ in range(5):
        coords = faker.latlng()
        d["latitude"].append(coords[0])
        d["longitude"].append(coords[1])

    df = gpd.GeoDataFrame(d)
    return df.to_csv()


@pytest.fixture
def create_geo_file(db, geojson):
    def decorator_create_geo_file(
        organization_id: int, user_id: int, extension: str = "geojson"
    ):
        unique_name = uuid.uuid4()
        unique_filename = f"{unique_name}.{extension}"
        copy_filename = f"{settings.UPLOADED_FILES_FOLDER}/{unique_filename}"
        filename = None

        if extension == "geojson":
            filename = "geofile.geojson"
            with open(copy_filename, "wb") as f:
                f.write(geojson.encode())  # type: ignore

        geo_file = GeoFile(
            name=str(unique_name),
            original_name=filename,
            extension=extension,
            user_id=user_id,
            organization_id=organization_id,
        )

        db.add(geo_file)
        db.commit()

        return geo_file

    return decorator_create_geo_file
