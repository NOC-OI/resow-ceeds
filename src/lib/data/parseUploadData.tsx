import parseGeoraster from 'georaster'
import {
  TILE_SERVER_URL,
  calculateColorsForLegend,
  defaultOpacity,
  reprojectData,
  reprojectGeoJSON,
} from '../map/utils'
import JSZip from 'jszip'
import * as toGeoJSON from '@mapbox/togeojson'
import * as shapefile from 'shapefile'
import { handleClickLegend } from '../../components/DataExplorationTypeOptions'
import axios from 'axios'
import Papa from 'papaparse'

export class LayerParser {
  localUploadInfo: any
  actualLayerUpload: any
  setActualLayerUpload: any
  setLayerLegend: any
  colorScale: any
  wmsSelectedLayer: any
  selectedStyle: any
  layers: any
  listLayersUpload: any
  csvData: any

  constructor(
    localUploadInfo,
    actualLayerUpload,
    setActualLayerUpload,
    setLayerLegend,
    colorScale,
    wmsSelectedLayer,
    selectedStyle,
    layers,
    listLayersUpload,
    csvData,
  ) {
    this.localUploadInfo = localUploadInfo
    this.actualLayerUpload = actualLayerUpload
    this.setActualLayerUpload = setActualLayerUpload
    this.setLayerLegend = setLayerLegend
    this.colorScale = colorScale
    this.wmsSelectedLayer = wmsSelectedLayer
    this.selectedStyle = selectedStyle
    this.layers = layers
    this.listLayersUpload = listLayersUpload
    this.csvData = csvData
  }

  parseAscFile() {
    const reader = new FileReader()
    reader.onload = async (e) => {
      const content = e.target.result.toString()
      const lines = content.split('\n')
      const metadata: any = {}
      const values = []
      let parsingData = false
      let yllCorner
      let nRows
      lines.forEach((line) => {
        const parts = line.trim().split(/\s+/)
        if (!parsingData) {
          switch (parts[0].toLowerCase()) {
            case 'nrows':
              nRows = parseInt(parts[1], 10)
              break
            case 'ncols':
              metadata.nCols = parseInt(parts[1], 10)
              break
            case 'xllcorner':
              metadata.xmin = parseFloat(parts[1])
              break
            case 'yllcorner':
              yllCorner = parseFloat(parts[1])
              break
            case 'cellsize':
              metadata.pixelWidth = parseFloat(parts[1])
              metadata.pixelHeight = parseFloat(parts[1])
              break
            case 'nodata_value':
              metadata.noDataValue = parseFloat(parts[1])
              break
            default:
              if (parts.length === metadata.nCols) {
                parsingData = true
                const row = parts.map(Number)
                values.push(row)
              }
              break
          }
        } else {
          const row = parts.map(Number)
          values.push(row)
        }
      })
      metadata.projection = 4326
      metadata.ymax = yllCorner + nRows * metadata.pixelWidth
      const georaster = await parseGeoraster([values], metadata)
      const scale = [georaster.mins[0], georaster.maxs[0]]

      const finalActualLayerUpload = {
        dataType: this.actualLayerUpload.dataType,
        name: this.localUploadInfo.file.name,
        data: georaster,
        colors:
          this.colorScale === 'Custom'
            ? this.actualLayerUpload.colors
            : this.colorScale,
        scale,
        opacity: defaultOpacity,
        bbox: [georaster.xmin, georaster.ymin, georaster.xmax, georaster.ymax],
      }

      const { listColors, listColorsValues } = calculateColorsForLegend(
        finalActualLayerUpload.colors,
        scale,
        30,
        typeof finalActualLayerUpload.colors !== 'string',
      )

      this.setActualLayerUpload(finalActualLayerUpload)
      this.setLayerLegend((layerLegend) => {
        const newLayerLegend = { ...layerLegend }
        delete newLayerLegend[this.localUploadInfo.file.name]
        newLayerLegend[this.localUploadInfo.file.name] = {
          layerName: this.localUploadInfo.file.name,
          layerInfo: finalActualLayerUpload,
          selectedLayersKey: `uploaded_${this.localUploadInfo.file.name}`,
          scale,
          dataDescription: '',
          legend: [listColors, listColorsValues],
          dataType: finalActualLayerUpload.dataType,
        }
        return newLayerLegend
      })
    }
    reader.readAsText(this.localUploadInfo.file)
  }

  parseGeoTIFF() {
    parseGeoraster(this.localUploadInfo.file).then((georaster) => {
      const scale = [georaster.mins[0], georaster.maxs[0]]
      const finalActualLayerUpload = {
        dataType: this.actualLayerUpload.dataType,
        name: this.localUploadInfo.file.name,
        data: georaster,
        colors:
          this.colorScale === 'Custom'
            ? this.actualLayerUpload.colors
            : this.colorScale,
        scale,
        opacity: defaultOpacity,
        bbox: [georaster.xmin, georaster.ymin, georaster.xmax, georaster.ymax],
      }

      this.setActualLayerUpload(finalActualLayerUpload)
      const { listColors, listColorsValues } = calculateColorsForLegend(
        finalActualLayerUpload.colors,
        scale,
        30,
        typeof finalActualLayerUpload.colors !== 'string',
      )

      this.setLayerLegend((layerLegend) => {
        const newLayerLegend = { ...layerLegend }
        delete newLayerLegend[this.localUploadInfo.file.name]
        newLayerLegend[this.localUploadInfo.file.name] = {
          layerName: this.localUploadInfo.file.name,
          layerInfo: finalActualLayerUpload,
          selectedLayersKey: `uploaded_${this.localUploadInfo.file.name}`,
          scale,
          dataDescription: '',
          legend: [listColors, listColorsValues],
          dataType: finalActualLayerUpload.dataType,
        }
        return newLayerLegend
      })
    })
  }

  parseGeoJSON() {
    const reader = new FileReader()
    reader.onload = async (e) => {
      const data = JSON.parse(e.target.result.toString())
      const reprojectedData = reprojectGeoJSON(data)
      this.handleGeoJSONDataOnLayerListAndLegend(reprojectedData)
    }
    reader.readAsText(this.localUploadInfo.file)
  }

  parseKMZ() {
    const reader = new FileReader()
    reader.onload = async (e) => {
      const content = e.target.result
      const zip = await JSZip.loadAsync(content as ArrayBuffer)
      const kmlFile = Object.keys(zip.files).find((name) =>
        name.endsWith('.kml'),
      )
      const kmlText = await zip.files[kmlFile].async('string')
      const kmlDom = new DOMParser().parseFromString(kmlText, 'text/xml')
      const data = toGeoJSON.kml(kmlDom)
      this.handleGeoJSONDataOnLayerListAndLegend(data)
    }
    reader.readAsArrayBuffer(this.localUploadInfo.file)
  }

  parseKML() {
    const reader = new FileReader()
    reader.onload = async (e) => {
      const content = e.target.result.toString()
      const kmlDom = new DOMParser().parseFromString(content, 'text/xml')
      const data = toGeoJSON.kml(kmlDom)
      this.handleGeoJSONDataOnLayerListAndLegend(data)
    }
    reader.readAsText(this.localUploadInfo.file)
  }

  parseShapefile() {
    const reader = new FileReader()
    reader.onload = async () => {
      const data = await shapefile.read(reader.result)
      const reprojectedData = reprojectData(
        data,
        this.localUploadInfo.proj,
        'EPSG:4326',
      )
      this.handleGeoJSONDataOnLayerListAndLegend(reprojectedData)
    }
    reader.readAsArrayBuffer(this.localUploadInfo.file)
  }

  parseWMS() {
    const newActualLayerUpload = {
      dataType: this.actualLayerUpload.dataType,
      name: `${this.wmsSelectedLayer}-${this.selectedStyle}`,
      url: this.localUploadInfo.url,
      data: this.wmsSelectedLayer,
      colors: this.selectedStyle,
      bbox: this.layers[this.wmsSelectedLayer].bbox,
    }
    this.setActualLayerUpload(newActualLayerUpload)
    const newListLayersUpload = { ...this.listLayersUpload }
    newListLayersUpload[`${this.wmsSelectedLayer}-${this.selectedStyle}`] = {
      ...newActualLayerUpload,
      params: {
        layers: newActualLayerUpload.data,
        styles: newActualLayerUpload.colors,
        request: '',
      },
    }
    handleClickLegend(
      newListLayersUpload,
      `${this.wmsSelectedLayer}-${this.selectedStyle}`,
      this.setLayerLegend,
      'uploaded',
    )
  }

  async parseCOG() {
    const cogInfo = await this.getCOGInfo(this.localUploadInfo)
    const nameOfLayer = this.localUploadInfo.url.split('/').pop()
    const finalName =
      nameOfLayer.length > 18 ? nameOfLayer.slice(0, 18) : nameOfLayer
    const newActualLayerUpload = {
      dataType: this.actualLayerUpload.dataType,
      name: finalName,
      data: this.localUploadInfo.url,
      colors: this.colorScale,
      bbox: cogInfo.bounds,
    }
    this.setActualLayerUpload(newActualLayerUpload)
    const newListLayersUpload = { ...this.listLayersUpload }
    newListLayersUpload[newActualLayerUpload.name] = {
      ...newActualLayerUpload,
      url: this.localUploadInfo.url,
    }
    handleClickLegend(
      newListLayersUpload,
      newActualLayerUpload.name,
      this.setLayerLegend,
      'uploaded',
    )
  }

  parseCSV() {
    const delimiterConvertion = { tab: '/t', space: ' ' }
    const delimiter = delimiterConvertion[this.csvData.delimiter]
      ? delimiterConvertion[this.csvData.delimiter]
      : this.csvData.delimiter
    Papa.parse(this.localUploadInfo.file, {
      complete: (results) => {
        const latColumn = this.csvData.header
          ? this.csvData.latLngColumnNames[0]
          : this.csvData.latLngColumnNumbers[0]
        const lngColumn = this.csvData.header
          ? this.csvData.latLngColumnNames[1]
          : this.csvData.latLngColumnNumbers[1]
        const geojsonFeatures = results.data
          .filter((row) => row[latColumn] && row[lngColumn])
          .map((row) => ({
            type: 'Feature',
            properties: this.csvData.header ? row : { properties: row },
            geometry: {
              type: 'Point',
              coordinates: [+row[lngColumn], +row[latColumn]],
            },
          }))

        const geojsonData = {
          type: 'FeatureCollection',
          features: geojsonFeatures,
        }
        this.handleGeoJSONDataOnLayerListAndLegend(geojsonData)
      },
      delimiter,
      header: this.csvData.header,
    })
  }

  handleGeoJSONDataOnLayerListAndLegend(data: any) {
    const newActualLayerUpload = {
      dataType: this.actualLayerUpload.dataType,
      name: this.localUploadInfo.file.name,
      data,
      colors: this.actualLayerUpload.colors[0],
    }
    this.setActualLayerUpload(newActualLayerUpload)
    const newListLayersUpload = { ...this.listLayersUpload }
    newListLayersUpload[`${this.localUploadInfo.file.name}`] = {
      ...newActualLayerUpload,
    }
    handleClickLegend(
      newListLayersUpload,
      `${this.localUploadInfo.file.name}`,
      this.setLayerLegend,
      'uploaded',
    )
  }

  async getCOGInfo(localUploadInfo) {
    const info = await axios.get(
      `${TILE_SERVER_URL}cog/info?url=${encodeURIComponent(
        localUploadInfo.url,
      )}&encoded=false`,
    )
    return info.data
  }

  async parse() {
    switch (this.actualLayerUpload.dataType.toLowerCase()) {
      case 'asc':
        this.parseAscFile()
        break
      case 'geotiff':
        this.parseGeoTIFF()
        break
      case 'geojson':
        this.parseGeoJSON()
        break
      case 'kmz':
        this.parseKMZ()
        break
      case 'kml':
        this.parseKML()
        break
      case 'shapefile':
        this.parseShapefile()
        break
      case 'wms':
        this.parseWMS()
        break
      case 'cog':
        await this.parseCOG()
        break
      case 'csv':
        this.parseCSV()
        break
      default:
        throw new Error(
          `Unsupported data type: ${this.actualLayerUpload.dataType}`,
        )
    }
  }
}
