import 'leaflet/dist/leaflet';

export class GetPhotoMarker {
  constructor (layerName, actualLayer) {
    this.layerName = layerName
    this.actualLayer = actualLayer
    this.layer = null
    this.popupText = ''
  }
  async getMarker() {
    this.icon = L.icon({
      iconUrl: '/marker-icon.png',
      shadowUrl: '/marker-shadow.png',
    });
    this.layer = L.marker([this.layerName.Latitude, this.layerName.Longitude],
      {
        riseOnHover: true,
        autoPanOnFocus: false,
        icon: this.icon
      }
    )
    this.popupText = `
      <b>${this.actualLayer[0]}</b><br>
      IMAGE ID: <em>${this.layerName.id}</em><br>
      AREA OF SURVEY: <em>${this.layerName.Area_seabed_m2.toFixed(2)}m²</em><br>
      HABITAT: <em>${this.layerName.Habitat}</em><br>
      SUBSTRATE: <em>${this.layerName.Substratum}</em><br>
      CEDA: XXXXXXXX<br>
      TILE NUMBER: <em>10</em><br>
      iFDO SUMMARY: <em>XXXX</em><br>
    `
    this.layer.options.attribution = this.actualLayer[0]
    this.layer.options.FileName = this.layerName.FileName
    this.layer.options.dataType = 'marker'
  }
}
