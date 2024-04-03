/* eslint-disable no-multi-str */
// import { Info } from 'phosphor-react'
import styles from '../DataExplorationSelection/DataExplorationSelection.module.css'
import { LayerSelectionContainer } from '../DataExplorationSelection/styles'
import React, { useEffect, useRef, useState } from 'react'
import { Button } from '@mui/material'
import { useUploadDataHandle } from '../../lib/data/uploadDataManagement'
import { CssTextField } from './styles'
import parseGeoraster from 'georaster'
import { allColorScales, colorScaleByName } from '../../lib/map/jsColormaps'
import { LayersUploaded } from '../LayersUploaded'
import { defaultOpacity } from '../../lib/map/utils'
import chroma from 'chroma-js'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRotateRight } from '@fortawesome/free-solid-svg-icons'
import styles1 from './UploadSelection.module.css'
import { handleClickLegend } from '../DataExplorationTypeOptions'

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
  const [isLoading, setIsLoading] = useState(false)

  const [colorScale, setColorScale] = useState<string>('Custom')
  const [localUploadInfo, setLocalUploadInfo] = useState<any>({})

  const [layers, setLayers] = useState({})
  const [wmsSelectedLayer, setWmsSelectedLayer] = useState(null)
  const [selectedStyle, setSelectedStyle] = useState('')

  function parseCapabilities(xml) {
    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(xml, 'text/xml')
    const layers = {}
    const layerNodes = xmlDoc.getElementsByTagName('Layer')
    for (let i = 0; i < layerNodes.length; i++) {
      const styles = []
      const layerNode = layerNodes[i]
      const layerName = layerNode.getElementsByTagName('Name')[0].textContent
      const styleNodes = layerNode.getElementsByTagName('Style')
      for (let j = 0; j < styleNodes.length; j++) {
        const styleNode = styleNodes[j]
        const styleName = styleNode.getElementsByTagName('Name')[0].textContent
        styles.push(styleName)
      }
      layers[layerName] = styles
    }
    return layers
  }
  // Function to fetch WMS capabilities
  const fetchCapabilities = async () => {
    setIsLoading(true)
    if (!localUploadInfo.url) {
      setError('Please fill the URL field')
      return
    }
    try {
      const response = await fetch(
        `${localUploadInfo.url}?service=WMS&request=GetCapabilities`,
      )
      const text = await response.text()
      const layers = parseCapabilities(text)
      setLayers(layers)
      setWmsSelectedLayer(Object.keys(layers)[0])
      setSelectedStyle(layers[Object.keys(layers)[0]][0])
    } catch (error) {
      setError(
        'Error fetching capabilities: please check the URL and try again',
      )
    }
    setIsLoading(false)
  }

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
      }
      reader.readAsText(localUploadInfo.file)
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
    }
  }
  const handleSubmit = async () => {
    if (checkInputValue()) {
      setError('Please fill all the fields')
    } else {
      await handleUploadLayer(localUploadInfo)
    }
  }

  function handleChangeWmsSelectedLayer(value) {
    setWmsSelectedLayer(value)
    setSelectedStyle(layers[value][0])
  }
  const [labelText, setLabelText] = useState('Choose file')
  const handleChangeUploadFormat = (event) => {
    setColorScale('Custom')
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

  const handleFileChange = (event) => {
    let fileName = event.target.files[0]
      ? event.target.files[0].name
      : 'Choose file'
    if (fileName !== 'Choose file') {
      setLocalUploadInfo({ file: event.target.files[0] })
      fileName = fileName.length > 18 ? fileName.slice(0, 18) + '...' : fileName
    } else {
      setLocalUploadInfo({})
    }
    setLabelText(fileName)
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
            {['GeoJSON', 'GeoTIFF'].includes(actualLayerUpload.dataType) ? (
              <div className="w-full">
                <div className="flex justify-between w-full items-center">
                  <p className="pt-4 text-md font-bold text-white mb-2 text-center">
                    Upload File:
                  </p>
                  <div className="flex justify-center gap-6 items-center">
                    <label
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      htmlFor="file_input"
                    >
                      Upload file:
                    </label>
                    <input
                      id="file_input"
                      type="file"
                      style={{ display: 'none' }}
                      onChange={handleFileChange}
                    />
                    <label
                      htmlFor="file_input"
                      className="block w-full text-sm text-white rounded-lg cursor-pointer bg-black bg-opacity-50 hover:bg-opacity-80"
                      style={{ padding: '10px', textAlign: 'center' }}
                    >
                      {labelText}
                    </label>
                  </div>
                </div>
                <div className="pt-4 flex justify-between w-full items-center">
                  <p className="text-md font-bold text-white mb-2 text-center">
                    {actualLayerUpload.dataType === 'GeoJSON'
                      ? 'Geometry Colors:'
                      : 'Color Scale:'}
                  </p>
                  <div className="flex flex-col items-center gap-1">
                    {actualLayerUpload.dataType === 'GeoTIFF' && (
                      <div className="flex justify-between items-center w-full">
                        <select
                          id="fileFormat-select"
                          value={colorScale}
                          onChange={(e) => setColorScale(e.target.value)}
                          className="clickable bg-black border border-black bg-opacity-20 text-white text-sm rounded-lg  block w-max p-2 hover:bg-opacity-80"
                        >
                          <option
                            className="!bg-black !bg-opacity-80 opacity-30 !text-white"
                            value="Custom"
                          >
                            Custom
                          </option>
                          {allColorScales.map((allColorScale, index) => (
                            <option
                              className="!bg-black !bg-opacity-80 opacity-30 !text-white"
                              value={allColorScale}
                              key={index}
                            >
                              {allColorScale}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                    {colorScale === 'Custom' && (
                      <div className="flex justify-end items-center gap-1">
                        <input
                          type="color"
                          className="p-1 block bg-black  bg-opacity-30 cursor-pointer rounded-lg disabled:opacity-50 disabled:pointer-events-none"
                          id="hs-color-input"
                          value={actualLayerUpload.colors[0]}
                          onChange={(e) => handleColorChange(e, 0)}
                          title="Choose your color"
                        />
                        {actualLayerUpload.dataType === 'GeoTIFF' && (
                          <input
                            type="color"
                            className="p-1 block bg-black bg-opacity-30  cursor-pointer rounded-lg disabled:opacity-50 disabled:pointer-events-none"
                            id="hs-color-input"
                            value={actualLayerUpload.colors[1]}
                            onChange={(e) => handleColorChange(e, 1)}
                            title="Choose your color"
                          />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : actualLayerUpload.dataType === 'WMS' ? (
              <div className="flex flex-col items-center gap-3 w-full">
                <div className="flex justify-center w-full items-center gap-2">
                  <CssTextField
                    id="wms-url"
                    label="Url"
                    type="text"
                    name="url-wms"
                    variant="standard"
                    className="!w-full"
                    InputLabelProps={{
                      style: {
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        width: '100%',
                        color: 'white',
                        borderWidth: '10px',
                        borderColor: 'white !important',
                      },
                    }}
                    onInput={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setLocalUploadInfo({ url: e.target.value })
                    }
                    InputProps={{
                      style: {
                        color: 'white',
                      },
                    }}
                  />
                  <div
                    onClick={() => fetchCapabilities()}
                    className="!text-white !bg-black !rounded-lg opacity-50 hover:!opacity-70 p-2 cursor-pointer"
                    title="See available layers"
                  >
                    <FontAwesomeIcon
                      icon={faRotateRight}
                      className={isLoading ? `${styles1.rotate}` : ''}
                    />
                  </div>
                </div>
                {Object.keys(layers).length > 0 && (
                  <div className="flex flex-col items-center gap-3 w-full">
                    <div className="flex justify-between items-center w-full">
                      <select
                        id="fileFormat-select"
                        value={wmsSelectedLayer}
                        onChange={(e) =>
                          handleChangeWmsSelectedLayer(e.target.value)
                        }
                        className="clickable bg-black border border-black bg-opacity-20 text-white text-sm rounded-lg  block w-full p-2 hover:bg-opacity-80"
                      >
                        {Object.keys(layers).map((layer, index) => (
                          <option
                            className="!bg-black !bg-opacity-80 opacity-30 !text-white"
                            value={layer}
                            key={index}
                          >
                            {layer}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex justify-between items-center w-full">
                      <select
                        id="fileFormat-select"
                        value={selectedStyle}
                        onChange={(e) => setSelectedStyle(e.target.value)}
                        className="clickable bg-black border border-black bg-opacity-20 text-white text-sm rounded-lg  block w-full p-2 hover:bg-opacity-80"
                      >
                        {layers[wmsSelectedLayer].map((style, index) => (
                          <option
                            className="!bg-black !bg-opacity-80 opacity-30 !text-white"
                            value={style}
                            key={index}
                          >
                            {style}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>
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
