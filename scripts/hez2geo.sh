#!/bin/bash

filename="$1"
outname="$2"

mkdir build


# ogr2ogr installed via conda separately via
# conda install -c conda-forge gdal 
# create geojson from shp file and transform coordinate system
ogr2ogr -f GeoJSON build/build.json \
    -t_srs urn:ogc:def:crs:EPSG::4269 \
    $filename

jq '.features' build/build.json > build/jq.json
jq '(.. | .HEZ?) |= . + " HEZ"' build/jq.json > src/assets/geography/$outname

rm -rf build
