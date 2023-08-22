import 'leaflet/dist/leaflet'
import * as L from 'leaflet'
import { organisms } from '../../data/organisms'
import { Entity, Cartesian3 } from 'cesium'

export class GetPhotoMarker {
  constructor(layerName, actualLayer, color) {
    this.layerName = layerName
    this.actualLayer = actualLayer
    this.layer = null
    this.popupText = ''
    this.fileName = null
    this.color = color
  }

  createPopup() {
    const JOSBaseUrl = process.env.VITE_JASMIN_OBJECT_STORE_URL

    let imageUrl = ''
    if (this.layerName.imageUrl) {
      imageUrl = this.layerName.imageUrl
    } else {
      imageUrl = `${JOSBaseUrl}haig-fras/output/${this.layerName.filename}.jpg`
    }

    this.popupText = `
    <b>${this.actualLayer}</b><br>
    ${
      this.layerName.imageUrl
        ? `SCIENTIFIC NAME: <em>${this.layerName['Scientific name']}</em><br>`
        : `IMAGE NAME: <em>${this.layerName.filename}</em><br>`
    }
    ${
      this.layerName.Area_seabed_m2
        ? `AREA OF SURVEY: <em>${this.layerName.Area_seabed_m2.toFixed(
            2,
          )}m²</em><br>`
        : ''
    }
    ${
      this.layerName.Habitat
        ? `HABITAT: <em>${this.layerName.Habitat}</em><br>`
        : ''
    }
    ${
      this.layerName['EUNIS.Habitat']
        ? `HABITAT: <em>${this.layerName['EUNIS.Habitat']}</em><br>`
        : ''
    }
    ${
      this.layerName.UKMarineHabitat
        ? `UK Marine HABITAT: <em>${this.layerName.UKMarineHabitat}</em><br>`
        : ''
    }
    ${
      this.layerName.Substratum
        ? `Substratum: <em>${this.layerName.Substratum}</em><br>`
        : ''
    }
    ${
      this.layerName.Caption
        ? `Caption: <em>${this.layerName.Caption}</em><br>`
        : ''
    }
    <a href='${imageUrl}' title='Show Image'
        target="_blank"
        style="display: flex; justify-content: center;"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
          <path fill-rule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clip-rule="evenodd" />
        </svg>
    </a>
    `
  }

  async getMarker() {
    this.layer = {}
    const icon = L.divIcon({
      html: `<div class='all-icon'>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="15"
          height="15"
          viewBox="0 0 50 50"
        >
          <circle
            cx="25"
            cy="25"
            r="24"
            stroke="black"
            fill="${this.color}"
          />
        </svg>
      </div>`,
      iconSize: [0, 0],
      iconAnchor: [0, 0],
    })
    this.layer = L.marker([this.layerName.latitude, this.layerName.longitude], {
      riseOnHover: true,
      autoPanOnFocus: false,
      icon,
    })

    const organismList = []
    organisms.forEach((organism) => {
      if (this.layerName[organism] === 1) {
        organismList.push(organism)
      }
    })

    this.popupText = this.createPopup()

    //   ANNOTATION: <em>${organismList.join(', ')}</em><br>

    this.layer.options.attribution = this.actualLayer
    this.layer.options.organismList = organismList
    this.layer.options.filename = this.layerName.filename
    this.layer.options.layerName = this.layerName
    this.layer.options.popupText = this.popupText
    this.layer.options.color = this.color
    this.fileName = this.layerName.filename
    this.layer.options.dataType = 'marker'
  }

  async getMarker3D() {
    // const aRgbHex = this.color.match(/.{1,2}/g)
    // const aRgb = [
    //   parseInt(aRgbHex[0], 16),
    //   parseInt(aRgbHex[1], 16),
    //   parseInt(aRgbHex[2], 16),
    // ]
    const position = Cartesian3.fromDegrees(
      this.layerName.longitude,
      this.layerName.latitude,
    )
    const pointGraphics = { pixelSize: 10, color: this.color }
    this.layer = new Entity({
      position,
      point: pointGraphics,
      id: this.layerName.filename,
      description: this.popupText,
      attribution: this.actualLayer,
      name: this.actualLayer,
    })
  }
}
