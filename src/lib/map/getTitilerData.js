import axios from 'axios'
import haversine from 'haversine'

export class GetTitilerData {
  constructor(graphData, url) {
    this.graphData = graphData
    this.url = url
    this.numberValues = 20
    this.dataGraph = {
      distance: Array(this.numberValues).fill(0),
      value: Array(this.numberValues).fill(0),
    }
  }

  async fetchData() {
    const TILE_SERVER_URL = process.env.VITE_TILE_SERVER_URL
    function linspace(start, stop, num, endpoint = true) {
      const div = endpoint ? num - 1 : num
      const step = (stop - start) / div
      return Array.from({ length: num }, (_, i) => start + step * i)
    }
    const latitudes = linspace(this.graphData[0].lat, this.graphData[1].lat, 20)
    const longitudes = linspace(
      this.graphData[0].lng,
      this.graphData[1].lng,
      this.numberValues,
    )
    this.dataGraph = { distance: [], value: [] }

    const latLngIni = { latitude: latitudes[0], longitude: longitudes[0] }
    await Promise.all(
      latitudes.map(async (lat, idx) => {
        const distance = haversine(
          latLngIni,
          { latitude: latitudes[idx], longitude: longitudes[idx] },
          { unit: 'km' },
        )

        if (typeof this.url === 'object') {
          let requestSucceeded = false
          this.dataGraph.distance[idx] = distance
          for (const url of this.url) {
            const newUrl = `${TILE_SERVER_URL}cog/point/${longitudes[idx]},${
              latitudes[idx]
            }?url=${encodeURIComponent(url)}`

            try {
              const response = await axios.get(newUrl)
              this.dataGraph.value[idx] = response.data.values[0]
              requestSucceeded = true
              break
            } catch (error) {}
          }
          if (!requestSucceeded) {
            this.dataGraph.value[idx] = -9999
          }
        } else {
          const newUrl = `${TILE_SERVER_URL}cog/point/${longitudes[idx]},${
            latitudes[idx]
          }?url=${encodeURIComponent(this.url)}`
          try {
            const response = await axios.get(newUrl)
            this.dataGraph.distance[idx] = distance
            this.dataGraph.value[idx] = response.data.values[0]
          } catch (error) {
            this.dataGraph.value[idx] = -9999
          }
        }
      }),
    )
  }
}

export class GetTitilerDataOneValue {
  constructor(lat, lon, url) {
    this.url = url
    this.lat = lat
    this.lon = lon
    this.dep = null
  }

  async fetchData() {
    const TILE_SERVER_URL = process.env.VITE_TILE_SERVER_URL

    const newUrl = this.layerName.signed_url
      ? this.layerName.signed_url
      : this.url
    const isUrlEncoded = !!this.layerName.signed_url

    const urlForFetch = `${TILE_SERVER_URL}cog/point/${this.lat},${
      this.lon
    }?url=${encodeURIComponent(newUrl)}&encoded=${isUrlEncoded}`
    await axios.get(urlForFetch).then(async (r) => {
      this.dep = r.data.values[0]
    })
  }
}
