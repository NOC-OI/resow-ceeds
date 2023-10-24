# Haig Fras Digital Twin Project: Frontend Documentation

## Introduction

Welcome to the documentation for the Haig Fras Digital Twin Project's Frontend. This project's primary goal is to create a Digital Twin system for the Haig Fras marine protected area located in the Celtic Sea. This documentation provides an overview of the project, its infrastructure, features, and how to use the frontend.

## Project Overview

The Digital Twin project for Haig Fras aims to establish a system that represents a Digital Twin for the Haig Fras marine protected area in the Celtic Sea. It provides a digital representation of the ecosystem, allowing for monitoring and analysis.

The application offers the capability to render various file formats on maps, including COG (Cloud Optimized GeoTIFF), MBTiles, GeoJSON, geotiff, shapefiles, and PNG. It is available in both 2D and 3D versions, providing versatile functionality.

## Access

The frontend application is currently hosted on Jasmin and Oracle Cloud, and you can access it through the following links:

- [https://imfe-pilot.noc.ac.uk/](https://imfe-pilot.noc.ac.uk/)
- [https://haigfras-salt.co.uk/](https://haigfras-salt.co.uk/)

## General Project Infrastructure

This project is based on a frontend that accesses data from various sources and employs different microservices. All these services are containerized using Docker for easy deployment and management.

## Website Organization

The web application's structure is centered around the configuration file [/public/website.json](/public/website.json). This file defines the general structure of the items in the site's sidebar. It's crucial to exercise caution when making changes to this file, as it can potentially disrupt the site's organization.

Within this configuration file, you can add the following elements:
- New sections to the sidebar
- Information for info buttons
- New layers
- Change backend endpoints

## Features

### Authentication

For site access control, two types of authentication have been implemented: ORCID and Microsoft 365. You can find more details in the [Authentication documentation](auth.md).

### 2D Map

The 2D version is based on the [React Leaflet](https://react-leaflet.js.org/) library. For comprehensive information on the 2D map, please refer to the [2D Map documentation](2dmap.md).

### 3D Map

The 3D version is built using the [Resium](https://resium.reearth.io/) library, which is Cesium for React. Find more details about the 3D map in the [3D Map documentation](3dmap.md).

### Map Layers

The layers used in the maps are generated from the STAC Catalog of the project. To do this, you need to convert the STAC Catalog into a JSON file and save it in the appropriate location. More information about this conversion is available at the repository [data-pipelines](https://git.noc.ac.uk/ocean-informatics/imfepilot/data-pipelines).

It's essential to set this location as an environment variable, `VITE_LAYERS_JSON_URL` and `VITE_LAYERS3D_JSON_URL`.

### Interaction with Different Data Types

Different techniques are applied to process and render maps for various data formats, including:
- [Cloud Optimized GeoTIFF](cog.md)
- [MBTiles](mbtiles.md)
- [WMS Layers](wms.md)
- [Cesium Ion](cesium_ion.md)
- [Photos](photos.md)

### Frontend Calculations

The frontend utilizes the [GeoBlaze](https://geoblaze.io/) library for performing specific operations. This library is particularly useful for conducting simple statistical operations on GeoTIFF files. When working with COG format images, it's important to download only the necessary tiles and then perform mathematical operations.

### Backend Calculations

Although most activities can be handled on the frontend, a backend has been implemented for specific calculations. You can find more information about these calculations in the [Backend Calculations documentation](backend.md).

### CI/CD Pipeline

This repository includes an automatic GitLab CI/CD pipeline for continuous integration and continuous deployment. More information about this pipeline can be found in the [CI/CD Pipeline documentation](cicd.md).

Thank you for using the Haig Fras Digital Twin Project's Frontend. If you have any questions or need further assistance, please refer to the specific documentation sections or contact our support team.