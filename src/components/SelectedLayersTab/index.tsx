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
  faDownload,
  faGripVertical,
  faList,
  faMagnifyingGlass,
  faSliders,
} from '@fortawesome/free-solid-svg-icons'

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
}: SelectedLayersTabProps) {
  const [opacityIsClicked, setOpacityIsClicked] = useState('')

  // const columnMap = Object.keys(columns) as Array<ColumnType>

  // const draggedTodoItem = React.useRef<any>(null)

  // const handleAddTodo = () => {
  //   const todoPayload: TodoType = {
  //     id: uuidv4(),
  //     title: todoTitle,
  //     column: 'incomplete',
  //     sortIndex: todos[todos.length + 1]?.sortIndex || todos.length + 1,
  //   }
  //   setTodos([...todos, todoPayload])
  // }

  // const handleColumnDrop = (column: ColumnType) => {
  //   const index = todos.findIndex((todo) => todo.id === draggedTodoItem.current)
  //   const tempTodos = [...todos]
  //   tempTodos[index].column = column
  //   setTodos(tempTodos)
  // }

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
          <p className="text-lg font-bold text-white mb-2 text-center">
            Selected Layers
          </p>
          {Object.keys(selectedLayers).length === 0 ? (
            <div className="">
              <p className="text-sm text-white text-center">
                No layers selected
              </p>
            </div>
          ) : (
            Object.keys(selectedLayers).map((layer: any, index: number) => (
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
                                    listLayers[layer.split('_')[0]].layerNames,
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
                                    listLayers[layer.split('_')[0]].layerNames[
                                      layer.split('_')[1]
                                    ],
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
                                    listLayers[layer.split('_')[0]].layerNames,
                                    layer.split('_')[1],
                                    setLayerLegend,
                                    layer.split('_')[0],
                                    selectedLayers,
                                  )
                                }
                              />
                            ) : null}
                            {selectedLayers[layer].dataType === 'COG' ? (
                              <FontAwesomeIcon
                                icon={faChartSimple}
                                title="Make a graph"
                                onClick={() =>
                                  handleGenerateGraph(
                                    setGetPolyline,
                                    setActualLayer,
                                    listLayers[layer.split('_')[0]].layerNames,
                                    layer.split('_')[1],
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
                                    listLayers[layer.split('_')[0]].layerNames,
                                    layer.split('_')[1],
                                  )
                                }
                              />
                            ) : null}

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
                      </LayerTypeOptionsContainer>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </CalcTypeContainer>
      </LayerTypes>
    </LayerSelectionContainer>
  )
}
