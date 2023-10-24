# COG (Cloud Optimized GeoTIFF)

## Introduction

In our project, we utilize Cloud Optimized GeoTIFF (COG) files to efficiently store and display geospatial data. This documentation outlines how we work with COG files and the two distinct approaches we've implemented for rendering COG data. Additionally, we highlight the significance of using a tile server for accelerated frontend map rendering.

## Utilizing COG Images

Cloud Optimized GeoTIFF (COG) files are a specialized format for storing geospatial data efficiently. These files are designed for optimal performance, enabling rapid access and rendering of large datasets.

## Tile Server Approach

### 1) Tile Server powered by [www.titiler.xyz](www.titiler.xyz)

One of our methods for opening COG images involves leveraging a tile server based on [www.titiler.xyz](www.titiler.xyz). This tile server has been deployed and is currently in production use. You can access the live deployment via the following links:

- [https://imfe-pilot-tileserver.noc.ac.uk.net/](https://imfe-pilot-tileserver.noc.ac.uk.net/)
- [https://haigfras-salt-tileserver.co.uk/](https://haigfras-salt-tileserver.co.uk/)

The codebase for this tile server can be found in our GitLab repository: [tileserver](https://git.noc.ac.uk/ocean-informatics/imfepilot/tileserver). This repository contains the source code, configuration details, and documentation related to the tile server implementation.

### 2) Utilizing the [georaster](https://github.com/GeoTIFF/georaster) Library

Another approach for working with COG images involves using the [georaster](https://github.com/GeoTIFF/georaster) library. This approach doesn't require a dedicated tile server. However, it's important to note that, for our project, we have determined that employing a tile server is significantly faster for rendering maps on the frontend.

Both the 2D and 3D maps in our project utilize the tile server option for rendering COG data, ensuring a streamlined and efficient rendering process.

## Frontend Data Processing

In addition to the tile server, we have implemented frontend code to process COG data. This functionality is powered by the [Geoblaze](https://geoblaze.io/) library, which facilitates direct interaction with COG files in the frontend environment. It enables us to perform various operations on COG data directly within the web application.

![COG Map Overview](assets/cog.png)

*The image above provides an overview of a 2D map displaying a COG image. The chart was generated using the Geoblaze library for data extraction and Plotly for plotting.*

## Conclusion

Cloud Optimized GeoTIFF (COG) files provide an efficient means of storing and rendering geospatial information. Our implementation of a tile server and Geoblaze library integration ensures that COG data is accessible and performant for both 2D and 3D maps in our project.

If you have any questions or require further details about our COG implementation, please consult the project repository or feel free to contact our support team for assistance.