import 'leaflet/dist/leaflet';
import 'leaflet-draw'

export class AddLeafletDraw {
  constructor (featureGroup) {
    this.featureGroup = featureGroup
    this.drawControl = null
  }

  add() {
    this.drawControl = new L.Control.Draw({
        edit: {
            featureGroup: this.featureGroup
        }
    });
  };
}
