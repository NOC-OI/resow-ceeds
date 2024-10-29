# Frontend Documentation

It was created a frontend application developed in React, with the ability to interact with different data formats on both the backend and frontend. The project relies on specific backend services for tile server operations for cloud optimised geotiff files and geoserver. For more information, please refer to the [project repository](https://gitlab.com/nocacuk/ocean-informatics/ReSOW/frontend).

## Access

The frontend application is currently hosted on Jasmin and Oracle Cloud, and you can access it through the following link:

- [https://ceeds.resow.uk//](https://ceeds.resow.uk//)

## General Project Infrastructure

The frontend accesses data from various sources and utilizes different microservices. All these services are containerized using Docker for easy deployment and management.

## Layers Organization

The organization of the layers rendered in the application is managed through the STAC Catalog of the project. Using the [Data Pipelines](https://github.com/NOC-OI/data_pipelines) package, the STAC is converted into a JSON file that the frontend can interpret and encode.

Currently, in the project, these JSON files are stored in the public folder. You should set the correct path for these files in the following environment variables: VITE_LAYERS_JSON_URL and VITE_LAYERS3D_JSON_URL.

## Features

### 2D Map

The 2D version is based on the [React Leaflet](https://react-leaflet.js.org/) library. For comprehensive information on the 2D map, please refer to the [2D Map documentation](2dmap.md).

### 3D Map

The 3D version is built using the [Resium](https://resium.reearth.io/) library, which is Cesium for React. Find more details about the 3D map in the [3D Map documentation](3dmap.md).

### Map Layers

The layers used in the maps are generated from the STAC Catalog of the project. To do this, you need to convert the STAC Catalog into a JSON file and save it in the appropriate location. More information about this conversion is available at the repository [data-pipelines](https://github.com/NOC-OI/data_pipelines).

It's essential to set this location as environment variables, `VITE_LAYERS_JSON_URL` and `VITE_LAYERS3D_JSON_URL`.

### Interaction with Different Data Types

Various techniques are applied to process and render maps for various data formats, including:

- [GeoTIFF and Cloud Optimized GeoTIFF (COG)](geotiff_cog.md)

- [FlatGeoBuf](fgb.md)

- [Geoserver](geoserver.md)

- [WMS Layers](wms.md)

- [Cesium Ion](cesium_ion.md)

### Frontend Calculations

The frontend utilizes the [GeoBlaze](https://geoblaze.io/) and [georaster](https://github.com/GeoTIFF/georaster) libraries for performing specific operations. These libraries is particularly useful for conducting simple statistical operations on GeoTIFF files. When working with COG format images, it's important to download only the necessary tiles and then perform mathematical operations.

### Layer Upload

Work in progress

### Layer Download

Work in progress

### Image Export

Work in progress