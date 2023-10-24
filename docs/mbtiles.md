# MBTiles

## Introduction

MBTiles are files used to store vector data in the form of an SQLite database. In our project, we employ MBTiles as a crucial component for managing and rendering vector data efficiently. This documentation explains how MBTiles are utilized in our system and provides insights into the processes and infrastructure supporting them.

## MBTiles File Format

MBTiles serve as the underlying data format for storing vector information. They are employed to manage spatial data in a compact and organized manner. These files are essentially SQLite databases optimized for spatial queries.

## Server for Handling MBTiles

To access and process MBTiles files, we've developed a Python-based service. This service is responsible for executing queries on the database and returning the specific data required for rendering on the frontend. It plays a pivotal role in ensuring that only relevant map data is retrieved and displayed on the map, optimizing both performance and resource utilization.

Our MBTiles server is based on the [mbtiles-s3-server](https://github.com/uktrade/mbtiles-s3-server) library, which provides efficient and scalable methods for serving MBTiles data. This service is currently in production and can be accessed through the following links:

- [https://imfe-pilot-mbtiles.noc.ac.uk.net/](https://imfe-pilot-mbtiles.noc.ac.uk.net/)
- [https://haigfras-salt-mbtiles.co.uk/](https://haigfras-salt-mbtiles.co.uk/)

## Project Repository

The codebase for our MBTiles service is hosted on GitLab, and you can access the repository at [https://git.noc.ac.uk/ocean-informatics/imfepilot/tileserver](https://git.noc.ac.uk/ocean-informatics/imfepilot/tileserver). This repository contains the source code, documentation, and configurations related to our MBTiles server.

## Map Visualization

To give you a visual overview, here's an example of a 2D map rendering utilizing MBTiles data:

![2D Map Overview](public/readme/mbtiles.png)

*The above image demonstrates a 2D map visualization using MBTiles data.*

## Limitations in 3D Mapping

It's important to note that due to certain restrictions imposed by the Cesium library, opening MBTiles files in 3D maps is not currently supported. Our project primarily focuses on optimizing 2D map rendering, and we are actively exploring solutions for extending this functionality to 3D mapping in the future.

Thank you for exploring the usage of MBTiles in our project. If you have any questions or require further details, feel free to refer to the project repository or reach out to our support team for assistance.