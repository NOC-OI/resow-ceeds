import 'leaflet/dist/leaflet'
import {} from 'leaflet.vectorgrid/dist/Leaflet.VectorGrid.bundled.js'
// import PropTypes from 'prop-types';
// import { childrenType, GridLayer } from 'react-leaflet';
import { protobuf } from '../MapHome/addVectorGridL'

const eunis = [
  'A5.37: Deep circalittoral mud',
  'A5.23 or A5.24: Infralittoral fine sand or Infralittoral muddy sand',
  'A5.25 or A5.26: Circalittoral fine sand or Circalittoral muddy sand',
  'A5.27: Deep circalittoral sand',
  'A5.13: Infralittoral coarse sediment',
  'A5.14: Circalittoral coarse sediment',
  'A5.15: Deep circalittoral coarse sediment',
  'A5.43: Infralittoral mixed sediments',
  'A5.44: Circalittoral mixed sediments',
  'A5.45: Deep circalittoral mixed sediments',
  'A3.3: Atlantic and Mediterranean low energy infralittoral rock',
  'A3: Infralittoral rock and other hard substrata',
  'A3.1: Atlantic and Mediterranean high energy infralittoral rock',
  'A4.1: Atlantic and Mediterranean high energy circalittoral rock',
  'A3.2: Atlantic and Mediterranean moderate energy infralittoral rock',
  'A4.3: Atlantic and Mediterranean low energy circalittoral rock',
  'A4.2: Atlantic and Mediterranean moderate energy circalittoral rock',
  'A4.12: Sponge communities on deep circalittoral rock',
  'A4: Circalittoral rock and other hard substrata',
  'A4.27: Faunal communities on deep moderate energy circalittoral rock',
  'A4.33: Faunal communities on deep low energy circalittoral rock',
  'A4.12 or A4.27 or A4.33: Sponge communities on deep circalittoral rock or Faunal communities on deep moderate energy circalittoral rock or Faunal communities on deep low energy circalittoral rock',
  'A5.34: Infralittoral fine mud',
  'A5.36: Circalittoral fine mud',
  'A5.33: Infralittoral sandy mud',
  'A5.35: Circalittoral sandy mud',
  'A5.6: Sublittoral biogenic reefs',
  'A6.11: Deep-sea rock',
  'A6.5: Deep-sea mud',
  'A6: Deep-sea bed',
  'A6.2: Deep-sea mixed substrata',
  'A6.3 Deep-sea sand or A6.4 Deep-sea muddy sand',
  'Na',
  'A5.33 or A5.34: Infralittoral sandy mud or Infralittoral fine mud',
  'A5.35 or A5.36: Circalittoral sandy mud or Circalittoral fine mud',
  'A6.611: Deep-sea Lophelia pertusa reefs',
  'A6.61: Communities of deep-sea corals',
  'A5: Sublittoral sediment',
  'A5.625: [Mytilus edulis] beds on sublittoral sediment',
  'A5.612: Sabellaria alveolata on variable salinity sublittoral mixed sediment',
  'A5.61: Sublittoral polychaete worm reefs on sediment',
  'A5.62: Sublittoral mussel beds on sediment',
  'A5.611: [Sabellaria spinulosa] on stable circalittoral mixed sediment',
  'A5.435: Oyster beds on shallow sublittoral muddy mixed sediment',
  'A5.631: Circalittoral Lophelia pertusa reefs',
  'A5.434: [Limaria hians] beds in tide-swept sublittoral muddy mixed sediment',
  'A5.613: [Serpula vermicularis] reefs on very sheltered circalittoral muddy sand',
]

const colors = [
  '#A3A300',
  '#A7A200',
  '#AB4F00',
  '#AF0000',
  '#B30000',
  '#B7001C',
  '#BB0073',
  '#BF00BF',
  '#C300C3',
  '#9400C7',
  '#4300CB',
  '#0000CF',
  '#0000D3',
  '#004AD7',
  '#009CDB',
  '#00DFDF',
  '#00E3D2',
  '#00E787',
  '#00EB3E',
  '#00EF00',
  '#2CF300',
  '#76F700',
  '#BCFB00',
  '#FFFF00',
  '#C4FF07',
  '#87FF0F',
  '#49FF16',
  '#1EFF1E',
  '#25FF50',
  '#2DFF96',
  '#34FFDB',
  '#3CFFFF',
  '#43E2FF',
  '#4AA5FF',
  '#5269FF',
  '#5959FF',
  '#7361FF',
  '#B468FF',
  '#F270FF',
  '#FF77FF',
  '#FF7EF6',
  '#FF86C2',
  '#FF8D93',
  '#FF9595',
  '#FF9F9C',
  '#FFD1A4',
  '#FFFEAB',
  '#FFFFB3',
]

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
    // eslint-disable-next-line @typescript-eslint/no-this-alias

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
            fill: true,
          }
        },
      },
    }
    this.layer = protobuf(this.url, vectorTileOptions)
  }
}
