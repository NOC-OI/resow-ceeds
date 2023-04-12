import 'leaflet/dist/leaflet';
import geoblaze from 'geoblaze';

export class GetGeoblazeValue {
  constructor (georaster) {
    this.georaster = georaster
    this.dep = null
  }

  async getGeoblaze() {
    this.dep = geoblaze.identify(getTifLayer.georaster, [latlng.lng, latlng.lat])
  };
}
