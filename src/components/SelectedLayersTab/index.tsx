/* eslint-disable no-multi-str */
import { useRef, useState } from 'react'
import { CalcTypeContainer } from '../DataExplorationType/styles'
import styles from '../DataExplorationTypeOptions/DataExplorationTypeOptions.module.css'
import { LayerTypeOptionsContainer } from '../DataExplorationTypeOptions/styles'
import {
  LayerSelectionContainer,
  LayerTypes,
} from '../DataExplorationSelection/styles'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  getPreviousOpacityValue,
  handleChangeMapLayerAndAddLegend,
  handleChangeOpacity,
  handleClickLayerInfo,
  handleClickLegend,
  handleClickZoom,
  handleGenerateGraph,
  handleGenerateTimeSeriesGraph,
  verifyIfWasSelectedBefore,
} from '../DataExplorationTypeOptions'
import {
  faChartSimple,
  faChevronDown,
  faChevronUp,
  faCircleInfo,
  faCube,
  faDownload,
  faGripVertical,
  faList,
  faMagnifyingGlass,
  faSliders,
} from '@fortawesome/free-solid-svg-icons'
import { ButtonIcon } from '../DownloadSelection/styles'
import { ConfirmationDialog } from '../ConfirmationDialog'

interface SelectedLayersTabProps {
  selectedLayers: object
  setSelectedLayers: any
  actualLayer: string[]
  setActualLayer: any
  layerAction: string
  setLayerAction: any
  layerLegend: any
  setLayerLegend: any
  setInfoButtonBox?: any
  listLayers?: any
  getPolyline?: any
  setGetPolyline?: any
  setClickPoint: any
  setDownloadPopup?: any
  graphLimits?: any
  setGraphLimits?: any
  setGraphColumns?: any
  polylineOnMap?: any
  threeDLayer?: any
  setThreeDLayer?: any
  threeD?: any
  setThreeD?: any
}

export function SelectedLayersTab({
  selectedLayers,
  setSelectedLayers,
  actualLayer,
  setActualLayer,
  layerAction,
  setLayerAction,
  layerLegend,
  setLayerLegend,
  setInfoButtonBox,
  listLayers,
  getPolyline,
  setGetPolyline,
  setClickPoint,
  setDownloadPopup,
  graphLimits,
  setGraphLimits,
  setGraphColumns,
  polylineOnMap,
  threeDLayer,
  setThreeDLayer,
  threeD,
  setThreeD,
}: SelectedLayersTabProps) {
  const [opacityIsClicked, setOpacityIsClicked] = useState('')
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

  async function handleAddTerrainLayer(layer: any) {
    const layerInfo = JSON.parse(
      JSON.stringify({
        subLayer: layer,
        dataInfo: selectedLayers[layer],
      }),
    )
    if (threeD?.subLayer === layer) {
      setThreeD(null)
      return
    }
    setThreeDLayer(layerInfo)
    setIsModalOpen(true)
  }
  function handleClickSliderLayersSelected(
    setOpacityIsClicked: any,
    layer: any,
  ) {
    setOpacityIsClicked((opacityIsClicked) => {
      if (opacityIsClicked === layer) {
        return ''
      } else {
        return layer
      }
    })
  }

  function handleSort() {
    const keys = Object.keys(selectedLayers)
    const draggedItemContent = keys.splice(dragItem.current, 1)[0]
    keys.splice(dragOverItem.current, 0, draggedItemContent)
    const newSelectedLayers = {}
    keys.forEach((key, index) => {
      newSelectedLayers[key] = selectedLayers[key]
      newSelectedLayers[key].order = keys.length - index
    })

    setLayerAction('sort')
    setSelectedLayers(newSelectedLayers)
  }

  function changeOrder(direction, index) {
    const keys = Object.keys(selectedLayers)
    const draggedItemContent = keys.splice(index, 1)[0]
    if (direction === 'up') {
      keys.splice(index - 1, 0, draggedItemContent)
    } else {
      keys.splice(index + 1, 0, draggedItemContent)
    }
    const newSelectedLayers = {}
    keys.forEach((key, index) => {
      newSelectedLayers[key] = selectedLayers[key]
      newSelectedLayers[key].order = keys.length - index
    })
    setLayerAction('sort')
    setSelectedLayers(newSelectedLayers)
  }
  const dragItem = useRef<any>()
  const dragOverItem = useRef<any>()
  const rout = window.location.pathname

  return (
    <LayerSelectionContainer className={styles.fade_in}>
      <LayerTypes>
        <CalcTypeContainer>
          <p className="text-lg font-bold text-white mb-0 text-center">
            Selected Layers
          </p>
          {Object.keys(selectedLayers).length === 0 ? (
            <div className="">
              <p className="text-sm text-white text-center">
                No layers selected
              </p>
            </div>
          ) : (
            <div>
              {rout === '/' && (
                <div className="flex justify-end gap-2 pb-2 items-center">
                  <p className="pt-3 text-sm font-bold text-white mb-2 text-right p-1">
                    Choose plot points
                  </p>
                  <div className="flex justify-center items-center">
                    <ButtonIcon
                      title="Select map points, then click the graph icon in each layer"
                      className="hover:shadow-whi hover:opacity-60 hover:shadow-sm shadow-black opacity-100 shadow-md"
                      onClick={() => setGetPolyline(!getPolyline)}
                    >
                      <FontAwesomeIcon
                        icon={faChartSimple}
                        title="Select map points, then click the graph icon in each layer"
                        className={getPolyline ? 'active' : ''}
                      />
                    </ButtonIcon>
                  </div>
                </div>
              )}

              {Object.keys(selectedLayers).map((layer: any, index: number) => (
                <div
                  draggable={rout !== '/3d'}
                  key={index}
                  className={`${
                    rout !== '/3d' && 'cursor-move'
                  } box-border shadow-custom border-white py-3 px-1`}
                  onDragStart={(e) => (dragItem.current = index)}
                  onDragEnter={(e) => (dragOverItem.current = index)}
                  onDragEnd={rout !== '/3d' ? handleSort : null}
                  onDragOver={(e) => e.preventDefault()}
                >
                  <div className="flex gap-2">
                    {rout !== '/3d' && (
                      <div
                        className="flex flex-col items-center justify-center p-0 !gap-3"
                        style={{ color: '#D49511' }}
                      >
                        {index !== 0 && (
                          <FontAwesomeIcon
                            icon={faChevronUp}
                            onClick={() => changeOrder('up', index)}
                            className="!cursor-pointer"
                          />
                        )}
                        {index !== Object.keys(selectedLayers).length - 1 && (
                          <FontAwesomeIcon
                            icon={faChevronDown}
                            onClick={() => changeOrder('down', index)}
                            className="!cursor-pointer"
                          />
                        )}
                      </div>
                    )}
                    <div className="flex-1">
                      <div
                        className={
                          rout !== '/3d' ? '!cursor-move' : '!cursor-default'
                        }
                      >
                        <header
                          id="general-types"
                          style={{ color: '#D49511' }}
                          className={
                            rout !== '/3d' ? '!cursor-move' : '!cursor-default'
                          }
                        >
                          <span>
                            <FontAwesomeIcon icon={faGripVertical} />
                          </span>
                          <p>{layer.split('_')[0]}</p>
                        </header>
                      </div>
                      <div className="flex flex-col gap-1 pt-1">
                        <LayerTypeOptionsContainer key={index}>
                          <div id="type-option">
                            <div className="flex items-center justify-start">
                              <label
                                key={`${layer.split('_')[0]}_${
                                  layer.split('_')[1]
                                }`}
                                htmlFor={`${layer.split('_')[0]}_${
                                  layer.split('_')[1]
                                }`}
                              >
                                <input
                                  onChange={(e: any) =>
                                    handleChangeMapLayerAndAddLegend(
                                      e,
                                      setActualLayer,
                                      setOpacityIsClicked,
                                      setLayerAction,
                                      setSelectedLayers,
                                      selectedLayers,
                                      listLayers[layer.split('_')[0]]
                                        .layerNames,
                                      layer.split('_')[1],
                                      setLayerLegend,
                                      layerLegend,
                                      layer.split('_')[0],
                                    )
                                  }
                                  value={JSON.stringify({
                                    subLayer: `${layer.split('_')[0]}_${
                                      layer.split('_')[1]
                                    }`,
                                    dataInfo:
                                      listLayers[layer.split('_')[0]]
                                        .layerNames[layer.split('_')[1]],
                                  })}
                                  className={styles.chk}
                                  type="checkbox"
                                  checked={verifyIfWasSelectedBefore(
                                    layer.split('_')[0],
                                    layer.split('_')[1],
                                    selectedLayers,
                                  )}
                                  id={`${layer}`}
                                />
                                <label
                                  htmlFor={`${layer}`}
                                  className={styles.switch}
                                >
                                  <span className={styles.slider}></span>
                                </label>
                                <p>{layer.split('_')[1]}</p>
                              </label>
                            </div>
                            <div id="layer-edit">
                              <FontAwesomeIcon
                                id="info-subsection-button"
                                icon={faCircleInfo}
                                title={'Show Layer Info'}
                                onClick={() =>
                                  handleClickLayerInfo(
                                    layer.split('_')[0],
                                    layer.split('_')[1],
                                    setInfoButtonBox,
                                    selectedLayers,
                                  )
                                }
                              />
                              {!['Photo'].includes(
                                selectedLayers[layer].dataType,
                              ) ? (
                                <FontAwesomeIcon
                                  icon={faList}
                                  title="Show Legend"
                                  onClick={() =>
                                    handleClickLegend(
                                      listLayers[layer.split('_')[0]]
                                        .layerNames,
                                      layer.split('_')[1],
                                      setLayerLegend,
                                      layer.split('_')[0],
                                      selectedLayers,
                                    )
                                  }
                                />
                              ) : null}
                              {selectedLayers[layer].graph && rout === '/' ? (
                                <FontAwesomeIcon
                                  icon={faChartSimple}
                                  title="Make a graph"
                                  onClick={() =>
                                    handleGenerateGraph(
                                      polylineOnMap,
                                      graphLimits,
                                      setGraphLimits,
                                      setGraphColumns,
                                      setGetPolyline,
                                      setActualLayer,
                                      listLayers[layer.split('_')[0]]
                                        .layerNames,
                                      layer.split('_')[1],
                                      false,
                                    )
                                  }
                                  className={getPolyline ? 'active' : ''}
                                />
                              ) : null}
                              {selectedLayers[layer].date_range ? (
                                <FontAwesomeIcon
                                  icon={faChartSimple}
                                  title="Make a graph"
                                  onClick={() =>
                                    handleGenerateTimeSeriesGraph(
                                      setClickPoint,
                                      setActualLayer,
                                      listLayers[layer.split('_')[0]]
                                        .layerNames,
                                      layer.split('_')[1],
                                    )
                                  }
                                />
                              ) : null}
                              {selectedLayers[layer].assetId && (
                                <FontAwesomeIcon
                                  icon={faCube}
                                  title="Add 3D terrain to the Map"
                                  onClick={() => handleAddTerrainLayer(layer)}
                                  className={
                                    threeD?.subLayer === layer ? 'active' : ''
                                  }
                                />
                              )}
                              <FontAwesomeIcon
                                icon={faMagnifyingGlass}
                                title="Zoom to the layer"
                                onClick={() =>
                                  handleClickZoom(
                                    layer.split('_')[0],
                                    listLayers[layer.split('_')[0]].layerNames,
                                    layer.split('_')[1],
                                    setActualLayer,
                                    setLayerAction,
                                    selectedLayers,
                                    setSelectedLayers,
                                  )
                                }
                              />
                              {!['Photo'].includes(
                                selectedLayers[layer].dataType,
                              ) && (
                                <FontAwesomeIcon
                                  icon={faSliders}
                                  title="Change Opacity"
                                  onClick={() =>
                                    handleClickSliderLayersSelected(
                                      setOpacityIsClicked,
                                      layer,
                                    )
                                  }
                                />
                              )}
                              {listLayers[layer.split('_')[0]].layerNames[
                                layer.split('_')[1]
                              ].download && (
                                <div
                                  onClick={() =>
                                    setDownloadPopup({
                                      [`${layer}`]:
                                        listLayers[layer.split('_')[0]]
                                          .layerNames[layer.split('_')[1]]
                                          .download,
                                    })
                                  }
                                >
                                  <FontAwesomeIcon
                                    icon={faDownload}
                                    title="Download layer"
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                          {opacityIsClicked === layer &&
                            verifyIfWasSelectedBefore(
                              layer.split('_')[0],
                              layer.split('_')[1],
                              selectedLayers,
                            ) && (
                              <input
                                type="range"
                                step={0.1}
                                min={0}
                                max={1}
                                value={getPreviousOpacityValue(
                                  layer,
                                  selectedLayers,
                                )}
                                onDragStart={(e) => e.stopPropagation()}
                                onChange={(e) =>
                                  handleChangeOpacity(
                                    e,
                                    setLayerAction,
                                    setSelectedLayers,
                                    layer.split('_')[0],
                                    layer.split('_')[1],
                                    listLayers[layer.split('_')[0]].layerNames,
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
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CalcTypeContainer>
      </LayerTypes>
    </LayerSelectionContainer>
  )
}
