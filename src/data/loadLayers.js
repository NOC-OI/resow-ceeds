import axios from 'axios'

export class GetLayers {
  constructor(rout) {
    this.data = {}
    this.rout = rout
    this.sortedData = null
    this.protectedAssets = {}
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

  async loadJsonLayers() {
    let url
    if (this.rout === '/3d') {
      url = process.env.VITE_LAYERS3D_JSON_URL
    } else {
      url = process.env.VITE_LAYERS_JSON_URL
    }
    await axios.get(url).then(async (resp) => {
      this.data = await resp.data
      Object.keys(this.data).forEach((layerClass) => {
        Object.keys(this.data[layerClass].layerNames).forEach((layerName) => {
          if (this.data[layerClass].layerNames[layerName].protected) {
            if (!this.protectedAssets[layerClass]) {
              this.protectedAssets[layerClass] = {}
            }
            this.protectedAssets[layerClass][layerName] = {
              url: this.data[layerClass].layerNames[layerName].url
                .split('/')
                .slice(4)
                .join('/'),
            }
          }
        })
      })
    })
  }
}
