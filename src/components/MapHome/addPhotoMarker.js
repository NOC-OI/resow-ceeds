import 'leaflet/dist/leaflet'
import * as L from 'leaflet'

export class GetPhotoMarker {
  constructor(layerName, actualLayer, color) {
    this.layerName = layerName
    this.actualLayer = actualLayer
    this.layer = null
    this.popupText = ''
    this.fileName = null
    this.color = color
  }

  async getMarker() {
    // const icon = L.icon({
    //   iconUrl: '/marker-icon.png',
    //   // shadowUrl: '/marker-shadow.png',
    //   iconSize: [20, 20],
    // })

    const icon = L.divIcon({
      html: `<div class='all-icon'>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
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
    this.layer = L.marker([this.layerName.Latitude, this.layerName.Longitude], {
      riseOnHover: true,
      autoPanOnFocus: false,
      icon,
    })
    const organisms = [
      'Bryozoa_01',
      'Porifera_23',
      'Axinellidae_spp',
      'Porella sp.',
      'Parazoanthus sp.',
      'Anthozoa_34',
      'Anthozoa_39',
      'Lepidorhombus whiffiagonis',
      'Perciformes spp.10',
      'Gadidae spp.',
      'Paguridae_02',
      'Bolocera spp.',
      'Anthozoa_16',
      'Cerianthid_01',
      'Anthozoa_03',
      'Porifera_20',
      'Salamancina dysteri',
      'Munida sp.',
      'Echinus esculentus',
      'Reteporella spp.',
      'Stichastrrella rosea',
      'Antedon spp.',
      'Paguridae_01',
      'Liocarcinus spp.',
      'Hippoglossoides platessoides',
      'Ebalia',
      'Echinus acutus',
      'Edwardsiella carnea',
      'Euspira pulchella',
      'Galathea sp',
      'Gobiidae',
      'Goniodoris nodosa',
      'Halcampoides elongatus',
      'Harmothoe extenuata?',
      'Henricia',
      'Holothuroidea',
      'Hyas sp',
      'Hymedesmia paupertas',
      'Janolus cristatus',
      'Lanice conchilega',
      'Luidia sarsi',
      'Marthasterias glacialis',
      'Munida',
      'Munida rugosa',
      'Nassarius incrassatus',
      'Nemertesia sp',
      'Nereididae?',
      'Novocrania anomala',
      'Omalesecosa ramulosa',
      'Ophiocomina nigra',
      'Ophiothrix fragilis',
      'Ophiura sp',
      'Ophiuroidea',
      'Osmerus eperlonus',
      'Paguridae',
      'Pagurus prideaux',
      'Palliolum tigerinum',
      'Parazoanthus anguicomus',
      'Pecten maximus',
      'Phynorhombus norvegicus?',
      'Plumulariidae',
      'Pollachius pollachius?',
      'Polymastia',
      'Polymastia boletiformis',
      'Polymastia penicillus',
      'Porania pulvillus',
      'Porifera',
      'Porifera #1',
      'Porifera #4',
      'Psammechinus miliaris',
      'Reteporella',
      'Salmacina dysteri',
      'Solea solea',
      'Spatangoida',
      'Triglidae',
      'Trisopterus luscus',
      'Tubulariidae',
      'Urticina eques',
      'Urticina felina',
      'Urticina?',
    ]
    const organismList = []
    organisms.forEach((organism) => {
      if (this.layerName[organism] === 1) {
        organismList.push(organism)
      }
    })

    this.popupText = `
      <b>${this.actualLayer}</b><br>
      IMAGE NAME: <em>${this.layerName.filename}</em><br>
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
      ANNOTATION: <em>${organismList.join(', ')}</em><br>
      <a 
        href='/photos/${this.actualLayer.replace(' ', '-')}_${
      this.layerName.id
    }'
        title='Show Image'
        target="_blank"
        style="display: flex; justify-content: center;"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
          <path fill-rule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clip-rule="evenodd" />
        </svg>
      </a>  
    `
    this.layer.options.attribution = this.actualLayer
    this.layer.options.organismList = organismList
    this.layer.options.filename = this.layerName.filename
    this.layer.options.layerName = this.layerName
    this.layer.options.popupText = this.popupText
    this.layer.options.color = this.color
    this.fileName = this.layerName.filename
    this.layer.options.dataType = 'marker'
  }
}
