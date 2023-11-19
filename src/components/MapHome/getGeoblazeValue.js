import geoblaze from 'geoblaze'
import 'leaflet/dist/leaflet'
import proj4 from 'proj4'

export class GetGeoblazeValue {
  constructor(layer, latlng, coords, layerName) {
    this.layer = layer
    this.latlng = latlng
    this.dep = null
    this.coords = coords
    this.layerName = layerName
    this.url = null
  }

  async getGeoblaze() {
    const TILE_SERVER_URL = process.env.VITE_TILE_SERVER_URL

    if (this.coords) {
      this.url = this.layer.options.url
      let isUrlEncoded = false
      if (this.layerName) {
        this.url = this.layerName.signed_url
          ? this.layerName.signed_url
          : this.url
        isUrlEncoded = !!this.layerName.signed_url
      }
      const url = `${TILE_SERVER_URL}cog/tiles/WebMercatorQuad/${this.coords.z}/${this.coords.x}/${this.coords.y}.tif?url=${this.url}&encoded=${isUrlEncoded}`
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
    } else {
      this.dep = geoblaze.identify(this.layer, [
        this.latlng.lng,
        this.latlng.lat,
      ])
      if (this.dep) {
        this.dep = this.dep[0]
      }
    }
    if (this.dep < 0) {
      this.dep = this.dep * -1
    }
  }
}

export class GetGeoblazeValue3D {
  constructor(url) {
    this.url = url
    this.dep = null
    this.layer = null
  }

  async parseGeoraster() {
    await geoblaze.load(this.url).then(async (georaster) => {
      this.layer = georaster
    })
  }

  async getGeoblaze(latlng) {
    this.dep = geoblaze.identify(this.layer, [
      latlng.lng.toFixed(4),
      latlng.lat.toFixed(4),
    ])
    this.dep = this.dep[0]
  }
}

export class GetGeoblazeValuePoint {
  constructor(coords, url, yearMonths) {
    this.coords = coords[0]
    this.url = url
    this.yearMonths = yearMonths
    this.dataGraph = {
      time: Array(yearMonths.length).fill(0),
      value: Array(yearMonths.length).fill(0),
    }
  }

  async getGeoblaze() {
    const latlng3857 = proj4('EPSG:4326', 'EPSG:3857').forward([
      this.coords.lng,
      this.coords.lat,
    ])
    await this.yearMonths.forEach(async (yearMonth, idx) => {
      const newUrl = this.url.replace('actualDate', yearMonth)
      try {
        const georaster = await geoblaze.parse(newUrl)
        const value = await geoblaze.identify(georaster, [
          latlng3857[0],
          latlng3857[1],
        ])

        const [year, month] = yearMonth.split('-')
        this.dataGraph.time[idx] = new Date(parseInt(year), parseInt(month), 1)
        // this.dataGraph.time[idx] = yearMonth
        this.dataGraph.value[idx] = value[0]
      } catch (err) {
        // console.log(newUrl)
        // console.log(yearMonth)
        // console.log(err)

        this.dataGraph.value[idx] = null
      }
    })
  }
}
