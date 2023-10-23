# Haig Fras Digital Twin Project: Frontend

O projeto Digital Twin para Haig Fras tem como objetivo montar um sistema que represente um Gemeo Digital para a area de protecao ambiental
Haig Fras, no mar Celta.

Esse app foi codado em React, com a possibilidade de interagir com diferentes formatos de dados no backend e no frontend. Esse projeto tem como dependencia o uso de alguns servicos de backend para realizar atividades de servidor de tiles, como tambem para realizar autenticacao e calculos nos dados.

Todos os arquivos utilizados pelo frontend estao disponiveis em um Object Store. Atualmente estamos utilizando Object Stores compativeis com a API da AWS, como a JASMIN e a Oracle Cloud.

## Acesso

This app is currently running on Jasmin and Oracle Cloud, and could be accessed via the link https://imfe-pilot.noc.ac.uk/ and https://haigfras-salt.co.uk/

## Run this project

In the project directory, you can run:

### `npm install`

It will install all the npm packages available on package.json file

### Set ENV variables

You need to create a .env.development file and add these env variables:

```
VITE_MAPBOX_API_KEY=
VITE_WEBSITE_JSON_URL=/website.json
VITE_LAYERS_JSON_URL=https://pilot-imfe-o.s3-ext.jc.rl.ac.uk/haig-fras/frontend/layers.json
VITE_LAYERS3D_JSON_URL=https://pilot-imfe-o.s3-ext.jc.rl.ac.uk/haig-fras/frontend/layers.json

VITE_SERVER_ENDPOINT=
VITE_CESIUM_TOKEN=
VITE_JASMIN_OBJECT_STORE_URL=

VITE_MBTILES_URL=https://imfe-pilot-mbtiles.noc.ac.uk/
VITE_API_URL=https://imfe-pilot-api.noc.ac.uk/
VITE_TILE_SERVER_URL=https://imfe-pilot-tileserver.noc.ac.uk/

VITE_ENV=DEV
VITE_LOGIN=0
VITE_ORCID_CLIENT_ID=
VITE_ORCID_CLIENT_SECRET=
VITE_365_CLIENT_ID=
VITE_365_TENANCY_ID=
VITE_365_REDIRECT_URI=
```
You can ask for the repo owner to access those variables.

It is important to mention that, to avoid authentication, you need to set the variable VITE_LOGIN to "0", otherwise it will ask you to authenticate.

### `npm run dev`

Runs the app in the development mode.\
Open [http://localhost:8080](http://localhost:8080) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

## Run script in production

```bash
docker build --progress=plain -t frontend .
docker run -p 8080:80 -d frontend
```
