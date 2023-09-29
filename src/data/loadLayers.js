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

  async loadJsonLayers() {
    let url
    if (this.rout === '/3d') {
      url = process.env.VITE_LAYERS3D_JSON_URL
    } else {
      url = process.env.VITE_LAYERS_JSON_URL
    }

    await axios.get(url).then(async (resp) => {
      this.data = resp.data
      // if (this.token) {
      //   await this.logSignedUrl()
      // }
    })
  }
}
