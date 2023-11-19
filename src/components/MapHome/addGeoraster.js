/* eslint-disable no-undef */
// import chroma from 'chroma-js'
import axios from 'axios'
import { parse, stringify } from 'qs'
import 'leaflet/dist/leaflet'
import * as Cesium from 'cesium'
import chroma from 'chroma-js'

export class GetCOGLayer {
  constructor(layerName, actualLayer) {
    this.layerName = layerName
    this.actualLayer = actualLayer
    this.url = layerName.url
    this.layer = null
  }

  async parseGeo() {
    this.url = `${this.url}`

    await parseGeoraster(this.url).then(async (georaster) => {
      this.layer = new GeoRasterLayer({
        georaster,
        attribution: this.actualLayer,
        resolution: 256,
        opacity: 0.7,
        keepBuffer: 25,
        debugLevel: 0,
      })
    })
  }
}

export class GetTifLayer {
  constructor(url, actualLayer, resolution = 64) {
    this.actualLayer = actualLayer
    this.url = url
    this.layer = null
    this.georaster = null
    this.resolution = resolution
  }

  async parseGeo() {
    await fetch(this.url)
      .then(async (response) => await response.arrayBuffer())
      .then(async (arrayBuffer) => {
        await parseGeoraster(arrayBuffer).then(async (georaster) => {
          this.georaster = georaster
          this.layer = await new GeoRasterLayer({
            georaster,
            opacity: 0,
            resolution: this.resolution,
          })
        })
      })
  }
}

export class GetTifLayer2 {
  constructor(layerName, actualLayer, actualDate, modelTarget, limits, action) {
    this.layerName = layerName
    this.actualLayer = actualLayer
    this.actualDate = actualDate
    this.modelTarget = modelTarget
    this.limits = limits
    this.action = action
    this.resolution = 256
    this.url = layerName.url
    this.layer = null
    this.scale = null
    this.rescale = []
  }

  async getTile(rout) {
    if (rout === '/3d') {
      const TILE_SERVER_URL = process.env.VITE_TILE_SERVER_URL
      this.url = `${this.url}`
      const newUrl = this.layerName.date_range
        ? this.url.replace('actualDate', this.actualDate)
        : this.url
      const cogInfo = await axios
        .get(
          `${TILE_SERVER_URL}cog/info?url=${encodeURIComponent(
            newUrl,
          )}&encoded=false`,
        )
        .then((r) => r.data)
        .catch((error) => {
          return error.response.status
        })

      if (cogInfo === 500) {
        this.error = 'You do not have authorization to access this file'
        return
      }
      const cogStats = await axios
        .get(
          `${TILE_SERVER_URL}cog/statistics?url=${encodeURIComponent(
            newUrl,
          )}&encoded=false`,
        )
        .then((r) => r.data)

      this.stats = cogStats
      this.bounds = cogInfo.bounds

      const bands = []
      for (let i = 0; i < cogInfo.band_descriptions.length; i++) {
        bands.push(cogInfo.band_descriptions[i][0])
      }
      let bidx = [1]
      if (bands.length >= 3) {
        bidx = [1, 2, 3]
      }
      this.contrast = true
      for (let i = 0; i < bands.length; i++) {
        const stats = cogStats[bands[i]]
        if (this.contrast) {
          stats
            ? this.rescale.push(`${stats.percentile_2},${stats.percentile_98}`)
            : this.rescale.push('0,255')
        } else {
          this.rescale.push('0,255')
        }
      }

      const url = newUrl
      this.args = {
        bidx: bidx.length === 1 ? bidx[0] : bidx,
        rescale: this.rescale.length === 1 ? this.rescale[0] : this.rescale,
        url,
        encoded: false,
      }
      this.tileJson = await axios
        .get(`${TILE_SERVER_URL}cog/WebMercatorQuad/tilejson.json`, {
          params: this.args,
          paramsSerializer: {
            encode: (params) => parse(params),
            serialize: (params) => stringify(params, { arrayFormat: 'repeat' }),
          },
        })
        .then((r) => r.data)
      this.tileUrl = this.tileJson.tiles[0]
      if (rout === '/3d') {
        this.colourScheme = 'reds'
      }

      if (bands.length === 1) {
        this.tileUrl += `&colormap_name=${this.colourScheme}`
      }
      this.layer = new Cesium.ImageryLayer(
        new Cesium.UrlTemplateImageryProvider({
          url: this.tileUrl,
        }),
        {},
      )
      this.layer.attribution = this.actualLayer
      this.layer.dataType = this.dataType
      this.layer.stats = this.stats
      this.layer.date_range = this.layerName.date_range
    } else {
      this.url = `${this.url}`
      const newUrl = this.layerName.date_range
        ? this.url.replace('actualDate', this.actualDate)
        : this.url
      await fetch(newUrl)
        .then(async (response) => await response.arrayBuffer())
        .then(async (arrayBuffer) => {
          await parseGeoraster(arrayBuffer).then(async (georaster) => {
            this.scale = this.layerName.scale
            const scale = chroma.scale(this.layerName.colors).domain(this.scale)
            this.layer = await new GeoRasterLayer({
              georaster,
              opacity: 1,
              resolution: this.resolution,
              pixelValuesToColorFn: function (values) {
                const population = values[0]
                if (!population) {
                  return
                }
                return scale(population).hex()
              },
            })
            this.layer.options.attribution = this.actualLayer
            this.layer.options.date_range = this.layerName.date_range
          })
        })
    }
  }
}

export class GetTileLayer {
  constructor(
    layerName,
    actualLayer,
    contrast,
    actualDate = null,
    dataType = 'COG',
  ) {
    this.layerName = layerName
    this.actualLayer = actualLayer
    this.url = layerName.url
    this.dataType = dataType
    this.layer = null
    this.colourScheme = 'ocean_r'
    this.bounds = null
    this.popupText = ''
    this.position = null
    this.rescale = []
    this.args = null
    this.tileJson = null
    this.tileUrl = null
    this.contrast = contrast
    this.error = null
    this.stats = null
    this.actualDate = actualDate
  }

  async getStats() {
    const TILE_SERVER_URL = process.env.VITE_TILE_SERVER_URL

    const newUrl = this.layerName.date_range
      ? this.url.replace('actualDate', this.actualDate)
      : this.url
    const cogStats = await axios
      .get(
        `${TILE_SERVER_URL}cog/statistics?url=${encodeURIComponent(
          newUrl,
        )}&encoded=false`,
      )
      .then((r) => r.data)
      .catch((error) => {
        return error.response.status
      })

    if (cogStats === 500) {
      this.error = 'You do not have authorization to access this file'
      return
    }
    this.stats = cogStats
  }

  async getTile(rout) {
    const TILE_SERVER_URL = process.env.VITE_TILE_SERVER_URL

    this.url = `${this.url}`
    const newUrl = this.layerName.date_range
      ? this.url.replace('actualDate', this.actualDate).replace('tif', 'tiff')
      : this.url
    const cogInfo = await axios
      .get(
        `${TILE_SERVER_URL}cog/info?url=${encodeURIComponent(
          newUrl,
        )}&encoded=false`,
      )
      .then((r) => r.data)
      .catch((error) => {
        return error.response.status
      })

    if (cogInfo === 500) {
      this.error = 'You do not have authorization to access this file'
      return
    }
    const cogStats = await axios
      .get(
        `${TILE_SERVER_URL}cog/statistics?url=${encodeURIComponent(
          newUrl,
        )}&encoded=false`,
      )
      .then((r) => r.data)

    this.stats = cogStats
    this.bounds = cogInfo.bounds

    if (this.dataType === 'marker') {
      this.icon = L.icon({
        iconUrl: '/marker-icon.png',
        iconSize: [27, 45],
      })

      this.position = [
        (this.bounds[3] + this.bounds[1]) / 2,
        (this.bounds[2] + this.bounds[0]) / 2,
      ]
      this.layer = L.marker(
        [
          (this.bounds[3] + this.bounds[1]) / 2,
          (this.bounds[2] + this.bounds[0]) / 2,
        ],
        {
          riseOnHover: true,
          autoPanOnFocus: false,
          icon: this.icon,
        },
      )
      this.popupText = `
        <b>${this.actualLayer}</b><br>
        CEDA: XXXXXXXX<br>
        TILE NUMBER:<em>10</em><br>
        TOTAL AREA OF SURVEY:<em>2km²</em><br>
        EXTENT OF SURVEY:<em>100m</em><br>
        HABITAT:<em>XXXX</em><br>
        SUBSTRATE:<em>XXXX</em><br>
        iFDO SUMMARY:<em>XXXX</em><br>
        <em>XXXXX</em><br>
        <em>XXXXX</em><br>
      `
      this.layer.options.attribution = this.actualLayer
      this.layer.options.url = this.url
      this.layer.options.dataType = this.dataType
    } else {
      const bands = []
      for (let i = 0; i < cogInfo.band_descriptions.length; i++) {
        bands.push(cogInfo.band_descriptions[i][0])
      }
      let bidx = [1]
      if (bands.length >= 3) {
        bidx = [1, 2, 3]
      }

      for (let i = 0; i < bands.length; i++) {
        const stats = cogStats[bands[i]]
        if (this.contrast) {
          stats
            ? this.rescale.push(`${stats.percentile_2},${stats.percentile_98}`)
            : this.rescale.push('0,255')
        } else {
          this.rescale.push('0,255')
        }
      }

      const url = newUrl
      this.args = {
        bidx: bidx.length === 1 ? bidx[0] : bidx,
        rescale: this.rescale.length === 1 ? this.rescale[0] : this.rescale,
        url,
        encoded: false,
      }
      this.tileJson = await axios
        .get(`${TILE_SERVER_URL}cog/WebMercatorQuad/tilejson.json`, {
          params: this.args,
          paramsSerializer: {
            encode: (params) => parse(params),
            serialize: (params) => stringify(params, { arrayFormat: 'repeat' }),
          },
        })
        .then((r) => r.data)
      this.tileUrl = this.tileJson.tiles[0]
      if (rout === '/3d') {
        this.colourScheme = 'ocean_r'
      }

      if (bands.length === 1) {
        this.tileUrl += `&colormap_name=${this.colourScheme}`
      }
      if (rout === '/3d') {
        this.layer = new Cesium.ImageryLayer(
          new Cesium.UrlTemplateImageryProvider({
            url: this.tileUrl,
          }),
          {},
        )
        this.layer.attribution = this.actualLayer
        this.layer.dataType = this.dataType
        this.layer.stats = this.stats
        this.layer.date_range = this.layerName.date_range
      } else {
        this.layer = L.tileLayer(this.tileUrl, {
          opacity: 0.7,
          maxZoom: 30,
          attribution: this.actualLayer,
          stats: this.stats,
          date_range: this.layerName.date_range,
          url: newUrl,
          limits: this.bounds,
        })
      }
    }
  }
}
