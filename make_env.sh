#!/bin/bash
echo VITE_MAPBOX_API_KEY=$VITE_MAPBOX_API_KEY > .env
echo VITE_ESRI=$VITE_ESRI > .env
echo VITE_LAYERS_JSON_URL=$VITE_LAYERS_JSON_URL >> .env
echo VITE_LAYERS3D_JSON_URL=$VITE_LAYERS3D_JSON_URL >> .env
echo VITE_CESIUM_TOKEN=$VITE_CESIUM_TOKEN >> .env
echo VITE_JASMIN_OBJECT_STORE_URL=$VITE_JASMIN_OBJECT_STORE_URL >> .env
echo VITE_MBTILES_URL=$VITE_MBTILES_URL >> .env
echo VITE_TILE_SERVER_URL=$VITE_TILE_SERVER_URL >> .env
