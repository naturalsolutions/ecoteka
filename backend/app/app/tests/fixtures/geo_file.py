import pytest
import geopandas as gpd
from shapely.geometry import Point


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
