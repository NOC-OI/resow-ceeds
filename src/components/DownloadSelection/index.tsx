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
import React, { useEffect, useRef, useState } from 'react'
import { useContextHandle } from '../../lib/contextHandle'
import { useDownloadManagementHandle } from '../../lib/data/downloadManagement'
import { Button } from '@mui/material'
import styles1 from '../DataExplorationTypeOptions/DataExplorationTypeOptions.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDownload } from '@fortawesome/free-solid-svg-icons'

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
    setRectangleLimits,
    downloadInputValue,
    setDownloadInputValue,
  } = useDownloadManagementHandle()
  const [error, setError] = useState('')
  const errorTimeoutRef = useRef<number | null>(null)

  const handleRegionInputChange = (index, newValue) => {
    setDownloadInputValue((prevInputValue) => {
      const updatedRegion = [...prevInputValue.region]
      updatedRegion[index] = newValue
      return { ...prevInputValue, region: updatedRegion }
    })
  }

  const handleLayersInputChange = (e, layerClass, baseLayer) => {
    if (e.target.checked) {
      setDownloadInputValue((prevInputValue) => {
        const updatedLayers = [...prevInputValue.layers]
        updatedLayers.push(`${layerClass}_${baseLayer}`)
        return { ...prevInputValue, layers: updatedLayers }
      })
    } else {
      setDownloadInputValue((prevInputValue) => {
        let updatedLayers = [...prevInputValue.layers]
        updatedLayers = updatedLayers.filter(
          (item) => item !== `${layerClass}_${baseLayer}`,
        )
        return { ...prevInputValue, layers: updatedLayers }
      })
    }
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
  const handleSubmit = async (event) => {
    setRectangleLimits(null)
    setDrawRectangle(false)
    if (checkInputValue()) {
      setError('Please fill all the fields')
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
        updatedRegion[0] = rectangleLimits._southWest.lat.toFixed(4)
        updatedRegion[1] = rectangleLimits._southWest.lng.toFixed(4)
        updatedRegion[2] = rectangleLimits._northEast.lat.toFixed(4)
        updatedRegion[3] = rectangleLimits._northEast.lng.toFixed(4)
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

  function verifyIfItIsInDownloadList(layerClass: string, baseLayer: string) {
    if (!listLayers[layerClass].layerNames[baseLayer].download_area) {
      return false
    }
    if (downloadInputValue.layers.includes(`${layerClass}_${baseLayer}`)) {
      return true
    }
    return false
  }
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
                value={downloadInputValue.region[2]}
                onInput={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleRegionInputChange(2, e.target.value)
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
                  value={downloadInputValue.region[1]}
                  onInput={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleRegionInputChange(1, e.target.value)
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
                  value={downloadInputValue.region[3]}
                  onInput={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleRegionInputChange(3, e.target.value)
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
                value={downloadInputValue.region[0]}
                onInput={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleRegionInputChange(0, e.target.value)
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
                              <label
                                htmlFor={baseLayer}
                                className={
                                  !listLayers[layerClass].layerNames[baseLayer]
                                    .download_area && '!cursor-not-allowed'
                                }
                                title="You can only download the entire layer"
                              >
                                <input
                                  id={baseLayer}
                                  onChange={(e) =>
                                    handleLayersInputChange(
                                      e,
                                      layerClass,
                                      baseLayer,
                                    )
                                  }
                                  className={styles1.chk}
                                  type="checkbox"
                                  disabled={
                                    !listLayers[layerClass].layerNames[
                                      baseLayer
                                    ].download_area
                                  }
                                  checked={verifyIfItIsInDownloadList(
                                    layerClass,
                                    baseLayer,
                                  )}
                                  name="baseLayer"
                                  // checked={baseLayer.url === selectedBaseLayer.url}
                                />
                                <label
                                  htmlFor={baseLayer}
                                  className={`${styles1.switch} ${
                                    !listLayers[layerClass].layerNames[
                                      baseLayer
                                    ].download_area && '!cursor-not-allowed'
                                  }`}
                                  title="You can only download the entire layer"
                                >
                                  <span className={styles1.slider}></span>
                                </label>
                                <p>{baseLayer}</p>
                              </label>
                              <div id="layer-edit">
                                <div
                                  onClick={() =>
                                    setDownloadPopup({
                                      [`${layerClass}_${baseLayer}`]:
                                        listLayers[layerClass].layerNames[
                                          baseLayer
                                        ].download,
                                    })
                                  }
                                >
                                  <FontAwesomeIcon
                                    icon={faDownload}
                                    title="Download layer"
                                  />
                                </div>
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
      <div className="text-red-500 text-sm mt-1">
        {error ? <p>{error}</p> : <div className="pt-[18px]"></div>}
      </div>
      <Button
        onClick={(e) => handleSubmit(e)}
        variant="contained"
        className="!w-full !text-white !bg-black !rounded-lg opacity-50 hover:!opacity-70"
      >
        Download
      </Button>
    </LayerSelectionContainer>
  )
}
