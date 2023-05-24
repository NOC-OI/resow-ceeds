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

  async logJSONData() {
    await fetch(
      'https://haigfras-api.herokuapp.com/csv?filenames=HF2012_other_data,HF2012_annotation_summary&columns=active:False,local_data_type:Marker-COG,show:True',
    )
      .then((response) => response.json())
      .then((jsonData) => {
        this.data['Seabed Images'] = {
          layerNames: {
            2012: {
              data_type: 'Photo',
              photos: jsonData,
              content:
                'Output of the 2021 EUSeaMap broad-scale predictive model, produced by EMODnet Seabed Habitats. \n \
                                The extent of the mapped area includes the Mediterranean Sea, Black Sea, Baltic Sea, and areas of the North Eastern Atlantic extending from the Canary Islands in the south to the Barents Sea in the north. \n \
                                The map was produced using a "top-down" modelling approach using classified habitat descriptors to determine a final output habitat. \n \
                                Habitat descriptors differ per region but include: \n \
                                - Biological zone \n \
                                - Energy class \n \
                                - Oxygen regime \n \
                                - Salinity regime \n \
                                - Seabed substrate \n \
                                - Riverine input \n \
                                Habitat descriptors (excepting Substrate) are calculated using underlying physical data and thresholds derived from statistical analyses or expert judgement on known conditions. \n \
                                The model is produced using R and Arc Model Builder (10.1). \n \
                                The model was created using raster input layers with a cell size of 0.00104dd (roughly 100 metres). The model includes the sublittoral zone only; due to the high variability of the littoral zone, a lack of detailed substrate data and the resolution of the model, it is difficult to predict littoral habitats at this scale. \n \
                                EUSeaMap is classified into EUNIS 2019 level 3 (or more detailed levels where appropriate), EUNIS 2019 level 2 , EUNIS 2007-2011, the MSFD benthic broad habitat types, the HELCOM HUB classification in the Baltic, and the recently revised habitat classification in the Mediterranean. In the Black Sea, EUSeaMap is not classified into EUNIS 2007-2011 (due to inapplicability), but is classified according to a classification that was developed by EMODnet Seabed Habitats (Populus et a, 2017, and for a revised version Vasquez et al, 2020, See Online resources). \n \
                                Reports that provide methods used for the classification of the predicted habitats into the new 2019 EUNIS classification, regional classifications, and MSFD BBHT (v.2017) are linked in Online Resources. \n \
                                A report on the methods used in the 2021 version of EUSeaMap (Vasquez et al., 2021) and reports on previous versions (v2016 and V2019) are linked in Online Resources. \n ',
            },
          },
        }
        // this.sortedData = Object.keys(this.data)
        //   .sort()
        //   .reduce((objEntries, key) => {
        //     objEntries[key] = this.data[key]
        //     return objEntries
        //   })
      })
  }

  async loadCSV() {
    await this.logJSONData()
  }
}
