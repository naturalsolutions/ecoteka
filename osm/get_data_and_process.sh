#!/bin/sh

mkdir /data

# get data from osm
ogr2ogr -f GeoJSON /data/planet.geojson /vsicurl_streaming/https://ftp5.gwdg.de/pub/misc/openstreetmap/planet.openstreetmap.org/pbf/planet-latest.osm.pbf -sql "select * from points where hstore_get_value(other_tags, 'natural') = 'tree'"

# generate tiles with tippecanoe
tippecanoe -P -l ecoteka-data -o /data/osm_tmp.mbtiles --force --generate-ids --maximum-zoom=g --drop-densest-as-needed --extend-zooms-if-still-dropping /data/planet.geojson

rm /data/planet.geojson
mv /data/osm_tmp.mbtiles /data/osm.mbtiles
