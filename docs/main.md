# Haig Fras Digital Twin Project: Frontend

O projeto Digital Twin para Haig Fras tem como objetivo montar um sistema que represente um Gemeo Digital para a area de protecao ambiental
Haig Fras, no mar Celta.


Todos os arquivos utilizados pelo frontend estao disponiveis em um Object Store. Atualmente estamos utilizando Object Stores compativeis com a API da AWS, como a JASMIN e a Oracle Cloud.

## Acesso

This app is currently running on Jasmin and Oracle Cloud, and could be accessed via the link https://imfe-pilot.noc.ac.uk/ and https://haigfras-salt.co.uk/

![Autenticacao](public/readme/auth.png)

## Organizacao do Website

O aplicativo web esta organizado em torno do arquivo 'public/website.json'. Este arquivo apresenta a organizacao geral dos itens do 'Sidebar'. E' importante salientar que qualquer alteracao nesse arquivo deve ser realizada com cautela, pois podera alterar quebrar o site.

Nesse arquivo e' possivel adicionar itens ou links ao SideBar, como tambem informacoes e novas layers.

## Features

Esse aplicativo possui a habilidade de poder renderizar em mapas diversos formatos de arquivos, tais como COG (Cloud Optimised GeoTIFF), MBTiles, GeoJSON, geotiff, shape files and png. Esse aplicativo possui uma versao 2D e uma versao 3D.

Foram implementadas as seguintes features no projeto:

### Autenticacao

Para controle de acesso do site, foram implementados dois tipos de autenticacao: ORCID e Microsoft 365. Maiores informacoes podem ser obtidas [aqui](docs/assets/auth.md).

### Mapa 2D

A versao 2D foi baseada na biblioteca [React Leaflet](https://react-leaflet.js.org/). Maiores informacoes podem ser obtidas [aqui](docs/assets/2dmap.md).

### Mapa 3D

A versao 3D foi baseada na biblioteca [Resium](https://resium.reearth.io/) (Cesium for React). Maiores informacoes podem ser obtidas [aqui](docs/assets/3dmap.md).

### Organizacao das Layers

- [Cloud Optimised GeoTIFF](cog.md)
- [MBTiles](cog.md)
- [WMS Layers](cog.md)


### Interaginco com diferentes tipos de dados:

- [Cloud Optimised GeoTIFF](cog.md)
- [MBTiles](cog.md)
- [WMS Layers](wms.md)
- [Cesium Ion](cesium_ion.md)

### Calculos no backend

Para realizar alguns tipos de calculos, optou-se por 

Performing calculations based on information provided by the user. The calculations are performed in an API, available at https://imfe-pilot-api.noc.ac.uk.net/ and https://haigfras-salt-api.co.uk/, and in the repository [api_calculations_use_cases](https://git.noc.ac.uk/ocean-informatics/imfepilot/api_calculations_use_cases).


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

