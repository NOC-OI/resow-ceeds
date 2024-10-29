# STAC Catalog

In order to manage a group of files within the object store, it is essential to create a catalog known as a [STAC Catalog](https://stacspec.org/en). The STAC specification provides a common language for describing geospatial information, making it easier to work with, index, and discover such data.

You can access the STAC catalog for this project at [this link](https://radiantearth.github.io/stac-browser/#/external/pilot-imfe-o.s3-ext.jc.rl.ac.uk/haig-fras/stac/catalog.json). For detailed information on generating a STAC Catalog, please refer to the [Data Pipelines repository](https://github.com/NOC-OI/data_pipelines).

## Creating STAC Catalogs

To create STAC Catalogs for this project, you'll need to utilize the [Data Pipelines Package](https://github.com/NOC-OI/data_pipelines). Follow these steps:

1. Create a set of configuration files referred to as "metadata."

Metadata files include a primary JSON file representing the main catalog. Depending on the data group, if you wish to add sub-catalogs to your catalog, you can create auxiliary JSON files. The repository provides a list of example files.

2. Import the function and create an instance of the class in Python:

```python
from create_stac.stac_gen import STACGen

# Create an instance of the class and provide the path to your metadata files (JSON files)
s = STACGen(metadata_path='../metadatas/')
```

3. Generate the STAC Catalog:

```python
s.stac_gen(upload_bucket=True,
            stac_path='stac'
            )
```

4. Upon completion, a folder named "stac" will be created containing your STAC Catalog.

## Generating JSON for Web Applications

When using STAC Catalogs in a frontend, importing all the individual files can be time-consuming. To expedite this process, a set of scripts has been created to convert the STAC into a single user-friendly JSON format that can be accepted by web applications. Currently, we are converting the STAC into a JSON format suitable for the "Haig Fras Digital Twin" project.

To generate the JSON file, follow these steps:

1. Import the function and create an instance of the class in Python:

```python
from create_stac.stac_convert import STACConvert

c = STACConvert(bucket_path='',
                stac_path='stac')
```

2. Generate the JSON file from the STAC Catalog:

```python
c.convert()
```

3. Save the final JSON file and upload it to the object store:

```python
c.save_and upload(filename='layers.json')
```

4. At this point, a file named "layers.json" will be created and ready for use by the web application.

5. Set the following environment variables in your frontend project with information related to the path of your JSON file: "VITE_LAYERS_JSON_URL" and "VITE_LAYERS3D_JSON_URL".
