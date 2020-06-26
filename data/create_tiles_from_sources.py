import os
import ssl
import yaml
import geopandas
import pandas
import typer
from geopandas import GeoDataFrame
from shapely.geometry import Point

app = typer.Typer()

"""
How to fix Python SSL CERTIFICATE_VERIFY_FAILED
ref: https://medium.com/@moreless/how-to-fix-python-ssl-certificate-verify-failed-97772d9dd14c
"""
if (not os.environ.get('PYTHONHTTPSVERIFY', '') and getattr(ssl, '_create_unverified_context', None)):
    ssl._create_default_https_context = ssl._create_unverified_context


def read_geom(output_file, url):
    df = geopandas.read_file(url)
    df = df.to_crs("EPSG:4326")
    df.to_file(output_file, driver="GeoJSON")


def read_csv(output_file, url, long, lat):
    df = pandas.read_csv(url)
    geometry = [Point(xy) for xy in zip(df[long], df[lat])]
    geo_df = GeoDataFrame(df, crs="EPSG:4326", geometry=geometry)
    geo_df.to_file(output_file, driver="GeoJSON")


def download(source):
    filename = f'{source["collection"]}.{source["id"]}.geojson'
    output_file = os.path.join(os.getcwd(), "data", filename)
    url = source["url"]

    try:
        if not os.path.exists(output_file):
            if (source["format"] == "csv"):
                read_csv(output_file, url, source["long"], source["lat"])
            else:
                read_geom(output_file, url)
    except e:
        os.remove(output_file)
        return False
    finally:
        return output_file


@app.command()
def main(sources_file: str):
    with open(sources_file) as file:
        sources = yaml.full_load(file)

    for source in sources:
        download(source)


if __name__ == "__main__":
    app()
