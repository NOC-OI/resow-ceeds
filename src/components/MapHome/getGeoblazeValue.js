import geoblaze from 'geoblaze';

export class GetGeoblazeValue {
  constructor (georaster, latlng) {
    this.georaster = georaster
    this.latlng = latlng
    this.dep = null
  }

  async getGeoblaze() {
    this.dep = geoblaze.identify(this.georaster, [this.latlng.lng, this.latlng.lat])
  };
}
