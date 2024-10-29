# How to Deploy the Digital Twin to a New Server

## Prerequisites
You will need four virtual machines running Ubuntu 22.04, each with 4-8GB of RAM and 10GB of disk space for the OS. Additionally, two of these machines should have an extra 50GB of disk space (can be on an additional disk/volume).

The four virtual machines are as follows:
- **gateway**: Runs an Apache transparent proxy server for all services, sets up Let's Encrypt certificates, and provides SSL connections to web apps.
- **web**: Runs the web apps as Docker containers.
- **tiling**: Runs the tile servers as Docker containers.
- **build**: Functions as a GitLab runner for building and deploying.

Only the **gateway** VM needs an internet-routable IP address. Ensure that you have set the IP address of each system in the Salt pillar hosts file (pillar/hosts.sls) or made sure that the names **gateway**, **web**, and **build** are resolvable via DNS.

These virtual machines can be created using the Salt configuration for this project: [Salt Configuration Repository](https://github.com/NOC-OI/imfe-pilot-salt_config).

### Environment Configuration

You need to set a list of secrets on the CI/CD configuration on GitLab, as described below:

- VITE_CESIUM_TOKEN: the token for the Cesium ION Api. It is necessary in order to access the 3d visualisation
- VITE_MAPBOX_API_KEY: the api key for the mapbox satellite layers
- VITE_ESRI: [OPTIONAL] the api key for  using the ESRI tile service. It has not been used now.
- VITE_JASMIN_OBJECT_STORE_URL: It is necessary to show the bathymetry data
- VITE_LAYERS_JSON_URL: a json file with the information about the layers. Please set to ./layers.json
- VITE_LAYERS3D_JSON_URL: a json file with the information about the layuers ./layers.json
- VITE_MBTILES_URL: [OPTIONAL] the url for the mbtiles tile server. It has not been used now.
- VITE_TILE_SERVER_URL: the url of the tile server. Please set to https://ceeds-tileserver.resow.uk/
- GEOSERVER_ADMIN_USER: the admin username for your geoserver
- GEOSERVER_ADMIN_PASSWORD: the admin password for your geoserver

## Setting up the Virtual Machines
1. Create your virtual machines. On JASMIN, this can be done via the Cloud dashboard at [JASMIN Cloud Dashboard](https://cloud.jasmin.ac.uk/).
2. Assign an internet IP to the **gateway** VM.
3. Ensure you can SSH into each VM via the **gateway**.
4. On the **build**, **tiling**, and **web** VMs, the Docker directory (/var/lib/docker) needs to have plenty of disk space, approximately 50GB, as Docker doesn't always clean up after itself. You can achieve this by either creating a large main disk or creating a second disk and mounting it in /var/lib/docker. If you choose the latter, ensure it gets mounted from the fstab when the VM reboots.

## Setting up Hostnames and SSL Certificates
The following hostnames are used:
- ceeds.resow.uk
- ceeds-tileserver.resow.uk
- ceeds-geooserver.resow.uk

Salt is configured to set up Let's Encrypt for these hostnames but might need additional steps to request the initial certificate.

## Setting up Salt
Salt is the configuration management system used to set up the operating system on the VMs. Follow the instructions provided in the [Salt Configuration Repository](https://github.com/NOC-OI/imfe-pilot-salt_config#deploying-to-another-vm).

## Setting up GitLab Runners
You'll need to configure a GitLab runner on the **build**. Give this runner the tag "shell". The shell runner is used to build Docker containers. Ensure that all three GitLab projects (frontend, geoserver and tileserver) are configured to use these runners.
