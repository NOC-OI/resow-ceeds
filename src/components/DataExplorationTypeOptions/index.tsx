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
import { GetTileLayer } from '../MapHome/addGeoraster'
import { oceanR } from '../MapHome/jsColormaps'
import styles from './DataExplorationTypeOptions.module.css'
import chroma from 'chroma-js'

const defaultOpacity = 0.7

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

  function changeMapZoom(layerInfo: any) {
    setLayerAction('zoom')
    const newSelectedLayer = selectedLayers[layerInfo.subLayer]
    setSelectedLayers((selectedLayers: any) => {
      const copy = { ...selectedLayers }
      delete copy[layerInfo.subLayer]
      return { [layerInfo.subLayer]: newSelectedLayer, ...copy }
    })
  }
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

  async function addMapLayer(layerInfo: any) {
    setLayerAction('add')
    const newSelectedLayer = layerInfo.dataInfo
    newSelectedLayer.opacity = defaultOpacity
    newSelectedLayer.zoom = true
    setSelectedLayers({
      ...selectedLayers,
      [layerInfo.subLayer]: newSelectedLayer,
    })
  }

  function removeMapLayer(layerInfo: any) {
    setLayerAction('remove')
    setSelectedLayers((selectedLayers: any) => {
      const copy = { ...selectedLayers }
      delete copy[layerInfo.subLayer]
      return copy
    })
  }

  function verifyIfWasSelectedBefore(content: String, subLayer: string) {
    return !!selectedLayers[`${content}_${subLayer}`]
  }

  function getPreviousOpacityValue(content: String, subLayer: string) {
    return selectedLayers[`${content}_${subLayer}`].opacity
  }

  function handleClickLayerInfo(content: String, subLayer: string) {
    setInfoButtonBox({
      title: `${content} - ${subLayer}`,
      content: selectedLayers[`${content}_${subLayer}`].content,
    })
  }

  async function handleChangeMapLayer(e: any) {
    const layerInfo = JSON.parse(e.target.value)
    setActualLayer([layerInfo.subLayer])
    if (layerInfo.dataInfo.data_type === 'Photo') {
      if (e.target.checked) {
        layerInfo.dataInfo.show = []
        layerInfo.dataInfo.photos.forEach((photo: any) => {
          layerInfo.dataInfo.show.push(photo.filename)
        })
        layerInfo.dataInfo.plotLimits = true
        await addMapLayer(layerInfo)
      } else {
        setShowAnnotations(false)
        removeMapLayer(layerInfo)
      }
    } else {
      if (e.target.checked) {
        await addMapLayer(layerInfo)
      } else {
        setOpacityIsClicked(false)
        setActiveOpacity(null)
        removeMapLayer(layerInfo)
      }
    }
  }

  function handleClickZoom() {
    const layerInfo = JSON.parse(
      JSON.stringify({
        subLayer: `${content}_${subLayer}`,
        dataInfo: subLayers[subLayer],
      }),
    )
    setActiveOpacity(opacityIsClicked ? layerInfo.subLayer : null)
    setActualLayer([layerInfo.subLayer])
    changeMapZoom(layerInfo)
  }

  function linspace(start: number, stop: number, num: number, endpoint = true) {
    const div = endpoint ? num - 1 : num
    const step = (stop - start) / div
    return Array.from({ length: num }, (_, i) => start + step * i)
  }

  async function handleClickLegend() {
    if (subLayers[subLayer].data_type === 'wms') {
      const newParams = subLayers[subLayer].params
      newParams.request = 'GetLegendGraphic'
      newParams.layer = newParams.layers
      async function getURILegend(newParams: any) {
        const layerUrl = `${subLayers[subLayer].url}?`
        const response = await fetch(layerUrl + new URLSearchParams(newParams))
        const url = response.url
        setLayerLegend({ layerName: subLayer, url })
      }
      await getURILegend(newParams)
    } else if (subLayers[subLayer].data_type === 'MBTiles') {
      setLayerLegend({ layerName: subLayer, legend: [colors, eunis] })
    } else if (subLayers[subLayer].data_type === 'COG') {
      const getCOGLayer = new GetTileLayer(subLayers[subLayer], subLayer, true)
      await getCOGLayer.getStats().then(function () {
        const minValue = getCOGLayer.stats.b1.percentile_2
        const maxValue = getCOGLayer.stats.b1.percentile_98
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
    } else if (subLayers[subLayer].data_type === 'GTIFF') {
      if (subLayers[subLayer].layer_type === 'suitability') {
        const values = subLayers[subLayer].scale
        const scale = subLayers[subLayer].colors
        setLayerLegend({
          layerName: subLayer,
          dataDescription: ['', subLayers[subLayer].units],
          legend: [scale, values],
          dataType: subLayers[subLayer].data_type,
        })
      } else {
        const times = 10
        const layerScale = subLayers[subLayer].scale
        const values = linspace(layerScale[0], layerScale[1], times)
        const scale = []
        const colorScale = chroma
          .scale(subLayers[subLayer].colors)
          .domain([0, times - 1])
        for (let i = 0; i < times; i++) {
          scale.push(colorScale(i).hex())
        }
        setLayerLegend({
          layerName: subLayer,
          dataDescription: ['', subLayers[subLayer].units],
          legend: [scale, values],
          dataType: subLayers[subLayer].data_type,
        })
      }
    }
  }

  function handleClickSlider() {
    setOpacityIsClicked((opacityIsClicked) => !opacityIsClicked)
  }

  function handleChangeOpacity(e: any) {
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

  function handleGenerateGraph() {
    setGetPolyline((getPolyline: any) => !getPolyline)
    setActualLayer([subLayers[subLayer].url])
  }

  function handleGenerateTimeSeriesGraph() {
    setClickPoint((clickPoint: any) => !clickPoint)
    setActualLayer([subLayers[subLayer].url])
  }

  return (
    <LayerTypeOptionsContainer>
      <div id="type-option">
        <label
          key={`${content}_${subLayer}`}
          htmlFor={`${content}_${subLayer}`}
        >
          <input
            onChange={handleChangeMapLayer}
            value={JSON.stringify({
              subLayer: `${content}_${subLayer}`,
              dataInfo: subLayers[subLayer],
            })}
            className={styles.chk}
            type="checkbox"
            checked={verifyIfWasSelectedBefore(content, subLayer)}
            id={`${content}_${subLayer}`}
          />
          <label htmlFor={`${content}_${subLayer}`} className={styles.switch}>
            <span className={styles.slider}></span>
          </label>
          <p>{subLayer}</p>
        </label>
        {verifyIfWasSelectedBefore(content, subLayer) ? (
          <div id="layer-edit">
            <FontAwesomeIcon
              id="info-subsection-button"
              icon={faCircleInfo}
              title={'Show Layer Info'}
              onClick={() => handleClickLayerInfo(content, subLayer)}
            />
            {![subLayers[subLayer].data_type].includes(['Photo', 'GEOJSON']) ? (
              <FontAwesomeIcon
                icon={faList}
                title="Show Legend"
                onClick={handleClickLegend}
              />
            ) : null}
            {subLayers[subLayer].data_type === 'COG' ? (
              <FontAwesomeIcon
                icon={faChartSimple}
                title="Make a graph"
                onClick={handleGenerateGraph}
                className={getPolyline ? 'active' : ''}
              />
            ) : null}
            {subLayers[subLayer].date_range &&
            subLayers[subLayer].layer_type !== 'suitability' ? (
              <FontAwesomeIcon
                icon={faChartSimple}
                title="Make a graph"
                onClick={handleGenerateTimeSeriesGraph}
              />
            ) : null}

            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              title="Zoom to the layer"
              onClick={handleClickZoom}
            />
            {/* {subLayers[subLayer].data_type !== 'Photo' ? ( */}
            <FontAwesomeIcon
              icon={faSliders}
              title="Change Opacity"
              onClick={handleClickSlider}
            />
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
      {opacityIsClicked && verifyIfWasSelectedBefore(content, subLayer) && (
        <input
          type="range"
          step={0.1}
          min={0}
          max={1}
          value={getPreviousOpacityValue(content, subLayer)}
          onChange={handleChangeOpacity}
        />
      )}
    </LayerTypeOptionsContainer>
  )
}
