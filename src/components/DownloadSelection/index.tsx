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
import * as GeoTIFF from 'geotiff'
import { GetTifLayer } from '../../lib/map/addGeoraster'

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

  async function handleDownloadArea(layerName) {
    if (checkInputValue()) {
      setFlashMessage({
        messageType: 'warning',
        content: 'Please check your input values',
      })
      return
    }
    if (layerName.dataType === 'GeoTIFF') {
      setFlashMessage({
        messageType: 'warning',
        content: 'GeoTIFF download is not available',
      })
      // const response = await fetch(layerName.url)
      // const arrayBuffer = await response.arrayBuffer()
      // const tiff = await GeoTIFF.fromArrayBuffer(arrayBuffer)
      // const image = await tiff.getImage()
      // const width = image.getWidth()
      // const height = image.getHeight()

      // const bbox = image.getBoundingBox()
      // const scaleX = width / (bbox[2] - bbox[0])
      // const scaleY = height / (bbox[3] - bbox[1])

      // const xMin = Math.floor((downloadInputValue.region[0] - bbox[0]) * scaleX)
      // const yMin = Math.floor((downloadInputValue.region[1] - bbox[1]) * scaleY) // latMax because origin is top-left
      // const xMax = Math.ceil((downloadInputValue.region[2] - bbox[0]) * scaleX)
      // const yMax = Math.ceil((downloadInputValue.region[3] - bbox[1]) * scaleY)
      // const window = [xMin, yMin, xMax, yMax]
      // const data = await image.readRasters({ window })

      // // Create a new GeoTIFF file with clipped data (this part is conceptual)
      // const clippedTiff = await createClippedGeoTIFF(data, window, image)

      // // Save the file using file-saver
      // import('file-saver').then((FileSaver) => {
      //   const blob = new Blob([clippedTiff], { type: 'image/tiff' })
      //   FileSaver.saveAs(blob, 'clipped-image.tiff')
      // })

      // console.log(image, bbox, scaleX, scaleY, width, height)
      // console.log(xMin, yMin, xMax, yMax)
      // console.log(data)

      const getTifLayer = new GetTifLayer(
        layerName.url,
        undefined,
        undefined,
        undefined,
        layerName,
      )
      console.log(downloadInputValue.region)
      const pixels = await getTifLayer.clipGeo(downloadInputValue.region)
      console.log(pixels)
    } else if (layerName.dataType === 'GeoJSON') {
      setFlashMessage({
        messageType: 'warning',
        content: 'GeoJSON download is not available',
      })
    } else if (layerName.dataType === 'FGB') {
      setFlashMessage({
        messageType: 'warning',
        content: 'FGB download is not available',
      })
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
