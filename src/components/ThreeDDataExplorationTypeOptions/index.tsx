import { useState } from 'react'
import { LayerTypeOptionsContainer } from '../DataExplorationTypeOptions/styles'
import {
  faCircleInfo,
  faCube,
  faDownload,
  faList,
  faLock,
  faMagnifyingGlass,
  faSliders,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { colors, eunis } from '../../lib/data/mbTilesEmodnetLegend'
import { getUser } from '../../lib/auth'
import {
  getPreviousOpacityValue,
  handleChangeMapLayerAndAddLegend,
  handleChangeOpacity,
  handleClickLayerInfo,
  handleClickLegend,
  handleClickSlider,
  handleClickZoom,
  verifyIfWasSelectedBefore,
} from '../DataExplorationTypeOptions'
import styles from '../DataExplorationTypeOptions/DataExplorationTypeOptions.module.css'
import { ConfirmationDialog } from '../ConfirmationDialog'

interface ThreeDDataExplorationTypeOptionsProps {
  content: any
  subLayer: any
  setActualLayer: any
  subLayers: any
  layerLegend: any
  setLayerLegend: any
  layerAction: any
  setLayerAction: any
  selectedLayers: any
  setSelectedLayers: any
  setInfoButtonBox: any
  isLogged?: any
  threeD: any
  setThreeD: any
  setDownloadPopup?: any
}

export function ThreeDDataExplorationTypeOptions({
  content,
  subLayer,
  setActualLayer,
  subLayers,
  layerLegend,
  setLayerLegend,
  layerAction,
  setLayerAction,
  selectedLayers,
  setSelectedLayers,
  setInfoButtonBox,
  isLogged,
  threeD,
  setThreeD,
  setDownloadPopup,
}: ThreeDDataExplorationTypeOptionsProps) {
  const [opacityIsClicked, setOpacityIsClicked] = useState(false)
  const [threeDLayer, setThreeDLayer] = useState({})
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleConfirm = () => {
    const layer: any = threeDLayer
    setIsModalOpen(false)

    setThreeDLayer(null)
    setThreeD((threeD) => {
      return threeD?.subLayer === layer?.subLayer ? null : layer
    })
  }

  const handleClose = () => {
    setIsModalOpen(false)

    setThreeDLayer(null)
  }

  let user: any | null = null
  if (isLogged) {
    user = getUser()
  }

  async function handleAddTerrainLayer() {
    const layerInfo = JSON.parse(
      JSON.stringify({
        subLayer: `${content}_${subLayer}`,
        dataInfo: subLayers[subLayer],
      }),
    )
    if (threeD?.subLayer === `${content}_${subLayer}`) {
      setThreeD(null)
      return
    }
    setThreeDLayer(layerInfo)
    setIsModalOpen(true)
  }
  return (
    <LayerTypeOptionsContainer>
      <div
        id="type-option"
        className={
          user?.access
            ? ''
            : subLayers[subLayer].protected
            ? 'cursor-not-allowed'
            : ''
        }
      >
        <label
          key={`${content}_${subLayer}`}
          htmlFor={`${content}_${subLayer}`}
        >
          <input
            className={styles.chk}
            onChange={(e: any) =>
              handleChangeMapLayerAndAddLegend(
                e,
                setActualLayer,
                setOpacityIsClicked,
                setLayerAction,
                setSelectedLayers,
                selectedLayers,
                subLayers,
                subLayer,
                setLayerLegend,
                layerLegend,
                content,
              )
            }
            value={JSON.stringify({
              subLayer: `${content}_${subLayer}`,
              dataInfo: subLayers[subLayer],
            })}
            type="checkbox"
            checked={verifyIfWasSelectedBefore(
              content,
              subLayer,
              selectedLayers,
            )}
            id={`${content}_${subLayer}`}
            disabled={user?.access ? false : !!subLayers[subLayer].protected}
          />
          <label htmlFor={`${content}_${subLayer}`} className={styles.switch}>
            <span className={styles.slider}></span>
          </label>
          <p>{subLayer}</p>
          {user?.access ? null : subLayers[subLayer].protected ? (
            <FontAwesomeIcon
              icon={faLock}
              title={'You are not authorized to access this information.'}
              className="pb-0.5"
              style={{ cursor: 'help' }}
            />
          ) : null}
        </label>
        {verifyIfWasSelectedBefore(content, subLayer, selectedLayers) ? (
          <div id="layer-edit">
            <FontAwesomeIcon
              id="info-subsection-button"
              icon={faCircleInfo}
              title={'Show Layer Info'}
              onClick={() =>
                handleClickLayerInfo(
                  content,
                  subLayer,
                  setInfoButtonBox,
                  selectedLayers,
                )
              }
            />
            {!['Photo', 'GeoJSON'].includes(subLayers[subLayer].dataType) ? (
              <FontAwesomeIcon
                icon={faList}
                title="Show Legend"
                onClick={() =>
                  handleClickLegend(
                    subLayers,
                    subLayer,
                    setLayerLegend,
                    content,
                  )
                }
              />
            ) : null}
            {subLayers[subLayer].assetId && (
              <FontAwesomeIcon
                icon={faCube}
                title="Add 3D terrain to the Map"
                onClick={handleAddTerrainLayer}
                className={
                  threeD?.subLayer === `${content}_${subLayer}` ? 'active' : ''
                }
              />
            )}
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              title="Zoom to the layer"
              onClick={() =>
                handleClickZoom(
                  content,
                  subLayers,
                  subLayer,
                  setActualLayer,
                  setLayerAction,
                  selectedLayers,
                  setSelectedLayers,
                )
              }
            />
            <FontAwesomeIcon
              icon={faSliders}
              title="Change Opacity"
              onClick={() => handleClickSlider(setOpacityIsClicked)}
            />
            {subLayers[subLayer].download && (
              <div
                onClick={() =>
                  setDownloadPopup({
                    [`${content}_${subLayer}`]: subLayers[subLayer].download,
                  })
                }
              >
                <FontAwesomeIcon icon={faDownload} title="Download layer" />
              </div>
            )}
          </div>
        ) : null}
      </div>
      {opacityIsClicked &&
        verifyIfWasSelectedBefore(content, subLayer, selectedLayers) && (
          <input
            type="range"
            step={0.1}
            min={0}
            max={1}
            value={getPreviousOpacityValue(
              `${content}_${subLayer}`,
              selectedLayers,
            )}
            onChange={(e) =>
              handleChangeOpacity(
                e,
                setLayerAction,
                setSelectedLayers,
                content,
                subLayer,
                subLayers,
                setActualLayer,
              )
            }
          />
        )}
      {isModalOpen && (
        <ConfirmationDialog
          onClose={handleClose}
          onConfirm={handleConfirm}
          message={
            'The 3d visualisation consumes a lot of memory and may slow down your browser. Do you want to continue?'
          }
        />
      )}
    </LayerTypeOptionsContainer>
  )
}
