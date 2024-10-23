import * as L from 'leaflet'

const BetterWMS = L.TileLayer.WMS.extend({
  initialize: function (url, options, setMapPopup, actual) {
    // @ts-ignore
    L.TileLayer.WMS.prototype.initialize.call(this, url, options)
    this.setMapPopup = setMapPopup
    this.actual = actual
  },

  onAdd: function (map) {
    L.TileLayer.WMS.prototype.onAdd.call(this, map)
    map.on('click', this.getFeatureInfo, this)
  },

  onRemove: function (map) {
    L.TileLayer.WMS.prototype.onRemove.call(this, map)
    map.off('click', this.getFeatureInfo, this)
  },

  getFeatureInfo: function (evt) {
    const url = this.getFeatureInfoUrl(evt.latlng)

    fetch(url)
      .then((response) => {
        if (!response.ok) throw new Error('Network response was not ok')
        return response.text()
      })
      .then((data) => {
        const err = typeof data === 'string' ? null : data
        this.showGetFeatureInfo(err, data)
      })
      .catch(() => {})
  },

  getFeatureInfoUrl: function (latlng) {
    const point = this._map.latLngToContainerPoint(latlng, this._map.getZoom())
    const size = this._map.getSize()
    const crs = L.CRS.EPSG3857
    const sw = crs.project(this._map.getBounds().getSouthWest())
    const ne = crs.project(this._map.getBounds().getNorthEast())

    const params = {
      request: 'GetFeatureInfo',
      service: 'wms',
      crs: 'EPSG:3857',
      styles: this.wmsParams.styles,
      transparent: this.wmsParams.transparent,
      version: this.wmsParams.version,
      format: this.wmsParams.format,
      bbox: sw.x + ',' + sw.y + ',' + ne.x + ',' + ne.y,
      height: size.y,
      width: size.x,
      layers: this.wmsParams.layers,
      query_layers: this.wmsParams.layers,
      info_format: 'application/json',
      opacity: 0.7,
    }

    params[params.version === '1.3.0' ? 'i' : 'x'] = Math.round(point.x)
    params[params.version === '1.3.0' ? 'j' : 'y'] = Math.round(point.y)
    const newUrl = this._url + L.Util.getParamString(params, this._url, true)

    return newUrl
  },

  showGetFeatureInfo: function (err, content) {
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
      this.setMapPopup({
        [`${this.actual}`]: properties,
      })
    }
  },
})

export const callBetterWMS = (url, params, setMapPopup, actual) => {
  // @ts-ignore
  const layer = new BetterWMS(url, params, setMapPopup, actual)
  return layer
}
