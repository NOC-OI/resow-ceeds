# COG

Dois sistemas para abrir imagens COG foram implementados:
1) Uso de um servidor de tiles baseado no [www.titiler.xyz](www.titiler.xyz). Esse esta atualmente em producao atraves dos links https://imfe-pilot-tileserver.noc.ac.uk.net/ and https://haigfras-salt-tileserver.co.uk/, and in the repository [tileserver](https://git.noc.ac.uk/ocean-informatics/imfepilot/tileserver);
2) Uso da biblioteca [georaster](https://github.com/GeoTIFF/georaster), que nao necessita utilizar um servidor de tiles. Cabe ressaltar que, para esse projeto, avaliamos que o uso de um servidor de tiles e' muito mais rapido para a renderizacao de mapas no frontend.

Tanto para os mapas 2D quanto para os mapas 3D, foram utilizados a opcao do servidor de tiles.

Para os arquivos COG, tambem foram implementados codigos para processamento dos dados no frontend. Estes codigos sao baseados na biblioteca Geoblaze, que permite interagir com arquivos diretamente no frontend.

![COG](assets/cog.png)
*Visao geral do mapa em 2D mostrando uma imagem em COG. O grafico foi gerado utilizando a biblioteca Geoblaze para obter os dados e Plotly para a plotagem*
