import 'leaflet/dist/leaflet'
// import { protobuf } from '../MapHome/addVectorGridL'
import { colors, eunis } from '../data/mbTilesLegend'
import { protobuf } from './addVectorGridL'

export class GetMBTiles {
  constructor(layerName, actualLayer) {
    this.layerName = layerName
    this.actualLayer = actualLayer
    this.url = layerName.url
    this.layer = null
    this.colors = colors
    this.eunis = eunis
  }

  async getLayer() {
    const MBTILES_SERVER = process.env.VITE_MBTILES_URL
    const vectorTileOptions = {
      interactive: true,
      vectorTileLayerStyles: {
        output4326: function (properties, zoom) {
          // const eu = this.layerName.colors
          // let color = '#cf52d3'

          // eunis.forEach((t, idx) => {
          //   if (eu === t) {
          //     color = colors[idx]
          //   }
          // })
          return {
            weight: 0,
            color: this.layerName.colors,
            fillColor: this.layerName.colors,
            fillOpacity: 0.7,
            opacity: 0.7,
            fill: true,
          }
        },
      },
    }

    this.url = this.url.replace(
      'https://imfe-pilot-mbtiles.noc.ac.uk/',
      MBTILES_SERVER,
    )
    this.layer = protobuf(`${this.url}`, vectorTileOptions)
    this.layer.setOpacity(0.7)
  }
}
