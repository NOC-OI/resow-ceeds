# COG

Os arquivos MBTiles sao utilizados para guardar dados vetoriais como um banco de dados SQLite.
Para abrir arquivos MBTiles, foi criado um servico em python para poder processar as queries no banco de dados e retornar para o frontend somente os dados que serao renderizados no mapa. Este servidor e' baseado na biblioteca [mbtiles-s3-server](https://github.com/uktrade/mbtiles-s3-server), e esta atualmente em producao atraves dos links https://imfe-pilot-mbtiles.noc.ac.uk.net/ and https://haigfras-salt-mbtiles.co.uk/. Seu repositorio para o projeto e': https://git.noc.ac.uk/ocean-informatics/imfepilot/mbtiles;

![image info](public/readme/mbtiles.png)
*Visao geral do mapa em 2D mostrando uma imagem em MBTiles.*

Devido a restricoes da biblioteca Cesium, ainda nao e' possivel abrir arquivos MBTiles em mapas 3D.