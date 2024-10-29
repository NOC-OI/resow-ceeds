# OBJECT STORE ORGANIZATION

This document provides a description of the organization of the Pilot-imfe Tenancy on the Jasmin Object Store. The goal is to facilitate future applications of the same infrastructure in new digital twin or GIS systems projects.

## REQUIREMENTS

For the assembly of an infrastructure for digital twin projects, some system requirements are necessary:
- The bucket must have open access.
A significant portion of the data will be made available to the public through the publication of the data's DOI. Therefore, it is important that the public can download most of the data without login issues or the need for registration.

- The bucket must have access control for some types of files.
Depending on the data, the client may request that it has restricted access.

- The bucket must support versioning.
Depending on the data format on the frontend, some libraries require that the bucket has version control.

- File Types
The bucket must contain all CSV files, COG images, GeoTIFFs, PNGs, JPGs, as well as MBTILES, GEOJSON, SHP, and GEOPARQUET files.

- The bucket must include the structure and JSON of the STAC catalog.
The bucket should contain all JSON files related to the catalogs and data of the STAC catalog.

- The bucket must contain the files used to populate the frontend.
If the frontend requires images or JSON files to populate the site, they should be stored in the bucket.

## BUCKETS
In order to meet all the requirements described above and at the same time align with the space and scalability needs of the project, the following bucket configuration was chosen:

- 1 bucket to store open access data without versioning control.
- 1 bucket to store data with access control.
- 1 bucket with versioning control.

The three buckets will have the same data organization, which will facilitate interoperability between them. In other words, if a file needs to be accessed in the access-controlled bucket, the data path will be the same as if the file were in the open bucket.

## FILE SYSTEM
The buckets have the following folder organization:

```markdown
├── frontend
│   ├── images
│   │   ├── image1.png
│   ├── layers.json
│   ├── layers3d.json
│   ├── website.json
├── STAC_Catalogue
│   ├── layer_type1
│   │   ├── layer1
│   │   │   ├── layer1.json
│   │   ├── colection.json
│   ├── layer_type2
│   ├── catalog.json
├── layers
│   ├── layer_type1
│   │   ├── layer1
│   │   │   ├── aditional directiories
│   │   │   ├── layer1.csv or .tif or .mbtiles or ...
│   │   ├── layer2
│   ├── layer_type2
│   │   ├── layer1
│   │   ├── layer2
└── 
```
