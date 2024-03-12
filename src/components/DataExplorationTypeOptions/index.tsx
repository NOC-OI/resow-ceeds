import { useState } from 'react'
import { LayerTypeOptionsContainer } from './styles'
import {
  faChartSimple,
  faCircleInfo,
  faList,
  faMagnifyingGlass,
  faSliders,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Annotations } from '../Annotations'
import { colors, eunis } from '../../data/mbTilesEmodnetLegend'
import { organisms } from '../../data/organisms'
import { GetCOGLayer } from '../../lib/map/addGeoraster'
import { oceanR } from '../../lib/map/jsColormaps'
import styles from './DataExplorationTypeOptions.module.css'
import { defaultOpacity } from '../../lib/map/utils'

export function handleChangeOpacity(
  e: any,
  setLayerAction,
  setSelectedLayers,
  content,
  subLayer,
  subLayers,
  setActiveOpacity,
  setActualLayer,
) {
  function changeMapOpacity(layerInfo: any, opacity: number) {
    setLayerAction('opacity')
    const newSelectedLayer = layerInfo.dataInfo
    newSelectedLayer.opacity = opacity
    newSelectedLayer.zoom = true
    setSelectedLayers((selectedLayers: any) => {
      const copy = { ...selectedLayers }
      delete copy[layerInfo.subLayer]
      return { [layerInfo.subLayer]: newSelectedLayer, ...copy }
    })
  }

  const layerInfo = JSON.parse(
    JSON.stringify({
      subLayer: `${content}_${subLayer}`,
      dataInfo: subLayers[subLayer],
    }),
  )
  setActiveOpacity(layerInfo.subLayer)
  setActualLayer([layerInfo.subLayer])
  changeMapOpacity(layerInfo, e.target.value)
}

export function handleGenerateTimeSeriesGraph(
  setClickPoint: any,
  setActualLayer: any,
  subLayers: any,
  subLayer: any,
) {
  setClickPoint((clickPoint: any) => !clickPoint)
  setActualLayer([subLayers[subLayer].url])
}

export function getPreviousOpacityValue(
  content: string,
  subLayer: string,
  selectedLayers: any,
) {
  return selectedLayers[`${content}_${subLayer}`].opacity
}

export async function handleClickLegend(subLayers, subLayer, setLayerLegend) {
  if (subLayers[subLayer].data_type === 'wms') {
    const newParams = subLayers[subLayer].params
    newParams.request = 'GetLegendGraphic'
    newParams.layer = newParams.layers
    async function getURILegend(newParams: any) {
      const layerUrl = `${subLayers[subLayer].url}?`
      const response = await fetch(layerUrl + new URLSearchParams(newParams))
      const url = `${response.url}&format=image/png`
      setLayerLegend({ layerName: subLayer, url })
    }
    await getURILegend(newParams)
  } else if (subLayers[subLayer].data_type === 'MBTiles') {
    setLayerLegend({ layerName: subLayer, legend: [colors, eunis] })
  } else if (subLayers[subLayer].data_type === 'COG') {
    const getCOGLayer = new GetCOGLayer(subLayers[subLayer], subLayer, true)
    await getCOGLayer.getStats().then((stats) => {
      const minValue = stats.b1.percentile_2
      const maxValue = stats.b1.percentile_98
      const difValues = maxValue - minValue
      const times = 30
      const cogColors = []
      const cogColorsValues = []
      for (let i = 0; i < times; i++) {
        cogColors.push(oceanR((1 / (times - 1)) * i))
        cogColorsValues.push(minValue + (difValues / (times - 1)) * i)
      }
      setLayerLegend({
        layerName: subLayer,
        dataDescription: ['Depth', '(m)'],
        legend: [cogColors, cogColorsValues],
        dataType: subLayers[subLayer].data_type,
      })
    })
  }
}

export function verifyIfWasSelectedBefore(
  content: string,
  subLayer: string,
  selectedLayers: any,
) {
  return !!selectedLayers[`${content}_${subLayer}`]
}

export function handleClickLayerInfo(
  content: string,
  subLayer: string,
  setInfoButtonBox: any,
  selectedLayers: any,
) {
  setInfoButtonBox({
    title: `${content} - ${subLayer}`,
    content: selectedLayers[`${content}_${subLayer}`].content,
  })
}

export function handleClickZoom(
  content,
  subLayers,
  subLayer,
  setActualLayer,
  setActiveOpacity,
  opacityIsClicked,
  setLayerAction,
  selectedLayers,
  setSelectedLayers,
) {
  const layerInfo = JSON.parse(
    JSON.stringify({
      subLayer: `${content}_${subLayer}`,
      dataInfo: subLayers[subLayer],
    }),
  )
  setActiveOpacity(opacityIsClicked ? layerInfo.subLayer : null)
  setActualLayer([layerInfo.subLayer])
  changeMapZoom(layerInfo, setLayerAction, selectedLayers, setSelectedLayers)
}

export function handleClickSlider(setOpacityIsClicked: any) {
  setOpacityIsClicked((opacityIsClicked) => !opacityIsClicked)
}

export function handleGenerateGraph(
  setGetPolyline: any,
  setActualLayer: any,
  subLayers: any,
  subLayer: any,
) {
  setGetPolyline((getPolyline: any) => !getPolyline)
  setActualLayer([subLayers[subLayer].url])
}

export function changeMapZoom(
  layerInfo: any,
  setLayerAction: any,
  selectedLayers: any,
  setSelectedLayers: any,
) {
  setLayerAction('zoom')
  const newSelectedLayer = selectedLayers[layerInfo.subLayer]
  setSelectedLayers((selectedLayers: any) => {
    const copy = { ...selectedLayers }
    delete copy[layerInfo.subLayer]
    return { [layerInfo.subLayer]: newSelectedLayer, ...copy }
  })
}

export async function addMapLayer(
  layerInfo: any,
  setLayerAction: any,
  setSelectedLayers: any,
  selectedLayers: any,
) {
  setLayerAction('add')
  const newSelectedLayer = layerInfo.dataInfo
  newSelectedLayer.opacity = defaultOpacity
  newSelectedLayer.zoom = true
  setSelectedLayers({
    ...selectedLayers,
    [layerInfo.subLayer]: newSelectedLayer,
  })
}

export function removeMapLayer(
  layerInfo: any,
  setLayerAction: any,
  setSelectedLayers: any,
) {
  setLayerAction('remove')
  setSelectedLayers((selectedLayers: any) => {
    const copy = { ...selectedLayers }
    delete copy[layerInfo.subLayer]
    return copy
  })
}

export async function handleChangeMapLayer(
  e: any,
  setActualLayer: any,
  setOpacityIsClicked: any,
  setActiveOpacity: any,
  setLayerAction: any,
  setSelectedLayers: any,
  selectedLayers: any,
  setShowAnnotations?: any,
) {
  const layerInfo = JSON.parse(e.target.value)
  setActualLayer([layerInfo.subLayer])
  if (layerInfo.dataInfo.data_type === 'Photo') {
    if (e.target.checked) {
      layerInfo.dataInfo.show = []
      layerInfo.dataInfo.photos.forEach((photo: any) => {
        layerInfo.dataInfo.show.push(photo.filename)
      })
      layerInfo.dataInfo.plotLimits = true
      await addMapLayer(
        layerInfo,
        setLayerAction,
        setSelectedLayers,
        selectedLayers,
      )
    } else {
      if (setShowAnnotations) {
        setShowAnnotations(false)
      }
      removeMapLayer(layerInfo, setLayerAction, setSelectedLayers)
    }
  } else {
    if (e.target.checked) {
      await addMapLayer(
        layerInfo,
        setLayerAction,
        setSelectedLayers,
        selectedLayers,
      )
    } else {
      setOpacityIsClicked(false)
      setActiveOpacity(null)
      removeMapLayer(layerInfo, setLayerAction, setSelectedLayers)
    }
  }
}

interface DataExplorationTypeOptionsProps {
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
  getPolyline: any
  setGetPolyline: any
  setShowRange?: any
  setClickPoint: any
}

export function DataExplorationTypeOptions({
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
  getPolyline,
  setGetPolyline,
  setClickPoint,
}: DataExplorationTypeOptionsProps) {
  const [opacityIsClicked, setOpacityIsClicked] = useState(
    activeOpacity === `${content}_${subLayer}`,
  )

  const [showAnnotations, setShowAnnotations] = useState<boolean>(false)

  return (
    <LayerTypeOptionsContainer>
      <div id="type-option">
        <label
          key={`${content}_${subLayer}`}
          htmlFor={`${content}_${subLayer}`}
        >
          <input
            onChange={(e: any) =>
              handleChangeMapLayer(
                e,
                setActualLayer,
                setOpacityIsClicked,
                setActiveOpacity,
                setLayerAction,
                setSelectedLayers,
                selectedLayers,
                setShowAnnotations,
              )
            }
            value={JSON.stringify({
              subLayer: `${content}_${subLayer}`,
              dataInfo: subLayers[subLayer],
            })}
            className={styles.chk}
            type="checkbox"
            checked={verifyIfWasSelectedBefore(
              content,
              subLayer,
              selectedLayers,
            )}
            id={`${content}_${subLayer}`}
          />
          <label htmlFor={`${content}_${subLayer}`} className={styles.switch}>
            <span className={styles.slider}></span>
          </label>
          <p>{subLayer}</p>
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
            {!['Photo', 'GEOJSON'].includes(subLayers[subLayer].data_type) ? (
              <FontAwesomeIcon
                icon={faList}
                title="Show Legend"
                onClick={() =>
                  handleClickLegend(subLayers, subLayer, setLayerLegend)
                }
              />
            ) : null}
            {subLayers[subLayer].data_type === 'COG' ? (
              <FontAwesomeIcon
                icon={faChartSimple}
                title="Make a graph"
                onClick={() =>
                  handleGenerateGraph(
                    setGetPolyline,
                    setActualLayer,
                    subLayers,
                    subLayer,
                  )
                }
                className={getPolyline ? 'active' : ''}
              />
            ) : null}
            {subLayers[subLayer].date_range ? (
              <FontAwesomeIcon
                icon={faChartSimple}
                title="Make a graph"
                onClick={() =>
                  handleGenerateTimeSeriesGraph(
                    setClickPoint,
                    setActualLayer,
                    subLayers,
                    subLayer,
                  )
                }
              />
            ) : null}

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
            {!['Photo', 'GEOJSON'].includes(subLayers[subLayer].data_type) && (
              <FontAwesomeIcon
                icon={faSliders}
                title="Change Opacity"
                onClick={() => handleClickSlider(setOpacityIsClicked)}
              />
            )}
            {/* ) : null} */}
            {/* {subLayers[subLayer].data_type !== 'Photo' ? (
              <FontAwesomeIcon
                icon={faSliders}
                title="Change Opacity"
                onClick={handleClickSlider}
              />
            ) : (
              <FontAwesomeIcon
                icon={faSliders}
                title="Select by Annotations"
                onClick={handleClickAnnotations}
              />
            )} */}
          </div>
        ) : null}
      </div>
      {showAnnotations && (
        <Annotations
          key={`${content}_${subLayer}`}
          subLayer={subLayer}
          content={content}
          layerAction={layerAction}
          setLayerAction={setLayerAction}
          selectedLayers={selectedLayers}
          setSelectedLayers={setSelectedLayers}
          setActualLayer={setActualLayer}
          organisms={organisms}
        />
      )}
      {opacityIsClicked &&
        verifyIfWasSelectedBefore(content, subLayer, selectedLayers) && (
          <input
            type="range"
            step={0.1}
            min={0}
            max={1}
            value={getPreviousOpacityValue(content, subLayer, selectedLayers)}
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
