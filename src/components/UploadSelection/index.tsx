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
import { defaultOpacity, reprojectData } from '../../lib/map/utils'
import chroma from 'chroma-js'
import { handleClickLegend } from '../DataExplorationTypeOptions'
import { UploadLayerWMS } from '../UploadLayerWMS'
import { UploadLayerGeoJSONGeoTIFF } from '../UploadLayerGeoJSONGeoTIFF'
import * as shapefile from 'shapefile'
import { useContextHandle } from '../../lib/contextHandle'
import { UploadLayerCOG } from '../UploadLayerCOG'
import { UploadLayerCSV } from '../UploadLayerCSV'
import Papa from 'papaparse'

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
    actualLayerUpload,
    setActualLayerUpload,
    listLayersUpload,
  } = useUploadDataHandle()
  const [error, setError] = useState('')
  const errorTimeoutRef = useRef<number | null>(null)
  const { setLoading } = useContextHandle()

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

  const handleUploadLayer = async (localUploadInfo) => {
    if (actualLayerUpload.dataType === 'GeoTIFF') {
      parseGeoraster(localUploadInfo.file).then((georaster) => {
        const scale = [georaster.mins[0], georaster.maxs[0]]
        const newActualLayerUpload = { ...actualLayerUpload }
        const finalActualLayerUpload = {
          dataType: newActualLayerUpload.dataType,
          name: localUploadInfo.file.name,
          data: georaster,
          colors:
            colorScale === 'Custom' ? newActualLayerUpload.colors : colorScale,
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
          scaleColor = chroma.scale(finalActualLayerUpload.colors).domain(scale)
          for (let i = 0; i < times; i++) {
            const color = scaleColor((1 / (times - 1)) * i)
            cogColors.push([color._rgb[0], color._rgb[1], color._rgb[2]])
            cogColorsValues.push(
              Number(scale[0]) + (difValues / (times - 1)) * i,
            )
          }
        }
        setLayerLegend({
          layerName: localUploadInfo.file.name,
          layerInfo: finalActualLayerUpload,
          selectedLayersKey: `uploaded_${localUploadInfo.file.name}`,
          scale,
          dataDescription: '',
          legend: [cogColors, cogColorsValues],
          dataType: finalActualLayerUpload.dataType,
        })
        setLoading(false)
      })
    } else if (actualLayerUpload.dataType === 'GeoJSON') {
      const reader = new FileReader()
      reader.onload = async (e) => {
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
        setLoading(false)
      }
      reader.readAsText(localUploadInfo.file)
    } else if (actualLayerUpload.dataType === 'Shapefile') {
      const reader = new FileReader()
      reader.onload = async () => {
        const data = await shapefile.read(reader.result)
        try {
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
      const nameOfLayer =
        localUploadInfo.url.split('/')[
          localUploadInfo.url.split('/').length - 1
        ]
      const newActualLayerUpload = {
        dataType: actualLayerUpload.dataType,
        name: nameOfLayer.length > 18 ? nameOfLayer.slice(0, 18) : nameOfLayer,
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
      setLoading(false)
    } else if (actualLayerUpload.dataType === 'CSV') {
      try {
        Papa.parse(localUploadInfo.file, {
          complete: function (results) {
            console.log(results)
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
      }
      setLoading(false)
    }
  }
  const handleSubmit = async () => {
    if (checkInputValue()) {
      setError('Please fill all the fields')
    } else {
      setLoading(true)
      await handleUploadLayer(localUploadInfo)
    }
  }

  const [labelText, setLabelText] = useState('Choose file')
  const [labelPrjText, setLabelPrjText] = useState('Choose file')

  const handleChangeUploadFormat = (event) => {
    if (event.target.value === 'COG') {
      setColorScale('Accent')
    } else {
      setColorScale('Custom')
    }
    setLocalUploadInfo({})
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

  const handleFileChange = (event, proj?) => {
    let fileName = event.target.files[0]
      ? event.target.files[0].name
      : 'Choose file'
    if (fileName !== 'Choose file') {
      if (proj) {
        if (fileName.endsWith('.prj')) {
          const reader = new FileReader()
          reader.onload = (event) => {
            const prjText = event.target.result as string
            setLocalUploadInfo((localUploadInfo) => {
              return { ...localUploadInfo, proj: prjText }
            })
          }
          reader.readAsText(event.target.files[0])
          setError('')
        } else {
          setError('Please upload a .prj file')
        }
      } else {
        setLocalUploadInfo((localUploadInfo) => {
          return { ...localUploadInfo, file: event.target.files[0] }
        })
      }
      fileName = fileName.length > 18 ? fileName.slice(0, 18) + '...' : fileName
    } else {
      setLocalUploadInfo({})
    }
    if (proj) {
      setLabelPrjText(fileName)
    } else {
      setLabelText(fileName)
    }
  }

  return (
    <LayerSelectionContainer className={styles.fade_in}>
      <div className={styles.fade_in}>
        <div className="space-y-1 md:space-y-2 py-4 px-2">
          <p className="text-lg font-bold text-white mb-2 text-center">
            Upload Layers
          </p>
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
            {['GeoJSON', 'GeoTIFF', 'Shapefile'].includes(
              actualLayerUpload.dataType,
            ) ? (
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
        </div>
      </div>
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
    </LayerSelectionContainer>
  )
}
