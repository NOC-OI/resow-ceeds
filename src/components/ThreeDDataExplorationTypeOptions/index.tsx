import { useState } from 'react'
import { LayerTypeOptionsContainer } from '../DataExplorationTypeOptions/styles'
import {
  faCircleInfo,
  faCube,
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
  handleChangeMapLayer,
  handleChangeOpacity,
  handleClickLayerInfo,
  handleClickLegend,
  handleClickSlider,
  handleClickZoom,
  verifyIfWasSelectedBefore,
} from '../DataExplorationTypeOptions'
import styles from '../DataExplorationTypeOptions/DataExplorationTypeOptions.module.css'

interface ThreeDDataExplorationTypeOptionsProps {
  content: any
  subLayer: any
  activeOpacity: any
  setActiveOpacity: any
  setActualLayer: any
  subLayers: any
  setLayerLegend: any
  layerAction: any
  setLayerAction: any
  selectedLayers: any
  setSelectedLayers: any
  setInfoButtonBox: any
  isLogged?: any
  threeD: any
  setThreeD: any
}

export function ThreeDDataExplorationTypeOptions({
  content,
  subLayer,
  activeOpacity,
  setActiveOpacity,
  setActualLayer,
  subLayers,
  setLayerLegend,
  layerAction,
  setLayerAction,
  selectedLayers,
  setSelectedLayers,
  setInfoButtonBox,
  isLogged,
  threeD,
  setThreeD,
}: ThreeDDataExplorationTypeOptionsProps) {
  const [opacityIsClicked, setOpacityIsClicked] = useState(
    activeOpacity === `${content}_${subLayer}`,
  )

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
    setThreeD((threeD) => {
      return threeD?.subLayer === layerInfo.subLayer ? null : layerInfo
    })
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
              handleChangeMapLayer(
                e,
                setActualLayer,
                setOpacityIsClicked,
                setActiveOpacity,
                setLayerAction,
                setSelectedLayers,
                selectedLayers,
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
            {['COG'].includes(subLayers[subLayer].dataType) && (
              <FontAwesomeIcon
                icon={faCube}
                title="Add 3D terrain to the Map"
                onClick={handleAddTerrainLayer}
                className={
                  threeD?.subLayer === `${content}_${subLayer}`
                    ? 'active'
                    : 'aaa'
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
                  setActiveOpacity,
                  opacityIsClicked,
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
                setActiveOpacity,
                setActualLayer,
              )
            }
          />
        )}
    </LayerTypeOptionsContainer>
  )
}
