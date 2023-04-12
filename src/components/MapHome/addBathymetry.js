import * as WMS from 'leaflet.wms';

const MySource =  WMS.Source.extend ({
  'getEvents': function() {
    if (this.options.identify) {
      return {'click': this.identify};
    } else {
        return {};
    }
  },
  'getFeatureInfo': function(point, latlng, layers, callback) {
    // Request WMS GetFeatureInfo and call callback with results
    // (split from identify() to faciliate use outside of map events)
    var params = this.getFeatureInfoParams(point, layers),
        url = this._url + L.Util.getParamString(params, this._url);


    this.showWaiting();
    this.ajax(url, done);

    function done(result) {
        this.hideWaiting();
        var text = this.parseFeatureInfo(result, url);
        callback.call(this, latlng, text);
    }
  },

  'getFeatureInfoParams': function(point, layers) {
    // Hook to generate parameters for WMS service GetFeatureInfo request
    var wmsParams, overlay;

    if (this.options.untiled) {
        // Use existing overlay
        wmsParams = this._overlay.wmsParams;
    } else {
        // Create overlay instance to leverage updateWmsParams
        overlay = this.createOverlay(true);
        overlay.updateWmsParams(this._map);
        wmsParams = overlay.wmsParams;
        wmsParams.layers = layers.join(',');
    }
    wmsParams.feature_count = 25

    var infoParams = {
        'request': 'GetFeatureInfo',
        'query_layers': layers.join(','),
        'X': Math.round(point.x),
        'Y': Math.round(point.y)
    };
    return L.extend({}, wmsParams, infoParams);
},
});


export class GetBathymetryLayer {
  constructor (url="https://ows.terrestris.de/osm/service",
      params={
        "format": "image/png",
        "transparent": "true",
        "opacity": '0',
        "info_format": "text/html"
      },
      layer = 'TOPO-WMS') {
    this.layer = null
    this.url = url,
    this.layer = layer,
    this.params = params
  }

  async getLayer() {
    const self = this
    const source = await new MySource(
      this.url,
      this.params
    );
    this.layer=source.getLayer(this.layer)
  }
}
