import 'leaflet/dist/leaflet'
// import PropTypes from 'prop-types';
// import { childrenType, GridLayer } from 'react-leaflet';
import { protobuf } from '../MapHome/addVectorGridL'
import { colors, eunis } from '../../data/mbTilesEmodnetLegend'

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
    const vectorTileOptions = {
      interactive: true,
      vectorTileLayerStyles: {
        all: function (properties, zoom) {
          const eu = properties.EUNIScombD
          let color = '#cf52d3'

          eunis.forEach((t, idx) => {
            if (eu === t) {
              color = colors[idx]
            }
          })
          return {
            weight: 0,
            color,
            fillColor: color,
            fillOpacity: 0.7,
            opacity: 0.7,
            fill: true,
          }
        },
      },
    }
    this.layer = protobuf(`${this.url}`, vectorTileOptions)
    this.layer.setOpacity(0.7)
  }
}
