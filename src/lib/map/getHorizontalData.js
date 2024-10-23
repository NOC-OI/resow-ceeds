import axios from 'axios'
import haversine from 'haversine'
import { convertProjection } from './utils'

export class GetHorizontalData {
  constructor(
    graphLimits,
    graphColumnName,
    graphColumn,
    numberOfBins,
    selectedColumn,
    layersData,
  ) {
    this.selectedColumn = selectedColumn
    this.numberOfBins = numberOfBins
    this.graphLimits = graphLimits.getLatLngs()
    this.latitudes = this.linspace(
      this.graphLimits[0].lat,
      this.graphLimits[1].lat,
      this.numberOfBins,
    )
    this.longitudes = this.linspace(
      this.graphLimits[0].lng,
      this.graphLimits[1].lng,
      this.numberOfBins,
    )
    this.graphColumnName = graphColumnName
    this.graphColumn = graphColumn
    this.url = graphColumn.url
    this.layersData = layersData
    this.dataGraph = {
      distance: Array(this.numberOfBins).fill(0),
      value: Array(this.numberOfBins).fill(0),
    }
    this.columns = []
    this.selectedColumn = null
  }

  linspace(start, stop, num, endpoint = true) {
    const div = endpoint ? num - 1 : num
    const step = (stop - start) / div
    return Array.from({ length: num }, (_, i) => start + step * i)
  }

  getFeatureInfoUrl(baseUrl, layer, coords) {
    const [longitude, latitude] = coords

    const latlng3857 = convertProjection('EPSG:4326', 'EPSG:3857', [
      longitude,
      latitude,
    ])

    const params = {
      SERVICE: 'WMS',
      VERSION: '1.3.0',
      REQUEST: 'GetFeatureInfo',
      LAYERS: layer,
      QUERY_LAYERS: layer,
      STYLES: '',
      BBOX: `${latlng3857[0] - 0.01},${latlng3857[1] - 0.01},${
        latlng3857[0] + 0.01
      },${latlng3857[1] + 0.01}`,
      WIDTH: 101,
      HEIGHT: 101,
      CRS: 'EPSG:3857',
      INFO_FORMAT: 'application/json',
      I: 50,
      J: 50,
      TRANSPARENT: true,
    }

    const queryString = Object.keys(params)
      .map(
        (key) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`,
      )
      .join('&')

    return `${baseUrl}?${queryString}&bbox=${latlng3857[0]},${latlng3857[1]},${latlng3857[0]},${latlng3857[1]}`
  }

  async fetchWMSData() {
    const latLngIni = {
      latitude: this.latitudes[0],
      longitude: this.longitudes[0],
    }
    this.dataGraph = { distance: [], value: [] }
    await Promise.all(
      this.latitudes.map(async (lat, idx) => {
        const distance = haversine(
          latLngIni,
          { latitude: this.latitudes[idx], longitude: this.longitudes[idx] },
          { unit: 'km' },
        )
        this.dataGraph.distance[idx] = distance

        const url = this.getFeatureInfoUrl(
          this.url,
          this.graphColumn.params.layer,
          [this.longitudes[idx], this.latitudes[idx]],
        )

        // Await the fetch call inside the map function
        try {
          const response = await fetch(url)
          if (!response.ok) {
            throw new Error('Network response was not ok')
          }

          const data = await response.text()
          const err = typeof data === 'string' ? null : data
          this.convertFeatureInfoToAList(err, data)
        } catch (error) {
          console.error(
            'There has been a problem with your fetch operation:',
            error,
          )
        }
      }),
    )
  }

  convertFeatureInfoToAList(err, content) {
    function xmlToJson(xml) {
      let obj = {}

      if (xml.nodeType === 1) {
        if (xml.attributes.length > 0) {
          obj['@attributes'] = {}
          for (let i = 0; i < xml.attributes.length; i++) {
            const attribute = xml.attributes.item(i)
            obj['@attributes'][attribute.nodeName] = attribute.nodeValue
          }
        }
      } else if (xml.nodeType === 3) {
        obj = xml.nodeValue.trim()
      }

      if (xml.hasChildNodes()) {
        for (let i = 0; i < xml.childNodes.length; i++) {
          const child = xml.childNodes.item(i)
          const childName = child.nodeName
          const childValue = xmlToJson(child)

          if (childValue !== '') {
            if (typeof obj[childName] === 'undefined') {
              obj[childName] = childValue
            } else {
              if (typeof obj[childName].push === 'undefined') {
                const oldValue = obj[childName]
                obj[childName] = []
                obj[childName].push(oldValue)
              }
              obj[childName].push(childValue)
            }
          }
        }
      }
      return obj
    }

    function convertToGeoJSON(xmlJson) {
      const fields = xmlJson.FeatureInfoResponse.FIELDS['@attributes']

      const x = parseFloat(fields.x)
      const y = parseFloat(fields.y)

      const geoJSON = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            id: fields.id || 'feature-id',
            geometry: {
              type: 'Point',
              coordinates: [x, y],
            },
            properties: Object.keys(fields).reduce((acc, key) => {
              acc[key] = fields[key] !== undefined ? fields[key] : null
              return acc
            }, {}),
          },
        ],
        totalFeatures: 1,
        numberReturned: 1,
        timeStamp: new Date().toISOString(),
        crs: {
          type: 'name',
          properties: {
            name: 'urn:ogc:def:crs:EPSG::3857',
          },
        },
        bbox: [x, y, x, y],
      }

      return geoJSON
    }
    function verifyContent(content) {
      if (content === null || !content.features) {
        return false
      }
      if (!content.features.length) {
        return false
      }
      if (!content.features[0].properties) {
        return false
      }
      return true
    }
    if (err) {
      return
    }

    let newContent
    try {
      newContent = JSON.parse(content)
    } catch (e) {
      try {
        const parser = new DOMParser()
        const xmlDoc = parser.parseFromString(content, 'text/xml')
        const xmlJson = xmlToJson(xmlDoc)
        newContent = convertToGeoJSON(xmlJson)
      } catch (e) {
        return
      }
    }
    const contentOk = verifyContent(newContent)

    if (contentOk) {
      const properties = newContent.features[0].properties
      console.log(properties)
      // if (pixel !== null) {
      //   this.dataGraph.value[idx] = pixel[0] === noDataValue ? null : pixel[0]
      // } else {
      //   this.dataGraph.value[idx] = null
      // }
    }
  }

  async fetchGeoTiffData() {
    let layer = null
    Object.keys(this.layersData).forEach((key) => {
      if (key.split('_')[1] === this.graphColumnName) {
        layer = this.layersData[key]
      }
    })

    const latLngIni = {
      latitude: this.latitudes[0],
      longitude: this.longitudes[0],
    }
    this.dataGraph = { distance: [], value: [] }

    const noDataValue = layer.noDataValue
    await Promise.all(
      this.latitudes.map(async (lat, idx) => {
        const distance = haversine(
          latLngIni,
          { latitude: this.latitudes[idx], longitude: this.longitudes[idx] },
          { unit: 'km' },
        )
        this.dataGraph.distance[idx] = distance
        // eslint-disable-next-line no-undef
        const pixel = await geoblaze.identify(layer, [
          this.longitudes[idx],
          this.latitudes[idx],
        ])
        if (pixel !== null) {
          this.dataGraph.value[idx] = pixel[0] === noDataValue ? null : pixel[0]
        } else {
          this.dataGraph.value[idx] = null
        }
      }),
    )
  }

  async fetchTitilerData() {
    const TILE_SERVER_URL = process.env.VITE_TILE_SERVER_URL
    const latLngIni = {
      latitude: this.latitudes[0],
      longitude: this.longitudes[0],
    }

    let noDataUrl
    if (typeof this.url === 'object') {
      noDataUrl = this.url[0]
    } else {
      noDataUrl = this.url
    }
    this.dataGraph = { distance: [], value: [] }

    const noDataValue = await axios
      .get(`${TILE_SERVER_URL}cog/info/?url=${encodeURIComponent(noDataUrl)}`)
      .then((r) => r.data.nodata_value)
    await Promise.all(
      this.latitudes.map(async (lat, idx) => {
        const distance = haversine(
          latLngIni,
          { latitude: this.latitudes[idx], longitude: this.longitudes[idx] },
          { unit: 'km' },
        )
        if (typeof this.url === 'object') {
          let requestSucceeded = false
          this.dataGraph.distance[idx] = distance
          for (const url of this.url) {
            const newUrl = `${TILE_SERVER_URL}cog/point/${
              this.longitudes[idx]
            },${this.latitudes[idx]}?url=${encodeURIComponent(url)}`

            try {
              const response = await axios.get(newUrl)
              if (response.data.values[0] === noDataValue) {
                this.dataGraph.value[idx] = null
              } else {
                this.dataGraph.value[idx] = response.data.values[0]
                this.dataGraph.distance[idx] = distance
                requestSucceeded = true
              }
              break
            } catch (error) {}
          }
          if (!requestSucceeded) {
            this.dataGraph.value[idx] = null
            this.dataGraph.distance[idx] = distance
          }
        } else {
          const newUrl = `${TILE_SERVER_URL}cog/point/${this.longitudes[idx]},${
            this.latitudes[idx]
          }?url=${encodeURIComponent(this.url)}`
          try {
            const response = await axios.get(newUrl)
            if (response.data.values[0] === noDataValue) {
              this.dataGraph.value[idx] = null
            } else {
              this.dataGraph.value[idx] = response.data.values[0]
            }
            this.dataGraph.distance[idx] = distance
          } catch (error) {
            this.dataGraph.value[idx] = null
          }
        }
      }),
    )
  }
}

export class GetTitilerDataOneValue {
  constructor(lat, lon, url) {
    this.url = url
    this.lat = lat
    this.lon = lon
    this.dep = null
  }

  async fetchData() {
    const TILE_SERVER_URL = process.env.VITE_TILE_SERVER_URL

    const newUrl = this.layerName.signed_url
      ? this.layerName.signed_url
      : this.url
    const isUrlEncoded = !!this.layerName.signed_url

    const urlForFetch = `${TILE_SERVER_URL}cog/point/${this.lat},${
      this.lon
    }?url=${encodeURIComponent(newUrl)}&encoded=${isUrlEncoded}`
    await axios.get(urlForFetch).then(async (r) => {
      this.dep = r.data.values[0]
    })
  }
}
