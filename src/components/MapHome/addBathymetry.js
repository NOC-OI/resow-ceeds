import * as WMS from 'leaflet.wms';

const MySource =  WMS.Source.extend ({
  'getEvents': function() {
    if (this.options.identify) {
        return {'click': this.identify};
    } else {
        return {};
    }
  }
});

export class GetBathymetryLayer {
  constructor () {
    this.layer = null
  }

  async getLayer() {
    const self = this
    const source = await new MySource(
      "https://ows.terrestris.de/osm/service",
      {
        "format": "image/png",
        "transparent": "true",
        "opacity": '0',
        "info_format": "text/html"
      }
    );
    this.layer=source.getLayer('TOPO-WMS')
  }
}
