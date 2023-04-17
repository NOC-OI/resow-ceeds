import 'leaflet/dist/leaflet';
import 'leaflet-draw'

export class AddLeafletDraw {
  constructor (map) {
    this.drawControl = null
    this.map = map
  }

  add() {
    var drawLayer = new L.Draw.Rectangle(this.map)
    // var drawnItems = new L.FeatureGroup();
    // this.map.addLayer(drawnItems);

    // this.drawControl = new L.Control.Draw({
    //     edit: {
    //         featureGroup: drawnItems
    //     },
    //     position: 'topright',

    // });
    // this.map.addControl(this.drawControl);

  };
}



export class DrawPolygon {
  constructor (map) {
    this.map = map
    this.polygon = null
  }

  add() {
    this.polygon = L.polygon([
      new L.LatLng(53, -17),
      new L.LatLng(53, 2),
      new L.LatLng(40, 2),
      new L.LatLng(40, -17),
      ],
    ).addTo(this.map);

    // this.polygon.transform.enable();
    // // or partially:
    // this.polygon.transform.enable({rotation: true, scaling: false});
    // // or, on an already enabled handler:
    // this.polygon.transform.setOptions({rotation: true, scaling: false});
  };
}
