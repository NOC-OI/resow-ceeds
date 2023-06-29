import axios from 'axios'
import haversine from 'haversine'

export class GetTitilerData {
  constructor(graphData, url) {
    this.graphData = graphData
    this.url = url
    this.dataGraph = { distance: [], value: [] }
    this.dataGraph = []
  }

  async fetchData() {
    const TILE_SERVER_URL = import.meta.env.VITE_TILE_SERVER_URL

    function linspace(start, stop, num, endpoint = true) {
      const div = endpoint ? num - 1 : num
      const step = (stop - start) / div
      return Array.from({ length: num }, (_, i) => start + step * i)
    }
    const latitudes = linspace(this.graphData[0].lat, this.graphData[1].lat, 20)
    const longitudes = linspace(
      this.graphData[0].lng,
      this.graphData[1].lng,
      20,
    )
    const latLngIni = { latitude: latitudes[0], longitude: longitudes[0] }
    latitudes.forEach(async (lat, idx) => {
      const distance = haversine(
        latLngIni,
        { latitude: latitudes[idx], longitude: longitudes[idx] },
        { unit: 'km' },
      )

      const newUrl = `${TILE_SERVER_URL}cog/point/${longitudes[idx]},${
        latitudes[idx]
      }?url=${encodeURIComponent(this.url)}`
      await axios.get(newUrl).then(async (r) => {
        this.dataGraph.push({
          x: distance,
          y: r.data.values[0],
        })
      })
    })
  }
}