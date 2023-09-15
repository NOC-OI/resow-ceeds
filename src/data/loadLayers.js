/* eslint-disable no-multi-str */
// import { listLayers } from './listLayers'
import axios from 'axios'

export class GetLayers {
  constructor(isLogged, rout) {
    this.data = {}
    this.rout = rout
    this.sortedData = null
    this.token = isLogged
  }

  sortListLayers() {
    const sortedList = []
    this.data.forEach((listLayer) => {
      sortedList.push(listLayer.layerClass)
    })
    sortedList.sort()
    const newSortedList = []
    sortedList.forEach((sorted) => {
      this.data.forEach((listLayer) => {
        if (sorted === listLayer.layerClass) {
          newSortedList.push(listLayer)
        }
      })
    })
    return newSortedList
  }

  async logSignedUrl() {
    const APIBaseUrl = process.env.VITE_API_URL
    await fetch(`${APIBaseUrl}v1/user/aws?token=${this.token}`)
      .then(async (response) => await response.json())
      .then(async (jsonData) => {
        Object.keys(jsonData).forEach((layerClass) => {
          Object.keys(jsonData[layerClass]).forEach((layerType) => {
            this.data[layerClass].layerNames[layerType].signed_url =
              jsonData[layerClass][layerType].signed_url
          })
        })
      })
  }

  async logJSONData(url) {
    const APIBaseUrl = process.env.VITE_API_URL

    await url.forEach(async (data) => {
      await fetch(
        `${APIBaseUrl}v1/data/csv?filenames=${data.files}&columns=active:False,local_data_type:${data.layerType},show:True`,
      )
        .then((response) => response.json())
        .then((jsonData) => {
          this.data[data.layerClass].layerNames[data.name] = {
            data_type: 'Photo',
            photos: jsonData,
            content: data.content,
            files: data.files,
            imageExtension: data.imageExtension,
          }
        })
    })
    if (this.token) {
      await this.logSignedUrl()
    }
  }

  async loadCSV() {
    let url
    if (this.rout === '/3d') {
      url = process.env.VITE_LAYERS3D_JSON_URL
    } else {
      url = process.env.VITE_LAYERS_JSON_URL
    }

    await axios.get(url).then(async (resp) => {
      this.data = resp.data
      if (this.rout !== '/3d1') {
        await this.logJSONData([
          {
            layerClass: 'Seabed Images',
            layerType: 'Marker-COG',
            name: '2012 AUV Image Survey',
            imageExtension: 'jpg',
            files:
              'layers:seabed_images:hf2012:HF2012_alltile_otherdata,layers:seabed_images:hf2012:HF2012_alltile_counts',
            content:
              'Haig Fras 2012 autonomous underwater vehicle image survey - mosaicked tiles used for \
              quantifying benthic community. \n \
              The aim of the survey was to undertake high-resolution mapping and colour photography \
              over in a recommended Marine Conservation Zone (rMCZ), in order to highlight the\
              capability of AUV technology for high-resolution shallow-water mapping and benthic\
              species identification. \n \
              Haig Fras is an isolated, bedrock outcrop some 90 km north west of the Isles of Scilly.\
              It is thought to be the only substantial area of rocky reef in the Celtic Sea beyond \
              the coastal margin. The rock outcrop is the focus of both a Special Area of Conservation \
              and a recommended Marine Conservation Zone. The specific location of the Autosub6000 \
              mission was chosen to correspond with an area of ship-based seabed survey carried out \
              from the RV Cefas Endeavour just prior to the arrival of RRS Discovery cruise 377/8. \n \
              This photographic survey was the first in a series of surveys conducted in the same \
              location with a camera mounted on an autonomous underwater vehicle, conducted when \
              the Greater Haig Fras area was under consideration for MCZ status. Defra-funded project \
              "Investigating the feasibility of utilizing AUV and Glider technology for mapping and \
              monitoring of the UK MPA network (MB0118)", Case study 2: Shallow-water AUV mapping \
              off SW UK; Cruise report: Ruhl, H., scientists, 2013. RRS Discovery Cruise 377 & 378, \
              05-27 July 2012. Autonomous ecological surveying of the abyss: understanding mesoscale \
              spatial heterogeneity at the Porcupine Abyssal Plain.  (p. 73). Southampton, UK: National \
              Oceanography Centre, Southampton. \n \
              Images were mosaicked in "tiles" consisting of 5 consecutive images (or c. 7.3 m2 of seabed \
              at c. 3.2 m altitude observation). Images were orthorectified and scaled to a common \
              altitude per tile. The average dimension of a pixel was 0.59 mm. Further details of \
              the mosaicking process are detailed in: Morris, K.J., Bett, B.J., Durden, J.M., \
              Huvenne, V.A.I., Milligan, R., Jones, D.O.B., McPhail, S., Robert, K., Bailey, D., \
              Ruhl, H.A., 2014. A new method for ecological surveying of the abyss using autonomous \
              underwater vehicle photography. Limnology and Oceanography: Methods, 12, 795-809. \
              10.4319/lom.2014.12.795 \n \
              **Total number of tiles:** 2637 \n\
              **Total area of survey:** 19223 m$^2$ \n \
              **Number of individuals:** XXXXX \n \
              [CEDA Link](https://www.ceda.ac.uk/)',
          },
          {
            layerClass: 'Seabed Images',
            layerType: 'Marker-COG',
            name: 'JNCC CEND1012 Survey',
            files: 'layers:seabed_images:jncc:JNCC_CEND1012_otherdata',
            content: 'JNCC Offshore Survey Benthic Images CEND1012',
            imageExtension: 'JPG',
          },
          {
            layerClass: 'Seabed Images',
            layerType: 'Marker',
            name: 'NBN',
            files: 'layers:seabed_images:nbn:nbn',
            content: 'NBN data',
            imageExtension: '',
          },
        ])
      }
    })
  }
}
