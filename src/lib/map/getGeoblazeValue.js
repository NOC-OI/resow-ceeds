import geoblaze from 'geoblaze'
import 'leaflet/dist/leaflet'
import { TILE_SERVER_URL, getUrlTileServer, convertProjection } from './utils'

export class GetGeoblazeValue {
  constructor(layerName, latlng, coords, layer) {
    this.url = layerName.url
    this.latlng = latlng
    this.coords = coords
    this.layer = layer
    this.dep = null
    this.layerName = layerName
  }

  async getDep(georaster) {
    const result = await geoblaze.identify(georaster, [
      this.latlng.lng.toFixed(4),
      this.latlng.lat.toFixed(4),
    ])
    if (result) {
      this.dep = result[0]
    } else {
      this.dep = null
    }
    if (this.dep < 0) {
      this.dep = this.dep * -1
    }
  }

  async getGeoblaze() {
    if (this.coords) {
      const [newUrl, isUrlEncoded] = getUrlTileServer(this.layerName, this.url)
      const url = `${TILE_SERVER_URL}cog/tiles/WebMercatorQuad/${this.coords.z}/${this.coords.x}/${this.coords.y}.tif?url=${newUrl}&encoded=${isUrlEncoded}`
      const latlng3857 = convertProjection('EPSG:4326', 'EPSG:3857', [
        this.latlng.lng,
        this.latlng.lat,
      ])
      this.latlng = { lng: latlng3857[0], lat: latlng3857[1] }
      this.layer = await geoblaze.parse(url)
      await this.getDep(this.layer)
    } else {
      if (this.layer) {
        await this.getDep(this.layer)
      } else {
        await geoblaze.load(this.url).then(async (georaster) => {
          await this.getDep(georaster)
        })
      }
    }
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
    const latlng3857 = convertProjection('EPSG:4326', 'EPSG:3857', [
      this.latlng.lng,
      this.latlng.lat,
    ])
    await Promise.all(
      this.yearMonths.map(async (yearMonth, idx) => {
        const newUrl = this.url.replace('actualDate', yearMonth)
        try {
          const georaster = await geoblaze.parse(newUrl)
          const value = await geoblaze.identify(georaster, [
            latlng3857[0],
            latlng3857[1],
          ])

          const [year, month] = yearMonth.split('-')
          this.dataGraph.time[idx] = new Date(
            parseInt(year),
            parseInt(month),
            1,
          )
          this.dataGraph.value[idx] = value[0]
        } catch (err) {
          this.dataGraph.value[idx] = null
        }
      }),
    )
  }
}
