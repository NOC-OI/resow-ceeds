import geoblaze from 'geoblaze'
import 'leaflet/dist/leaflet'
import proj4 from 'proj4'

export class GetGeoblazeValue {
  constructor(layer, latlng, coords) {
    this.layer = layer
    this.latlng = latlng
    this.dep = null
    this.coords = coords
  }

  async getGeoblaze() {
    if (this.coords) {
      const url = `https://titiler.xyz/cog/tiles/WebMercatorQuad/${this.coords.z}/${this.coords.x}/${this.coords.y}.tif?url=${this.layer.options.url}`
      const latlng3857 = proj4('EPSG:4326', 'EPSG:3857').forward([
        this.latlng.lng,
        this.latlng.lat,
      ])
      try {
        await geoblaze.parse(url).then(async (georaster) => {
          await geoblaze
            .identify(georaster, [latlng3857[0], latlng3857[1]])
            .then(async (result) => {
              this.dep = result[0]
            })
        })
      } catch (err) {
        this.dep = null
      }
      // geoblaze.identify(value, [latlng3857[0], latlng3857[1]]).then((t) => {
      //   console.log(t)
      // })
      // geoblaze.max(value).then((t) => {
      //   console.log(t)
      // })
      // console.log(
      //   geoblaze.identify(value, [this.latlng.lng, this.latlng.lat]),
      // )
    } else {
      this.dep = geoblaze.identify(this.layer, [
        this.latlng.lng,
        this.latlng.lat,
      ])
      this.dep = this.dep[0]
    }
    if (this.dep < 0) {
      this.dep = this.dep * -1
    }
    // console.log(this.layer)
    // if (this.layer.options) {
    //   geoblaze.parse(this.layer.options.url).then((value) => {
    //     console.log(
    //       geoblaze.identify(value, [this.latlng.lng, this.latlng.lat]),
    //     )
    //   })
    // }
  }
}
