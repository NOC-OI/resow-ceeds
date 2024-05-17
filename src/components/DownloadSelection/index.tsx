/* eslint-disable no-multi-str */
// import { Info } from 'phosphor-react'
import styles from '../DataExplorationSelection/DataExplorationSelection.module.css'
import { LayerSelectionContainer } from '../DataExplorationSelection/styles'
import { LayersListDownload } from '../LayersListDownload'
import HighlightAltIcon from '@mui/icons-material/HighlightAlt'
import { ButtonIcon, CssTextField } from './styles'
import React, { useEffect } from 'react'
import { useContextHandle } from '../../lib/contextHandle'
import { useDownloadManagementHandle } from '../../lib/data/downloadManagement'

interface DownloadSelectionProps {
  selectedLayers: any
  listLayers: any
  setDownloadPopup: any
}

export function DownloadSelection({
  selectedLayers,
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
      <p className="text-lg font-bold text-white mb-2 text-center">
        Selected Layers
      </p>
      <LayersListDownload
        listLayers={listLayers}
        setDownloadPopup={setDownloadPopup}
        selectedLayers={selectedLayers}
      />
    </LayerSelectionContainer>
  )
}
