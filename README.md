# Front end for Haig Fras Digital Twin Project

This is an app built using react and leaflet library to display COGs, geojson, geotiff, shape files and png on an interactive map. Esse projeto e uma continuidade do repositorio [https://git.noc.ac.uk/ocean-informatics/imfe-pilot/-/tree/master/openlayers-cog] (openlayers-cog).

The app is deployed on JASMIN and can be accessed via the link [http://imfe-pilot.noc.ac.uk/](http://imfe-pilot.noc.ac.uk/)

## Features

The product is in the development phase and the following features have already been implemented:

### Opening of COG

Two systems for opening COG Files were implemented. The first uses a tile server [www.titiler.xyz](www.titiler.xyz) and the other uses the repository [georaster](https://github.com/GeoTIFF/georaster).

It is still in the process of analyzing the opening speed and rendering of the images in each of the strategies

### Opening Geojson

Openings of geojson files were implemented, which are available both in the JASMIN Object Store and also available within the repository itself

### Acessing WMS services

Acessing JNCC and EMODNET WMS services to add layers to map.

### Use cases calculation

Performing calculations based on information provided by the user. The calculations are performed in an API, available at [https://imfe-pilot.ddns.net/](https://imfe-pilot.ddns.net/) and in the repository [api_calculations_use_cases](https://git.noc.ac.uk/ocean-informatics/imfepilot/api_calculations_use_cases).

### 3D Map

This is just a 3d map using the mapboxgl library. It still needs to be evaluated in more detail to verify its applicability to the project.

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

## Run script in production

```bash
docker build --progress=plain -t frontend .
docker run -p 8080:80 -d frontend
```

## Notes about the CI/CD pipeline

There is an automatic gitlab CI/CD pipeline in this repository. It is split into two jobs:

**Build:**

This job builds the docker container and tags it as docker-repo.bodc.me/oceaninfo/imfe-pilot/frontend:latest. 

**Deploy:**

This pushes the built container to the BODC container registry. It then SSHs into the host called web, pulls this container and restarts it. This requires a gitlab-runner user to be present on both the build and web VM, an SSH key needs to be configured to allow build to SSH into web. The salt rules repository will create the user and allows a manually generated key to login, but it doesn't create that key. If you reinstall these VMs you'll have to create new SSH keys and update the salt rules (salt/user/gitlab-runner.sls) with the new keys. 

### Ensuring Docker is logged in
The gitlab-runner user on both the build and web VM must have manually logged into the docker registry using the command `docker login docker-repo.bodc.me`. We have a user dedicated to the CI/CD pipeline for this. 

### Firewall Complications
A further complication is that the NOC firewall only allows requests from the fixed IP of the gateway VM, since we can guarantee that nobody else will share this IP. To get around this the deploy script sets up an SSH SOCKS proxy on port 3128 via the gateway to push and pull the containers. The Docker configuration is set (via a Salt rule - salt/docker/proxy.sls) to use localhost:3128 as a proxy. You will need to have the SSH tunnel running to execute the docker login command above. This can be done by running `ssh -D 3128 -f -N gateway` before executing any docker login/push/pull commands. Stop the SSH tunnel with `pkill -f "ssh -D 3128 -f -N gateway"`.


