/* eslint-disable no-multi-str */
// import { Info } from 'phosphor-react'
import styles from '../DataExplorationSelection/DataExplorationSelection.module.css'
import { LayerSelectionContainer } from '../DataExplorationSelection/styles'
import { useEffect, useRef, useState } from 'react'
import { Button } from '@mui/material'
import { useUploadDataHandle } from '../../lib/data/uploadDataManagement'
import parseGeoraster from 'georaster'
import { colorScaleByName } from '../../lib/map/jsColormaps'
import { LayersUploaded } from '../LayersUploaded'
import {
  TILE_SERVER_URL,
  defaultOpacity,
  reprojectData,
} from '../../lib/map/utils'
import chroma from 'chroma-js'
import { handleClickLegend } from '../DataExplorationTypeOptions'
import { UploadLayerWMS } from '../UploadLayerWMS'
import { UploadLayerGeoJSONGeoTIFF } from '../UploadLayerGeoJSONGeoTIFF'
import * as shapefile from 'shapefile'
import { useContextHandle } from '../../lib/contextHandle'
import { UploadLayerCOG } from '../UploadLayerCOG'
import { UploadLayerCSV } from '../UploadLayerCSV'
import Papa from 'papaparse'
import { ConfirmationDialog } from '../ConfirmationDialog'
import axios from 'axios'
import * as toGeoJSON from '@mapbox/togeojson'
import JSZip from 'jszip'

interface UploadSelectionProps {
  layerAction: any
  setLayerAction: any
  layerLegend: any
  setLayerLegend: any
}

export function UploadSelection({
  layerAction,
  setLayerAction,
  layerLegend,
  setLayerLegend,
}: UploadSelectionProps) {
  const {
    uploadFormats,
    fileTypes,
    actualLayerUpload,
    setActualLayerUpload,
    listLayersUpload,
  } = useUploadDataHandle()
  const [error, setError] = useState('')
  const errorTimeoutRef = useRef<number | null>(null)
  const { setLoading, setFlashMessage } = useContextHandle()

  const [colorScale, setColorScale] = useState<string>('Custom')
  const [localUploadInfo, setLocalUploadInfo] = useState<any>({})

  const [layers, setLayers] = useState({})
  const [wmsSelectedLayer, setWmsSelectedLayer] = useState(null)
  const [selectedStyle, setSelectedStyle] = useState('')
  const [csvData, setCsvData] = useState<any>({
    delimiter: ',',
    header: false,
    latLngColumnNames: ['lat', 'lng'],
    latLngColumnNumbers: [0, 1],
  })

  useEffect(() => {
    if (errorTimeoutRef.current !== null) {
      clearTimeout(errorTimeoutRef.current)
      errorTimeoutRef.current = null
    }

    if (error) {
      errorTimeoutRef.current = window.setTimeout(() => {
        setError('')
      }, 5000)
    }

    return () => {
      if (errorTimeoutRef.current !== null) {
        clearTimeout(errorTimeoutRef.current)
      }
    }
  }, [error])
  function checkInputValue() {
    if (
      !actualLayerUpload.dataType ||
      Object.keys(localUploadInfo).length === 0
    ) {
      return true
    }
    if (
      actualLayerUpload.dataType === 'Shapefile' &&
      (!localUploadInfo.proj || !localUploadInfo.file)
    ) {
      return true
    }
    return false
  }

  const checkCOGInput = async (localUploadInfo) => {
    try {
      await axios.get(
        `${TILE_SERVER_URL}cog/info?url=${encodeURIComponent(
          localUploadInfo.url,
        )}&encoded=false`,
      )
      return true
    } catch (error) {
      return false
    }
  }
  const handleUploadLayer = async (localUploadInfo) => {
    if (actualLayerUpload.dataType === 'GeoTIFF') {
      try {
        parseGeoraster(localUploadInfo.file).then((georaster) => {
          const scale = [georaster.mins[0], georaster.maxs[0]]
          const newActualLayerUpload = { ...actualLayerUpload }
          const finalActualLayerUpload = {
            dataType: newActualLayerUpload.dataType,
            name: localUploadInfo.file.name,
            data: georaster,
            colors:
              colorScale === 'Custom'
                ? newActualLayerUpload.colors
                : colorScale,
            scale,
            opacity: defaultOpacity,
          }
          setActualLayerUpload(finalActualLayerUpload)
          const difValues = scale[1] - scale[0]
          const times = 30
          const cogColors = []
          const cogColorsValues = []
          let scaleColor
          if (typeof finalActualLayerUpload.colors === 'string') {
            scaleColor = colorScaleByName(finalActualLayerUpload.colors)
            for (let i = 0; i < times; i++) {
              cogColors.push(scaleColor((1 / (times - 1)) * i))
              cogColorsValues.push(
                Number(scale[0]) + (difValues / (times - 1)) * i,
              )
            }
          } else {
            scaleColor = chroma
              .scale(finalActualLayerUpload.colors)
              .domain(scale)
            for (let i = 0; i < times; i++) {
              const color = scaleColor((1 / (times - 1)) * i)
              cogColors.push([color._rgb[0], color._rgb[1], color._rgb[2]])
              cogColorsValues.push(
                Number(scale[0]) + (difValues / (times - 1)) * i,
              )
            }
          }
          setLayerLegend((layerLegend: any) => {
            const newLayerLegend = { ...layerLegend }
            delete newLayerLegend[localUploadInfo.file.name]
            newLayerLegend[localUploadInfo.file.name] = {
              layerName: localUploadInfo.file.name,
              layerInfo: finalActualLayerUpload,
              selectedLayersKey: `uploaded_${localUploadInfo.file.name}`,
              scale,
              dataDescription: '',
              legend: [cogColors, cogColorsValues],
              dataType: finalActualLayerUpload.dataType,
            }
            return newLayerLegend
          })
          setLoading(false)
        })
      } catch (error) {
        setError('Error on the data. Please check the GeoTIFF file')
        setFlashMessage({
          messageType: 'error',
          content: 'Error on the data. Please check the GeoTIFF file',
        })
        setLoading(false)
      }
    } else if (actualLayerUpload.dataType === 'ASC') {
      const reader = new FileReader()
      reader.onload = async (e) => {
        try {
          const content = e.target.result.toString()
          const lines = content.split('\n')
          const metadata: any = {}
          const values = []
          let parsingData = false
          let yllCorner: any
          let nRows: any
          lines.forEach((line) => {
            const parts = line.trim().split(/\s+/)
            if (!parsingData) {
              if (parts[0].toLowerCase() === 'nrows') {
                nRows = parseInt(parts[1], 10)
              } else if (parts[0].toLowerCase() === 'ncols') {
                metadata.nCols = parseInt(parts[1], 10)
              } else if (parts[0].toLowerCase() === 'xllcorner') {
                metadata.xmin = parseFloat(parts[1])
              } else if (parts[0].toLowerCase() === 'yllcorner') {
                yllCorner = parseFloat(parts[1])
              } else if (parts[0].toLowerCase() === 'cellsize') {
                metadata.pixelWidth = parseFloat(parts[1])
                metadata.pixelHeight = parseFloat(parts[1])
              } else if (parts[0].toLowerCase() === 'nodata_value') {
                metadata.noDataValue = parseFloat(parts[1])
              } else if (parts.length === metadata.nCols) {
                parsingData = true
                const row = parts.map(Number)
                values.push(row)
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
          const newActualLayerUpload = { ...actualLayerUpload }
          const finalActualLayerUpload = {
            dataType: newActualLayerUpload.dataType,
            name: localUploadInfo.file.name,
            data: georaster,
            colors:
              colorScale === 'Custom'
                ? newActualLayerUpload.colors
                : colorScale,
            scale,
            opacity: defaultOpacity,
          }
          setActualLayerUpload(finalActualLayerUpload)
          const difValues = scale[1] - scale[0]
          const times = 30
          const cogColors = []
          const cogColorsValues = []
          let scaleColor
          if (typeof finalActualLayerUpload.colors === 'string') {
            scaleColor = colorScaleByName(finalActualLayerUpload.colors)
            for (let i = 0; i < times; i++) {
              cogColors.push(scaleColor((1 / (times - 1)) * i))
              cogColorsValues.push(
                Number(scale[0]) + (difValues / (times - 1)) * i,
              )
            }
          } else {
            scaleColor = chroma
              .scale(finalActualLayerUpload.colors)
              .domain(scale)
            for (let i = 0; i < times; i++) {
              const color = scaleColor((1 / (times - 1)) * i)
              cogColors.push([color._rgb[0], color._rgb[1], color._rgb[2]])
              cogColorsValues.push(
                Number(scale[0]) + (difValues / (times - 1)) * i,
              )
            }
          }
          setLayerLegend((layerLegend: any) => {
            const newLayerLegend = { ...layerLegend }
            delete newLayerLegend[localUploadInfo.file.name]
            newLayerLegend[localUploadInfo.file.name] = {
              layerName: localUploadInfo.file.name,
              layerInfo: finalActualLayerUpload,
              selectedLayersKey: `uploaded_${localUploadInfo.file.name}`,
              scale,
              dataDescription: '',
              legend: [cogColors, cogColorsValues],
              dataType: finalActualLayerUpload.dataType,
            }
            return newLayerLegend
          })
          setLoading(false)
        } catch (error) {
          setError('Error on the data. Please check the ASC file')
          setFlashMessage({
            messageType: 'error',
            content: 'Error on the data. Please check the ASC file',
          })
          setLoading(false)
        }
      }
      reader.readAsText(localUploadInfo.file)
    } else if (actualLayerUpload.dataType === 'GeoJSON') {
      const reader = new FileReader()
      reader.onload = async (e) => {
        try {
          const data = JSON.parse(e.target.result.toString())
          setActualLayerUpload((actualLayerUpload) => {
            const newActualLayerUpload = { ...actualLayerUpload }
            return {
              dataType: newActualLayerUpload.dataType,
              name: localUploadInfo.file.name,
              data,
              colors: newActualLayerUpload.colors,
            }
          })
        } catch (e) {
          setError('Error on the data. Please check the GeoJSON file')
          setFlashMessage({
            messageType: 'error',
            content: 'Error on the data. Please check the GeoJSON file',
          })
        }
        setLoading(false)
      }
      reader.readAsText(localUploadInfo.file)
    } else if (['KMZ'].includes(actualLayerUpload.dataType)) {
      const reader = new FileReader()
      reader.onload = async (e) => {
        try {
          const content = e.target.result
          let data

          const zip = await JSZip.loadAsync(content as ArrayBuffer)
          const kmlFile = Object.keys(zip.files).find((name) =>
            name.endsWith('.kml'),
          )
          if (kmlFile) {
            const kmlText = await zip.files[kmlFile].async('string')
            const kmlDom = new DOMParser().parseFromString(kmlText, 'text/xml')
            data = toGeoJSON.kml(kmlDom)
          }
          console.log(data)

          setActualLayerUpload((actualLayerUpload) => {
            const newActualLayerUpload = { ...actualLayerUpload }
            return {
              dataType: newActualLayerUpload.dataType,
              name: localUploadInfo.file.name,
              data,
              colors: newActualLayerUpload.colors,
            }
          })
        } catch (e) {
          setError('Error on the data. Please check the GeoJSON file')
          setFlashMessage({
            messageType: 'error',
            content: 'Error on the data. Please check the GeoJSON file',
          })
        }
        setLoading(false)
      }
      reader.readAsArrayBuffer(localUploadInfo.file)
    } else if (['KML'].includes(actualLayerUpload.dataType)) {
      const reader = new FileReader()
      reader.onload = async (e) => {
        try {
          const content = e.target.result.toString()

          const kmlDom = new DOMParser().parseFromString(
            content.toString(),
            'text/xml',
          )
          const data = toGeoJSON.kml(kmlDom)
          console.log(data)

          setActualLayerUpload((actualLayerUpload) => {
            const newActualLayerUpload = { ...actualLayerUpload }
            return {
              dataType: newActualLayerUpload.dataType,
              name: localUploadInfo.file.name,
              data,
              colors: newActualLayerUpload.colors,
            }
          })
        } catch (e) {
          setError('Error on the data. Please check the GeoJSON file')
          setFlashMessage({
            messageType: 'error',
            content: 'Error on the data. Please check the GeoJSON file',
          })
        }
        setLoading(false)
      }
      reader.readAsText(localUploadInfo.file)
    } else if (actualLayerUpload.dataType === 'Shapefile') {
      const reader = new FileReader()
      reader.onload = async () => {
        try {
          const data = await shapefile.read(reader.result)
          const reprojectedData = reprojectData(
            data,
            localUploadInfo.proj,
            'EPSG:4326',
          )
          setActualLayerUpload((actualLayerUpload) => {
            const newActualLayerUpload = { ...actualLayerUpload }
            return {
              dataType: newActualLayerUpload.dataType,
              name: localUploadInfo.file.name,
              data: reprojectedData,
              colors: newActualLayerUpload.colors,
            }
          })
        } catch (e) {
          setError('Error on the data. Please check the shp and prj files')
          setFlashMessage({
            messageType: 'error',
            content: 'Error on the data. Please check the shp and prj files',
          })
        }
        setLoading(false)
      }
      reader.readAsArrayBuffer(localUploadInfo.file)
    } else if (actualLayerUpload.dataType === 'WMS') {
      const newActualLayerUpload = {
        dataType: actualLayerUpload.dataType,
        name: `${wmsSelectedLayer}-${selectedStyle}`,
        url: localUploadInfo.url,
        data: wmsSelectedLayer,
        colors: selectedStyle,
      }
      setActualLayerUpload(newActualLayerUpload)
      const newListLayersUpload = { ...listLayersUpload }
      newListLayersUpload[`${wmsSelectedLayer}-${selectedStyle}`] = {
        ...newActualLayerUpload,
        params: {
          layers: newActualLayerUpload.data,
          styles: newActualLayerUpload.colors,
          request: '',
        },
      }
      handleClickLegend(
        newListLayersUpload,
        `${wmsSelectedLayer}-${selectedStyle}`,
        setLayerLegend,
        'uploaded',
      )
      setLoading(false)
    } else if (actualLayerUpload.dataType === 'COG') {
      const cogIsValid = await checkCOGInput(localUploadInfo)
      if (cogIsValid) {
        const nameOfLayer =
          localUploadInfo.url.split('/')[
            localUploadInfo.url.split('/').length - 1
          ]
        const newActualLayerUpload = {
          dataType: actualLayerUpload.dataType,
          name:
            nameOfLayer.length > 18 ? nameOfLayer.slice(0, 18) : nameOfLayer,
          data: localUploadInfo.url,
          colors: colorScale,
        }
        setActualLayerUpload(newActualLayerUpload)
        const newListLayersUpload = { ...listLayersUpload }
        newListLayersUpload[newActualLayerUpload.name] = {
          ...newActualLayerUpload,
          url: localUploadInfo.url,
        }
        handleClickLegend(
          newListLayersUpload,
          newActualLayerUpload.name,
          setLayerLegend,
          'uploaded',
        )
      } else {
        setError('Please check the url of the COG file')
        setFlashMessage({
          messageType: 'error',
          content: 'Please check the url of the COG file',
        })
      }
      setLoading(false)
    } else if (actualLayerUpload.dataType === 'CSV') {
      try {
        Papa.parse(localUploadInfo.file, {
          complete: function (results) {
            const latColumn = csvData.header
              ? csvData.latLngColumnNames[0]
              : csvData.latLngColumnNumbers[0]
            const lngColumn = csvData.header
              ? csvData.latLngColumnNames[1]
              : csvData.latLngColumnNumbers[1]
            const geojsonFeatures = results.data
              .filter(
                (row) => row[latColumn] && row[lngColumn], // Filter out rows without lat/long
              )
              .map((row) => ({
                type: 'Feature',
                properties: csvData.header ? row : { properties: row },
                geometry: {
                  type: 'Point',
                  coordinates: [+row[lngColumn], +row[latColumn]],
                },
              }))

            const geojsonData = {
              type: 'FeatureCollection',
              features: geojsonFeatures,
            }
            setActualLayerUpload((actualLayerUpload) => {
              const newActualLayerUpload = { ...actualLayerUpload }
              return {
                dataType: newActualLayerUpload.dataType,
                name: localUploadInfo.file.name,
                data: geojsonData,
              }
            })
            setLoading(false)

            // Assuming you have a Leaflet map instance called 'map'
            // const geojsonLayer = L.geoJSON(geojsonData).addTo(map)
          },
          delimiter: csvData.delimiter,
          header: csvData.header,
        })
      } catch (error) {
        setError('Error getting data. Check the format of the file')
        setFlashMessage({
          messageType: 'error',
          content: 'Error getting data. Check the format of the file',
        })
      }
      setLoading(false)
    }
  }
  const handleSubmit = async () => {
    if (checkInputValue()) {
      setError('Please check the fields')
      setFlashMessage({
        messageType: 'error',
        content: 'Please check the fields',
      })
    } else {
      setLoading(true)
      await handleUploadLayer(localUploadInfo)
    }
  }

  const [labelText, setLabelText] = useState('Choose file')
  const [labelPrjText, setLabelPrjText] = useState('Choose file')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [fileToUpload, setFileToUpload] = useState(null)

  const handleChangeUploadFormat = (event) => {
    if (event.target.value === 'COG') {
      setColorScale('Accent')
    } else {
      setColorScale('Custom')
    }
    setLocalUploadInfo({})
    setLabelPrjText('Choose file')
    setLabelText('Choose file')
    setActualLayerUpload({
      dataType: event.target.value,
      colors: ['#0859fc', '#fd1317'],
      data: '',
      name: '',
      active: false,
    })
  }

  const handleColorChange = (event, index) => {
    setActualLayerUpload((actualLayerUpload) => {
      const newActualLayerUpload = { ...actualLayerUpload }
      const newColor = [...newActualLayerUpload.colors]
      newColor[index] = event.target.value
      return {
        ...newActualLayerUpload,
        colors: newColor,
      }
    })
  }

  function checkInputFile(file) {
    const fileType = fileTypes[actualLayerUpload.dataType]
    if (
      fileType.mimeTypes.includes(file.type) ||
      fileType.extensions.includes(file.name)
    ) {
      return true
    }
    setError('Invalid file type')
    setFlashMessage({
      messageType: 'error',
      content: 'Invalid file type',
    })
    return false
  }

  const handleFileChange = (event, proj?) => {
    const file = event.target.files[0]
    if (!file) {
      setLabelText('Choose file')
      return
    }
    if (!checkInputFile(file)) {
      setLabelText('Choose file')
      return
    }
    const fileSize = file.size / 1024 / 1024
    if (fileSize > 50) {
      if (proj) {
        setFileToUpload([file, proj])
      } else {
        setFileToUpload([file])
      }
      setIsModalOpen(true)
    } else {
      if (proj) {
        uploadFile(file, proj)
      } else {
        uploadFile(file)
      }
    }
  }

  const uploadFile = (file, proj?) => {
    let fileName = file.name
    fileName = fileName.length > 12 ? fileName.slice(0, 9) + '...' : fileName
    if (proj && !file.name.endsWith('.prj')) {
      setError('Please upload a .prj file')
      setFlashMessage({
        messageType: 'error',
        content: 'Please upload a .prj file',
      })
      return
    }
    if (proj) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const prjText = event.target.result as string
        setLocalUploadInfo((localUploadInfo) => ({
          ...localUploadInfo,
          proj: prjText,
        }))
      }
      reader.readAsText(file)
      setLabelPrjText(fileName)
    } else {
      setLocalUploadInfo((localUploadInfo) => ({
        ...localUploadInfo,
        file,
      }))
      setLabelText(fileName)
    }
  }

  const handleConfirm = () => {
    if (fileToUpload.length > 1) {
      uploadFile(fileToUpload[0], fileToUpload[1])
    } else {
      uploadFile(fileToUpload[0])
    }
    setIsModalOpen(false)
    setFileToUpload(null)
  }

  const handleClose = () => {
    setIsModalOpen(false)
    setFileToUpload(null)
  }

  const rout = window.location.pathname

  return (
    <LayerSelectionContainer className={styles.fade_in}>
      <div className={styles.fade_in}>
        <div className="space-y-1 md:space-y-2 py-4 px-2">
          <p className="text-lg font-bold text-white mb-2 text-center">
            Upload Layers
          </p>
          {rout === '/3d' ? (
            <p className="text-sm text-white text-center">
              This feature is not available in 3D mode
            </p>
          ) : (
            <div className="flex flex-col px-12 items-center">
              <div className="flex justify-between items-center w-full">
                <p className="pt-4 text-md font-bold text-white mb-2 text-center">
                  Data format:
                </p>
                <select
                  id="fileFormat-select"
                  value={actualLayerUpload.dataType}
                  onChange={(e) => handleChangeUploadFormat(e)}
                  className="clickable bg-black border border-black bg-opacity-20 text-white text-sm rounded-lg  block w-max p-2 hover:bg-opacity-80"
                >
                  {uploadFormats.map((uploadFormat, index) => (
                    <option
                      className="!bg-black !bg-opacity-80 opacity-30 !text-white"
                      value={uploadFormat}
                      key={index}
                    >
                      {uploadFormat}
                    </option>
                  ))}
                </select>
              </div>
              {[
                'GeoJSON',
                'GeoTIFF',
                'Shapefile',
                'ASC',
                'KML',
                'KMZ',
              ].includes(actualLayerUpload.dataType) ? (
                <UploadLayerGeoJSONGeoTIFF
                  handleFileChange={handleFileChange}
                  labelText={labelText}
                  labelPrjText={labelPrjText}
                  actualLayerUpload={actualLayerUpload}
                  colorScale={colorScale}
                  setColorScale={setColorScale}
                  handleColorChange={handleColorChange}
                />
              ) : actualLayerUpload.dataType === 'WMS' ? (
                <UploadLayerWMS
                  localUploadInfo={localUploadInfo}
                  setLocalUploadInfo={setLocalUploadInfo}
                  selectedStyle={selectedStyle}
                  setSelectedStyle={setSelectedStyle}
                  layers={layers}
                  setLayers={setLayers}
                  wmsSelectedLayer={wmsSelectedLayer}
                  setWmsSelectedLayer={setWmsSelectedLayer}
                  setError={setError}
                />
              ) : actualLayerUpload.dataType === 'COG' ? (
                <UploadLayerCOG
                  setLocalUploadInfo={setLocalUploadInfo}
                  colorScale={colorScale}
                  setColorScale={setColorScale}
                />
              ) : actualLayerUpload.dataType === 'CSV' ? (
                <UploadLayerCSV
                  handleFileChange={handleFileChange}
                  labelText={labelText}
                  csvData={csvData}
                  setCsvData={setCsvData}
                />
              ) : (
                <></>
              )}
            </div>
          )}
        </div>
      </div>
      {rout === '/' && (
        <>
          <div className="text-red-500 text-sm mt-1">
            {error ? <p>{error}</p> : <div className="pt-[18px]"></div>}
          </div>
          <Button
            onClick={() => handleSubmit()}
            variant="contained"
            className="!w-full !text-white !bg-black !rounded-lg opacity-50 hover:!opacity-70"
          >
            Upload
          </Button>
          {Object.keys(listLayersUpload).length > 0 && (
            <LayersUploaded
              layerAction={layerAction}
              setLayerAction={setLayerAction}
              layerLegend={layerLegend}
              setLayerLegend={setLayerLegend}
            />
          )}
        </>
      )}
      {isModalOpen && (
        <ConfirmationDialog
          onClose={handleClose}
          onConfirm={handleConfirm}
          message={`The file size is ${(
            (fileToUpload.length > 0 ? fileToUpload[0]?.size : 0) /
            1024 /
            1024
          ).toFixed(
            2,
          )} MB. Your browser may freeze while uploading. Do you want to continue?`}
        />
      )}
    </LayerSelectionContainer>
  )
}
