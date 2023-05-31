/* eslint-disable no-multi-str */
import { listLayers } from './listLayers'

export class GetLayers {
  constructor() {
    this.data = listLayers
    this.sortedData = null
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

  async logJSONData(url) {
    await url.forEach(async (data) => {
      await fetch(
        `https://haigfras-api.herokuapp.com/csv?filenames=${data.files}&columns=active:False,local_data_type:Marker-COG,show:True`,
      )
        .then((response) => response.json())
        .then((jsonData) => {
          this.data['Seabed Images'].layerNames[data.name] = {
            data_type: 'Photo',
            photos: jsonData,
            content:
              'Output of the 2021 EUSeaMap broad-scale predictive model, produced by EMODnet Seabed Habitats',
          }
          this.data['Seabed Images - Limits'].layerNames[data.name] = {
            data_type: 'Photo-Limits',
            photos: jsonData,
            content: '',
          }
        })
    })
  }

  async loadCSV() {
    await this.logJSONData([
      {
        name: 'AUV 2012_OLD',
        files: 'output:HF2012_other_data,output:HF2012_annotation_summary',
      },
      {
        name: 'AUV 2012',
        files: 'output:HF2012_alltile_otherdata,output:HF2012_alltile_counts',
      },
      {
        name: 'JNCC 0513',
        files: 'jncc:JNCC_CEND0513_otherdata,jncc:JNCC_CEND0513_counts',
      },
      {
        name: 'JNCC 1012',
        files: 'jncc:JNCC_CEND1012_otherdata',
      },
    ])
  }
}
