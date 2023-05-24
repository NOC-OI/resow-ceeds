import 'leaflet/dist/leaflet'
import './canvasField'
import * as L from 'leaflet'

export class GetCanvasLayer {
  constructor(text) {
    this.text = text
    this.s = null
    this.layer = null
  }

  async getLayer() {
    this.s = L.ScalarField.fromASCIIGrid(this.text)
    this.layer = L.canvasLayer.scalarField(this.s)

    // await d3.text(this.url, async function (asc) {
    //   this.asc = asc
    //   this.s = L.ScalarField.fromASCIIGrid(asc)
    //   this.layer = L.canvasLayer.scalarField(s)
    // })
  }
}
