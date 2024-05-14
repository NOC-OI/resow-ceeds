/* eslint-disable no-undef */
import chroma from 'chroma-js'
import axios from 'axios'
import { parse, stringify } from 'qs'
import 'leaflet/dist/leaflet'
import * as Cesium from 'cesium'
import {
  defaultOpacity,
  defaultMaxZoom,
  TILE_SERVER_URL,
  getUrlTileServer,
} from './utils'

export class GetTifLayer {
  constructor(url, actualLayer, resolution = 64, scale = [0, 1], layerName) {
    this.actualLayer = actualLayer
    this.url = url
    this.layer = null
    this.georaster = null
    this.resolution = resolution
    this.scale = scale
    this.layerName = layerName
    this.georaster = null
  }

  async loadGeo() {
    await geoblaze.load(this.url).then(async (georaster) => {
      this.layer = georaster
      this.georaster = georaster
      this.stats = await geoblaze.stats(georaster)
    })
  }

  async clipGeo(georaster, bbox) {
    const bboxNumbers = bbox.map((x) => Number(x))
    const pixels = await geoblaze.get(georaster, bboxNumbers)
    return pixels
  }

  async parseGeoSimple() {
    this.scale = this.url.scale
    const color = this.url.colors
    let scale
    if (color.slice(-2) === '_r') {
      scale = chroma
        .scale(this.url.colors.slice(0, -2))
        .domain([this.scale[1], this.scale[0]])
    } else {
      scale = chroma.scale(this.url.colors).domain(this.scale)
    }
    this.layer = await new GeoRasterLayer({
      georaster: this.url.data,
      opacity: this.url.opacity,
      resolution: this.resolution,
      pixelValuesToColorFn: function (values) {
        const population = values[0]
        if (!population) {
          return
        }
        if (population === -9999) {
          return
        }
        return scale(population).hex()
      },
    })
    this.layer.options.attribution = this.actualLayer
  }

  async parseGeo() {
    await fetch(this.url)
      .then(async (response) => await response.arrayBuffer())
      .then(async (arrayBuffer) => {
        await parseGeoraster(arrayBuffer).then(async (georaster) => {
          if (this.layerName.scale) {
            this.scale = this.layerName.scale
          } else {
            const stats = await geoblaze.stats(georaster)
            this.scale = [stats[0].min, stats[0].max]
          }
          let scale
          const color = this.layerName.colors
          if (color.slice(-2) === '_r') {
            scale = chroma
              .scale(this.layerName.colors.slice(0, -2))
              .domain([this.scale[1], this.scale[0]])
          } else {
            scale = chroma.scale(this.layerName.colors).domain(this.scale)
          }
          this.georaster = georaster
          this.layer = await new GeoRasterLayer({
            georaster,
            opacity: defaultOpacity,
            resolution: this.resolution,
            pixelValuesToColorFn: function (values) {
              const population = values[0]
              if (!population) {
                return
              }
              if (population === -9999) {
                return
              }
              return scale(population).hex()
            },
          })
          this.layer.options.attribution = this.actualLayer
        })
      })
  }
}

export class GetCOGLayer {
  constructor(
    layerName,
    actualLayer,
    dimensions,
    dataType = 'COG',
    colourScheme = 'ocean_r',
    contrast = true,
  ) {
    this.layerName = layerName
    this.actualLayer = actualLayer
    this.url = layerName.url
    this.dataType = dataType
    this.layer = null
    this.colourScheme = colourScheme
    this.bounds = null
    this.popupText = ''
    this.position = null
    this.error = null
    this.stats = null
    this.dimensions = dimensions
    this.contrast = contrast
  }

  async getStats() {
    const [newUrl, isUrlEncoded] = getUrlTileServer(this.layerName, this.url)

    return await axios
      .get(
        `${TILE_SERVER_URL}cog/statistics?url=${encodeURIComponent(
          newUrl,
        )}&encoded=${isUrlEncoded}`,
      )
      .then((r) => r.data)
      .catch((error) => {
        return error.response.status
      })
  }

  async getInfo() {
    const [newUrl, isUrlEncoded] = getUrlTileServer(this.layerName, this.url)

    return await axios
      .get(
        `${TILE_SERVER_URL}cog/info?url=${encodeURIComponent(
          newUrl,
        )}&encoded=${isUrlEncoded}`,
      )
      .then((r) => r.data)
      .catch((error) => error.response.status)
  }

  createCesiumLayer(tileUrl, actualLayer, stats, dataType) {
    const layer = new Cesium.ImageryLayer(
      new Cesium.UrlTemplateImageryProvider({
        url: tileUrl,
      }),
      {},
    )
    layer.attribution = actualLayer
    layer.dataType = dataType
    layer.stats = stats
    return layer
  }

  createLeafletLayer(tileUrl, actualLayer, stats, url, bounds) {
    const layer = L.tileLayer(tileUrl, {
      opacity: defaultOpacity,
      maxZoom: defaultMaxZoom,
      attribution: actualLayer,
      stats,
      url,
      limits: bounds,
    })
    return layer
  }

  async getTile(statsValue = undefined) {
    const [newUrl, isUrlEncoded] = getUrlTileServer(this.layerName, this.url)

    if (this.layerName.colors) {
      this.colourScheme = this.layerName.colors.toLowerCase()
    }
    const cogInfo = await this.getInfo()

    if (cogInfo === 500) {
      this.error = 'You do not have authorization to access this file'
      return
    }

    this.bounds = cogInfo.bounds
    if (statsValue) {
      this.stats = statsValue
    } else {
      this.stats = await this.getStats()
    }
    if (this.stats === 500) {
      this.error = 'You do not have authorization to access this file'
      return
    }

    if (this.dataType === 'marker') {
      const icon = createIcon('/marker-icon.png', [27, 45])
      this.popupText = ``
      this.position = [
        (this.bounds[3] + this.bounds[1]) / 2,
        (this.bounds[2] + this.bounds[0]) / 2,
      ]
      options = {
        riseOnHover: true,
        autoPanOnFocus: false,
        icon,
      }
      this.layer = createMarker(this.position, options)
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
      const rescale = []
      for (let i = 0; i < bands.length; i++) {
        const stats = this.stats[bands[i]]
        if (this.layerName.scale) {
          rescale.push(`${this.layerName.scale[0]},${this.layerName.scale[1]}`)
        } else {
          if (this.contrast) {
            stats
              ? rescale.push(`${stats.percentile_2},${stats.percentile_98}`)
              : rescale.push('0,255')
          } else {
            rescale.push('0,255')
          }
        }
      }

      const args = {
        bidx: bidx.length === 1 ? bidx[0] : bidx,
        rescale: rescale.length === 1 ? rescale[0] : rescale,
        url: newUrl,
        encoded: isUrlEncoded,
      }

      const tileJson = await axios
        .get(`${TILE_SERVER_URL}cog/WebMercatorQuad/tilejson.json`, {
          params: args,
          paramsSerializer: {
            encode: (params) => parse(params),
            serialize: (params) => stringify(params, { arrayFormat: 'repeat' }),
          },
        })
        .then((r) => r.data)
      let tileUrl = tileJson.tiles[0]
      if (bands.length === 1) {
        tileUrl += `&colormap_name=${this.colourScheme}`
      }
      if (this.dimensions === 3) {
        this.layer = this.createCesiumLayer(
          tileUrl,
          this.actualLayer,
          this.stats,
          this.dataType,
        )
      } else {
        this.layer = this.createLeafletLayer(
          tileUrl,
          this.actualLayer,
          this.stats,
          this.url,
          this.bounds,
        )
      }
      return this.layer
    }
  }
}
