# Front end for Haig Fras Digital Twin Project

This is an app built using react and leaflet library to display COGs, geojson, geotiff, shape files and png on an interactive map. Esse projeto e uma continuidade do repositorio [https://git.noc.ac.uk/ocean-informatics/imfe-pilot/-/tree/master/openlayers-cog] (openlayers-cog).

The app was deployed on a free heroku server and can be accessed via the link [http://imfe-pilot.herokuapp.com/](http://imfe-pilot.herokuapp.com/)


## Features

The product is in the development phase and the following features have already been implemented:

### Opening of COG

Two systems for opening COG Files were implemented. The first uses a tile server [www.titiler.xyz](www.titiler.xyz) and the other uses the repository [https://github.com/GeoTIFF/georaster](georaster).

It is still in the process of analyzing the opening speed and rendering of the images in each of the strategies

### Opening Geojson

Openings of geojson files were implemented, which are available both in the JASMIN Object Store and also available within the repository itself

O app foi deployado em um servidor gratuito heroku e pode ser acessado atraves do link [http://imfe-pilot.herokuapp.com/](http://imfe-pilot.herokuapp.com/)

O produto esta na fase de desenvolvimetno e as seguintes feicoes ja foram implementadas:

## Available Scripts

In the project directory, you can run:

### `npm install`

It will install all the npm packages available on package.json file

### `npm run dev`

Runs the app in the development mode.\
Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!
