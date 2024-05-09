/* eslint-disable no-multi-str */
// import { Info } from 'phosphor-react'
import styles from '../DataExplorationSelection/DataExplorationSelection.module.css'
import {
  LayerSelectionContainer,
  LayerSelectionTitle,
  LayerTypes,
} from '../DataExplorationSelection/styles'
import { CalcTypeContainer } from '../DataExplorationType/styles'
import HighlightAltIcon from '@mui/icons-material/HighlightAlt'
import { ButtonIcon, CssTextField } from './styles'
import { LayerTypeOptionsContainer } from '../DataExplorationTypeOptions/styles'
import React, { useEffect } from 'react'
import { useContextHandle } from '../../lib/contextHandle'
import { useDownloadManagementHandle } from '../../lib/data/downloadManagement'
import { Button } from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDownload } from '@fortawesome/free-solid-svg-icons'
import { GetTifLayer } from '../../lib/map/addGeoraster'
import * as turf from '@turf/turf'

interface DownloadSelectionProps {
  selectedLayers: any
  setSelectedLayers: any
  listLayers: any
  setDownloadPopup: any
}

export function DownloadSelection({
  selectedLayers,
  setSelectedLayers,
  listLayers,
  setDownloadPopup,
}: DownloadSelectionProps) {
  const { setFlashMessage } = useContextHandle()
  const {
    drawRectangle,
    setDrawRectangle,
    rectangleLimits,
    downloadInputValue,
    setDownloadInputValue,
    downloadableLayers,
  } = useDownloadManagementHandle()

  const handleRegionInputChange = (index, newValue) => {
    setDownloadInputValue((prevInputValue) => {
      const updatedRegion = [...prevInputValue.region]
      updatedRegion[index] = newValue
      return { ...prevInputValue, region: updatedRegion }
    })
  }

  function checkInputValue() {
    if (
      downloadInputValue.region[0] === '' ||
      downloadInputValue.region[1] === '' ||
      downloadInputValue.region[2] === '' ||
      downloadInputValue.region[3] === '' ||
      downloadInputValue.layers.length === 0
    ) {
      return true
    }
    // TODO: check if there are selected Layers
    return false
  }
  const dateTimeNow = new Date().toISOString().replace(/:/g, '-').slice(0, 19)

  async function clipAndDownloadGeoTIFF(layerInfo, layerName) {
    const georaster = downloadableLayers[layerName]
    console.log(georaster)
    const getTifLayer = new GetTifLayer()
    const values = await getTifLayer.clipGeo(
      georaster,
      downloadInputValue.region,
    )
    if (values[0].length === 0) {
      setFlashMessage({
        messageType: 'warning',
        content: 'No data available in the selected area',
      })
    } else {
      setFlashMessage({
        messageType: 'info',
        content: 'Generating and downloading data',
      })

      const nrows = values[0].length
      const ncols = values[0][0].length
      const xllcorner = Number(downloadInputValue.region[0])
      const yllcorner = Number(downloadInputValue.region[1])
      const cellsize = georaster.pixelHeight
      const nodataValue = georaster.noDataValue
      let header = `ncols ${ncols}\n`
      header += `nrows ${nrows}\n`
      header += `xllcorner ${xllcorner}\n`
      header += `yllcorner ${yllcorner}\n`
      header += `cellsize ${cellsize}\n`
      header += `NODATA_value ${nodataValue}\n`

      let body = ''
      for (let i = 0; i < nrows; i++) {
        for (let j = 0; j < ncols; j++) {
          body += values[0][i][j] + ' '
        }
        body = body.trim() + '\n'
      }

      const ascContent = header + body
      const blob = new Blob([ascContent], { type: 'text/plain' })

      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `${layerName}_${dateTimeNow}.asc`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  async function clipAndDownloadGeoJSON(layerInfo, layerName) {
    const geojsonData = downloadableLayers[layerName]
    downloadGeoJSON(geojsonData, layerName)
  }

  async function downloadGeoJSON(data, layerName) {
    const bbox = downloadInputValue.region.map((x) => Number(x))
    const bboxPolygon = turf.bboxPolygon(bbox)
    const clippedFeatures = data.features.filter((feature) => {
      switch (feature.geometry.type) {
        case 'Point': {
          const point = turf.point(feature.geometry.coordinates)
          return turf.booleanPointInPolygon(point, bboxPolygon)
        }
        case 'LineString': {
          const line = turf.lineString(feature.geometry.coordinates)
          const intersection = turf.lineIntersect(line, bboxPolygon)
          return intersection.features.length > 0
        }
        case 'Polygon': {
          console.log(feature)
          const polygon = turf.polygon(feature.geometry.coordinates)
          const intersection = turf.intersect(polygon, bboxPolygon)
          return intersection !== null
        }
        case 'MultiPolygon': {
          console.log(feature)
          const multiPolygon = turf.multiPolygon(feature.geometry.coordinates)
          const intersection = turf.intersect(multiPolygon, bboxPolygon)
          return intersection !== null
        }

        default:
          return false
      }
    })
    if (clippedFeatures.length === 0) {
      setFlashMessage({
        messageType: 'warning',
        content: 'No data available in the selected area',
      })
      return
    }
    setFlashMessage({
      messageType: 'info',
      content: 'Generating and downloading data',
    })

    const filteredGeoJSON = {
      type: 'FeatureCollection',
      features: clippedFeatures,
    }

    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(filteredGeoJSON))
    const downloadAnchorNode = document.createElement('a')
    downloadAnchorNode.setAttribute('href', dataStr)
    downloadAnchorNode.setAttribute(
      'download',
      `${layerName}_${dateTimeNow}.geojson`,
    )
    document.body.appendChild(downloadAnchorNode)
    downloadAnchorNode.click()
    downloadAnchorNode.remove()
  }

  async function clipAndDownloadFGB(layerInfo, layerName) {
    const fgbFile = downloadableLayers[layerName]
    console.log(fgbFile)
    downloadGeoJSON(fgbFile, layerName)
  }

  async function handleDownloadArea(layerInfo, layerName) {
    if (checkInputValue()) {
      setFlashMessage({
        messageType: 'warning',
        content: 'Please check your input values',
      })
      return
    }
    if (layerInfo.dataType === 'GeoTIFF') {
      clipAndDownloadGeoTIFF(layerInfo, layerName)
    } else if (layerInfo.dataType === 'GeoJSON') {
      clipAndDownloadGeoJSON(layerInfo, layerName)
    } else if (layerInfo.dataType === 'FGB') {
      clipAndDownloadFGB(layerInfo, layerName)
    }
  }

  useEffect(() => {
    setDownloadInputValue((prevInputValue) => {
      const updatedLayers = Object.keys(selectedLayers)
      return { ...prevInputValue, layers: updatedLayers }
    })
  }, [selectedLayers])

  useEffect(() => {
    if (rectangleLimits) {
      setDownloadInputValue((prevInputValue) => {
        const updatedRegion = [...prevInputValue.region]
        updatedRegion[1] = rectangleLimits._southWest.lat.toFixed(4)
        updatedRegion[0] = rectangleLimits._southWest.lng.toFixed(4)
        updatedRegion[3] = rectangleLimits._northEast.lat.toFixed(4)
        updatedRegion[2] = rectangleLimits._northEast.lng.toFixed(4)
        return { ...prevInputValue, region: updatedRegion }
      })
    }
  }, [rectangleLimits])
  useEffect(() => {
    if (drawRectangle) {
      setFlashMessage({
        messageType: 'warning',
        content: 'Please draw your rectangle',
      })
    }
  }, [drawRectangle])

  const rout = window.location.pathname

  return (
    <LayerSelectionContainer className={styles.fade_in}>
      <div className={styles.fade_in}>
        <div className="space-y-1 md:space-y-2 py-4">
          <p className="text-lg font-bold text-white mb-2 text-center">
            Download Layers
          </p>
          <div>
            <p className="pt-2 text-md font-bold text-white mb-2 text-center">
              Area
            </p>
            {rout === '/' && (
              <div className="flex justify-center gap-6 items-center">
                <ButtonIcon
                  title="Draw Area on Map"
                  className={`hover:shadow-whi hover:opacity-60 hover:shadow-sm shadow-black ${
                    drawRectangle
                      ? 'opacity-60 shadow-sm'
                      : 'opacity-100 shadow-md'
                  }`}
                  onClick={() => setDrawRectangle(!drawRectangle)}
                >
                  <HighlightAltIcon className="p-1 pb-0" />
                </ButtonIcon>
              </div>
            )}
            <div className="flex flex-col justify-between items-center">
              <CssTextField
                id="region-max-lat"
                label="Max Lat"
                type="number"
                name="min_lat"
                variant="standard"
                InputLabelProps={{
                  style: {
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    width: '90%',
                    color: 'white',
                    borderWidth: '10px',
                    borderColor: 'white !important',
                  },
                }}
                InputProps={{
                  style: {
                    color: 'white',
                  },
                }}
                value={downloadInputValue.region[3]}
                onInput={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleRegionInputChange(3, e.target.value)
                }
              />
              <div className="flex gap-4 justify-center items-center border-white border-b-2">
                <CssTextField
                  id="region-min-lon"
                  label="Min Lon"
                  type="number"
                  name="min_lon"
                  variant="standard"
                  InputLabelProps={{
                    style: {
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      width: '90%',
                      color: 'white',
                      borderWidth: '10px',
                      borderColor: 'white !important',
                    },
                  }}
                  InputProps={{
                    style: {
                      color: 'white',
                    },
                  }}
                  value={downloadInputValue.region[0]}
                  onInput={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleRegionInputChange(0, e.target.value)
                  }
                />
                <CssTextField
                  id="region-max-lon"
                  label="Max Lon"
                  type="number"
                  name="max_lon"
                  variant="standard"
                  InputLabelProps={{
                    style: {
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      width: '90%',
                      color: 'white',
                      borderWidth: '10px',
                      borderColor: 'white !important',
                    },
                  }}
                  InputProps={{
                    style: {
                      color: 'white',
                    },
                  }}
                  value={downloadInputValue.region[2]}
                  onInput={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleRegionInputChange(2, e.target.value)
                  }
                />
              </div>
              <CssTextField
                id="region-min-lat"
                label="Min Lat"
                type="number"
                name="min_lat"
                variant="standard"
                InputLabelProps={{
                  style: {
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    width: '90%',
                    color: 'white',
                    borderWidth: '10px',
                    borderColor: 'white !important',
                  },
                }}
                InputProps={{
                  style: {
                    color: 'white',
                  },
                }}
                value={downloadInputValue.region[1]}
                onInput={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleRegionInputChange(1, e.target.value)
                }
              />
            </div>
          </div>
        </div>
      </div>
      <LayerSelectionTitle>
        <h1>Layers Selected</h1>
      </LayerSelectionTitle>
      <LayerTypes>
        {Object.keys(listLayers).map((layerClass: any) => {
          return (
            Object.keys(selectedLayers).some((element) =>
              element.split('_')[0].includes(layerClass),
            ) && (
              <CalcTypeContainer key={layerClass}>
                <div>
                  <header id="general-types" style={{ color: 'white' }}>
                    <p>{layerClass}</p>
                  </header>
                </div>
                <div className="flex flex-col gap-1 pt-1">
                  {Object.keys(listLayers[layerClass].layerNames).map(
                    (baseLayer, index) => {
                      return (
                        Object.keys(selectedLayers).some((element) =>
                          element.split('_')[1].includes(baseLayer),
                        ) && (
                          <LayerTypeOptionsContainer key={index}>
                            <div id="type-option">
                              <p className="text-md">{baseLayer}</p>
                              <div id="layer-edit">
                                {listLayers[layerClass].layerNames[baseLayer]
                                  .download_area ? (
                                  <Button
                                    onClick={() =>
                                      handleDownloadArea(
                                        listLayers[layerClass].layerNames[
                                          baseLayer
                                        ],
                                        `${layerClass}_${baseLayer}`,
                                      )
                                    }
                                    variant="contained"
                                    className="!w-full !text-white !bg-black !rounded-lg opacity-50 hover:!opacity-70 !text-xs"
                                    title="Download Selected Area"
                                  >
                                    <FontAwesomeIcon
                                      icon={faDownload}
                                      className="pr-3"
                                    />
                                    Area
                                  </Button>
                                ) : (
                                  <></>
                                )}
                                <Button
                                  onClick={() =>
                                    setDownloadPopup({
                                      [`${layerClass}_${baseLayer}`]:
                                        listLayers[layerClass].layerNames[
                                          baseLayer
                                        ].download,
                                    })
                                  }
                                  variant="contained"
                                  className="!w-full !text-white !bg-black !rounded-lg opacity-50 hover:!opacity-70 !text-xs"
                                >
                                  <FontAwesomeIcon
                                    icon={faDownload}
                                    className="pr-3"
                                  />
                                  Layer
                                </Button>
                              </div>
                            </div>
                          </LayerTypeOptionsContainer>
                        )
                      )
                    },
                  )}
                </div>
              </CalcTypeContainer>
            )
          )
        })}
      </LayerTypes>
    </LayerSelectionContainer>
  )
}
