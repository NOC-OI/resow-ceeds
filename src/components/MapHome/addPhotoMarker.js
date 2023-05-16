import 'leaflet/dist/leaflet';

export class GetPhotoMarker {
  constructor (layerName, actualLayer) {
    this.layerName = layerName
    this.actualLayer = actualLayer
    this.layer = null
    this.popupText = ''
  }
  async getMarker() {
    const icon = L.icon({
      iconUrl: '/marker-icon.png',
      // shadowUrl: '/marker-shadow.png',
      iconSize: [27, 45]
    });
    this.layer = L.marker([this.layerName.Latitude, this.layerName.Longitude],
      {
        riseOnHover: true,
        autoPanOnFocus: false,
        icon: icon
      }
    )
    const organisms = ['antedon', 'anthozoa', 'anthozoa_01', 'anthozoa_03', 'anthozoa_05',
      'anthozoa_06', 'anthozoa_07', 'anthozoa_08', 'anthozoa_11', 'anthozoa_16',
      'anthozoa_19', 'anthozoa_24', 'anthozoa_34', 'anthozoa_39', 'asterias_rubens',
      'asteroid_01', 'asteroid_07', 'asteroidea', 'astropecten_irregularis',
      'axinellidae', 'bolocera', 'bryozoa_01', 'callionymus', 'caryophyllia_smithii',
      'cerianthid_01', 'cerianthid_03', 'echinoid_01', 'echinoidea', 'echinus_esculentus',
      'eledone_02', 'eledone_cirrhosa', 'fish', 'fish_10', 'flatfish', 'gadidae',
      'gadiforme_09', 'gaidropsarus_vulgaris', 'galeus', 'hippoglossoides_platessoides',
      'hydroid_01', 'inachidae_01', 'inachidae_02', 'INDETERMINATE', 'indeterminate_29',
      'indeterminate_36', 'lepidorhombus_whiffiagonis', 'leucoraja_naevus', 'liocarcinus',
      'lithodes_maja', 'luidia_ciliaris', 'luidia_sarsii', 'marthasterias_glacialis',
      'microchirus_variegatus', 'munida', 'ophiuroid_01', 'ophiuroid_02', 'paguridae_01',
      'paguridae_02', 'parazoanthus', 'pentapora_foliacea', 'porania_pulvillus',
      'porcellanidae', 'porella', 'porifera_02', 'porifera_03', 'porifera_20',
      'porifera_22', 'porifera_23', 'porifera_24', 'porifera_25', 'rajidae_01',
      'reteporella', 'salmacina_dysteri', 'scyliorhinus_canicula', 'squid',
      'stichastrella_rosea', 'urticina'
    ]
    let organismList = []
    organisms.forEach(organism => {
      if (this.layerName[organism] === 1){
        organismList.push(organism)
      }
    })

    this.popupText = `
      <b>${this.actualLayer[0]}</b><br>
      IMAGE ID: <em>${this.layerName.id}</em><br>
      AREA OF SURVEY: <em>${this.layerName.Area_seabed_m2.toFixed(2)}m²</em><br>
      HABITAT: <em>${this.layerName.Habitat}</em><br>
      SUBSTRATE: <em>${this.layerName.Substratum}</em><br>
      ANNOTATION: <em>${organismList.join(', ')}</em><br>
      <a 
        href='/photos/${this.actualLayer[0].replace(' ', '-')}_${this.layerName.id}'
        title='Show Image'
        target="_blank"
        style="display: flex; justify-content: center;"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
          <path fill-rule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clip-rule="evenodd" />
        </svg>
      </a>  
    `
    this.layer.options.attribution = this.actualLayer[0]
    this.layer.options.organismList = organismList
    this.layer.options.FileName = this.layerName.FileName
    this.layer.options.dataType = 'marker'
  }
}
