import $ from 'jquery'
import * as L from 'leaflet'

const BetterWMS = L.TileLayer.WMS.extend({
  onAdd: function (map) {
    // Triggered when the layer is added to a map.
    //   Register a click listener, then do all the upstream WMS things
    L.TileLayer.WMS.prototype.onAdd.call(this, map)
    map.on('click', this.getFeatureInfo, this)
  },

  onRemove: function (map) {
    // Triggered when the layer is removed from a map.
    //   Unregister a click listener, then do all the upstream WMS things
    L.TileLayer.WMS.prototype.onRemove.call(this, map)
    map.off('click', this.getFeatureInfo, this)
  },

  getFeatureInfo: function (evt) {
    // Make an AJAX request to the server and hope for the best
    const url = this.getFeatureInfoUrl(evt.latlng)
    const showResults = L.Util.bind(this.showGetFeatureInfo, this)

    $.ajax({
      url,
      success: function (data, status, xhr) {
        const err = typeof data === 'string' ? null : data
        showResults(err, evt.latlng, data)
      },
      error: function (xhr, status, error) {
        showResults(error)
      },
    })
  },

  getFeatureInfoUrl: function (latlng) {
    // Construct a GetFeatureInfo request URL given a point
    // console.log(this._map.project(this._map.getBounds()._northEast))
    // this._map.getBounds()
    const point = this._map.latLngToContainerPoint(latlng, this._map.getZoom())
    const size = this._map.getSize()
    const crs = L.CRS.EPSG3857
    // these are the SouthWest and NorthEast points
    // projected from LatLng into used crs
    const sw = crs.project(this._map.getBounds().getSouthWest())
    const ne = crs.project(this._map.getBounds().getNorthEast())

    const params = {
      request: 'GetFeatureInfo',
      service: 'WMS',
      crs: 'EPSG:3857',
      styles: this.wmsParams.styles,
      transparent: this.wmsParams.transparent,
      version: this.wmsParams.version,
      format: this.wmsParams.format,
      bbox: sw.x + ',' + sw.y + ',' + ne.x + ',' + ne.y,
      // bbox: this._map.getBounds().toBBoxString(),
      height: size.y,
      width: size.x,
      layers: this.wmsParams.layers,
      query_layers: this.wmsParams.layers,
      info_format: 'text/html',
    }

    params[params.version === '1.3.0' ? 'i' : 'x'] = Math.round(point.x)
    params[params.version === '1.3.0' ? 'j' : 'y'] = Math.round(point.y)
    const newUrl = this._url + L.Util.getParamString(params, this._url, true)

    return newUrl
  },

  showGetFeatureInfo: function (err, latlng, content) {
    if (err) {
      return
    } // do nothing if there's an error

    // Otherwise show the content in a popup, or something.
    let verifyContent = content.split('body')[1]
    verifyContent = verifyContent.replace(/(\r|\n|\s|>|<)/g, '')
    // verifyContent = verifyContent.replace(/\n/g, '')
    // verifyContent = verifyContent.replace(/\s/g, '')
    // verifyContent = verifyContent.replace('<', '')
    // verifyContent = verifyContent.replace('>', '')
    verifyContent = verifyContent.replace('/', '')
    let newContent = content
    if (!verifyContent) {
      newContent = 'No data available'
    }
    L.popup({ maxWidth: 200 })
      .setLatLng(latlng)
      .setContent(newContent)
      .openOn(this._map)
  },
})

export const callBetterWMS = (url, params) => {
  const layer = new BetterWMS(url, params)
  return layer
}

// https://emodnet.ec.europa.eu/geoviewer/proxy//https://ows.emodnet-seabedhabitats.eu/geoserver/emodnet_view/wms?
// &SERVICE=WMS
// &VERSION=1.3.0
// &REQUEST=GetFeatureInfo
// &TRANSPARENT=true
// &QUERY_LAYERS=eusm2021_eunis2019_group
// &LAYERS=eusm2021_eunis2019_group
// &STYLES=
// &viewParams=null%3Bundefined
// &TIME=
// &INFO_FORMAT=text%2Fhtml
// &feature_count=26
// &I=175
// &J=39
// &WIDTH=256
// &HEIGHT=256
// &CRS=EPSG%3A4326
// &BBOX=0%2C-45%2C45%2C0

// https://emodnet.ec.europa.eu/geoviewer/proxy//https://ows.emodnet-seabedhabitats.eu/geoserver/emodnet_view/wms?
// &SERVICE=WMS
// &VERSION=1.3.0
// &REQUEST=GetFeatureInfo
// &CRS=EPSG:4326
// &LAYERS=eusm2021_eunis2019_group
// &QUERY_LAYERS=eusm2021_eunis2019_group
// &STYLES=
// &TRANSPARENT=true
// &FORMAT=image/png
// &BBOX=-13.095703125,47.234489635299184,0.9667968750000001,49.1888842152458
// &HEIGHT=267
// &WIDTH=1280
// &INFO_FORMAT=text/html
// &I=630
// &J=147

// https://emodnet.ec.europa.eu/geoviewer/proxy//https://ows.emodnet-seabedhabitats.eu/geoserver/emodnet_view/wms?&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetFeatureInfo&TRANSPARENT=true&QUERY_LAYERS=eusm2021_eunis2019_group&LAYERS=eusm2021_eunis2019_group&STYLES=&viewParams=null%3Bundefined&TIME=&INFO_FORMAT=text%2Fhtml&feature_count=26&I=175&J=39&WIDTH=256&HEIGHT=256&CRS=EPSG%3A4326
