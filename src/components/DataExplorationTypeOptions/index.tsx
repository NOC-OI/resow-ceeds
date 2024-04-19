import { useState } from 'react'
import { LayerTypeOptionsContainer } from './styles'
import {
  faChartSimple,
  faCircleInfo,
  faDownload,
  faList,
  faMagnifyingGlass,
  faSliders,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { GetCOGLayer, GetTifLayer } from '../../lib/map/addGeoraster'
import { colorScaleByName } from '../../lib/map/jsColormaps'
import styles from './DataExplorationTypeOptions.module.css'
import { defaultOpacity } from '../../lib/map/utils'
import chroma from 'chroma-js'

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

export function getPreviousOpacityValue(content: string, selectedLayers: any) {
  return selectedLayers[content].opacity
}

export async function handleClickLegend(
  subLayers,
  subLayer,
  setLayerLegend,
  content,
  selectedLayers?,
) {
  if (subLayers[subLayer].dataType === 'WMS') {
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
  } else if (subLayers[subLayer].dataType === 'MBTiles') {
    setLayerLegend({
      layerName: subLayer,
      legend: [[subLayers[subLayer].colors], [subLayer]],
    })
  } else if (subLayers[subLayer].dataType === 'FGB') {
    console.log('legend', subLayers[subLayer].colors)
    setLayerLegend({
      layerName: subLayer,
      legend: [[subLayers[subLayer].colors], [subLayer]],
    })
  } else if (subLayers[subLayer].dataType === 'COG') {
    let scale
    if (!selectedLayers) {
      if (typeof subLayers[subLayer].url === 'string') {
        const getCOGLayer = new GetCOGLayer(subLayers[subLayer], subLayer, true)
        await getCOGLayer.getStats().then((stats) => {
          const minValue = stats.b1.percentile_2.toFixed(4)
          const maxValue = stats.b1.percentile_98.toFixed(4)
          scale = [minValue, maxValue]
        })
      } else {
        let minValue
        let maxValue
        scale = await Promise.all(
          await subLayers[subLayer].url.map(async (newUrl) => {
            const newSubLayer = { ...subLayers[subLayer] }
            newSubLayer.url = newUrl
            const getCOGLayer = new GetCOGLayer(newSubLayer, subLayer, true)
            const stats = await getCOGLayer.getStats()
            if (minValue) {
              if (minValue > stats.b1.percentile_2.toFixed(4)) {
                minValue = stats.b1.percentile_2.toFixed(4)
              }
            } else {
              minValue = stats.b1.percentile_2.toFixed(4)
            }
            if (maxValue) {
              if (maxValue < stats.b1.percentile_98.toFixed(4)) {
                maxValue = stats.b1.percentile_98.toFixed(4)
              }
            } else {
              maxValue = stats.b1.percentile_98.toFixed(4)
            }
            return [minValue, maxValue]
          }),
        )
        scale = scale[0]
      }
    } else {
      scale = selectedLayers[`${content}_${subLayer}`].scale
    }
    const difValues = scale[1] - scale[0]
    const times = 30
    const cogColors = []
    const cogColorsValues = []

    // console.log('XXXXXXXX', selectedLayers[`${content}_${subLayer}`])
    //   'colorScale',
    //   selectedLayers
    //     ? selectedLayers[`${content}_${subLayer}`].colors
    //     : subLayers[subLayer].colors
    //     ? subLayers[subLayer].colors
    //     : 'ocean_r',
    // )
    const colorName = selectedLayers
      ? selectedLayers[`${content}_${subLayer}`].colors
      : subLayers[subLayer].colors
      ? subLayers[subLayer].colors
      : 'ocean_r'
    const colorScale = colorScaleByName(colorName)
    for (let i = 0; i < times; i++) {
      cogColors.push(colorScale((1 / (times - 1)) * i))
      cogColorsValues.push(Number(scale[0]) + (difValues / (times - 1)) * i)
    }
    setLayerLegend({
      layerName: subLayer,
      layerInfo: { ...subLayers[subLayer], colors: colorName },
      selectedLayersKey: `${content}_${subLayer}`,
      scale,
      dataDescription: subLayers[subLayer].dataDescription,
      legend: [cogColors, cogColorsValues],
      dataType: subLayers[subLayer].dataType,
    })
  } else if (subLayers[subLayer].dataType === 'GeoTIFF') {
    let scale
    if (!selectedLayers) {
      if (subLayers[subLayer].scale) {
        scale = subLayers[subLayer].scale
      } else {
        const tifData = new GetTifLayer(subLayers[subLayer].url)
        await tifData.loadGeo()
        scale = [tifData.stats[0].min, tifData.stats[0].max]
      }
    } else {
      scale = selectedLayers[`${content}_${subLayer}`].scale
    }

    const difValues = scale[1] - scale[0]
    const times = 30
    const cogColors = []
    const cogColorsValues = []
    let scaleColor
    const colors = selectedLayers
      ? selectedLayers[`${content}_${subLayer}`].colors
      : subLayers[subLayer].colors
    if (typeof colors === 'string') {
      scaleColor = colorScaleByName(colors)
      for (let i = 0; i < times; i++) {
        cogColors.push(scaleColor((1 / (times - 1)) * i))
        cogColorsValues.push(Number(scale[0]) + (difValues / (times - 1)) * i)
      }
    } else {
      scaleColor = chroma.scale(colors).domain(scale)
      for (let i = 0; i < times; i++) {
        const color = scaleColor((1 / (times - 1)) * i)
        cogColors.push([color._rgb[0], color._rgb[1], color._rgb[2]])
        cogColorsValues.push(Number(scale[0]) + (difValues / (times - 1)) * i)
      }
    }
    setLayerLegend({
      layerName: subLayer,
      layerInfo: subLayers[subLayer],
      selectedLayersKey: `${content}_${subLayer}`,
      scale,
      dataDescription: subLayers[subLayer].dataDescription,
      legend: [cogColors, cogColorsValues],
      dataType: subLayers[subLayer].dataType,
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
  if (newSelectedLayer.dataType === 'COG') {
    if (typeof newSelectedLayer.url === 'string') {
      const getCOGLayer = new GetCOGLayer(newSelectedLayer, undefined, true)
      await getCOGLayer.getStats().then((stats) => {
        const minValue = stats.b1.percentile_2
        const maxValue = stats.b1.percentile_98
        newSelectedLayer.scale = [minValue, maxValue]
      })
    } else {
      const minValue = []
      const maxValue = []
      newSelectedLayer.url.forEach(async (individualUrl: any) => {
        const individualLayer = { ...newSelectedLayer }
        individualLayer.url = individualUrl
        const getCOGLayer = new GetCOGLayer(individualLayer, undefined, true)
        await getCOGLayer.getStats().then((stats) => {
          minValue.push(stats.b1.percentile_2)
          maxValue.push(stats.b1.percentile_98)
        })
        newSelectedLayer.scale = [Math.min(...minValue), Math.max(...maxValue)]
      })
    }
    newSelectedLayer.colors = newSelectedLayer.colors
      ? newSelectedLayer.colors
      : 'ocean_r'
  } else if (newSelectedLayer.dataType === 'GeoTIFF') {
    const tifData = new GetTifLayer(newSelectedLayer.url)
    await tifData.loadGeo()
    newSelectedLayer.scale = [tifData.stats[0].min, tifData.stats[0].max]
  }
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

export async function handleChangeMapLayerAndAddLegend(
  e: any,
  setActualLayer: any,
  setOpacityIsClicked: any,
  setActiveOpacity: any,
  setLayerAction: any,
  setSelectedLayers: any,
  selectedLayers: any,
  subLayers: any,
  subLayer: any,
  setLayerLegend: any,
  layerLegend: any,
  content: any,
) {
  if (
    e.target.checked &&
    !['Photo', 'GeoJSON'].includes(subLayers[subLayer].dataType)
  ) {
    handleClickLegend(subLayers, subLayer, setLayerLegend, content)
  } else {
    if (layerLegend.layerName === subLayer) {
      setLayerLegend('')
    }
  }
  await handleChangeMapLayer(
    e,
    setActualLayer,
    setOpacityIsClicked,
    setActiveOpacity,
    setLayerAction,
    setSelectedLayers,
    selectedLayers,
  )
}

export async function handleChangeMapLayer(
  e: any,
  setActualLayer: any,
  setOpacityIsClicked: any,
  setActiveOpacity: any,
  setLayerAction: any,
  setSelectedLayers: any,
  selectedLayers: any,
) {
  const layerInfo = JSON.parse(e.target.value)
  setActualLayer([layerInfo.subLayer])
  if (layerInfo.dataInfo.dataType === 'Photo') {
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
  layerLegend: any
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
  layerLegend,
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

  return (
    <LayerTypeOptionsContainer>
      <div id="type-option">
        <label
          key={`${content}_${subLayer}`}
          htmlFor={`${content}_${subLayer}`}
        >
          <input
            onChange={(e: any) =>
              handleChangeMapLayerAndAddLegend(
                e,
                setActualLayer,
                setOpacityIsClicked,
                setActiveOpacity,
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
                    selectedLayers,
                  )
                }
              />
            ) : null}
            {subLayers[subLayer].dataType === 'COG' ? (
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
            {!['Photo'].includes(subLayers[subLayer].dataType) && (
              <FontAwesomeIcon
                icon={faSliders}
                title="Change Opacity"
                onClick={() => handleClickSlider(setOpacityIsClicked)}
              />
            )}
            {subLayers[subLayer].download && (
              <a href={subLayers[subLayer].download} target="_blank">
                <FontAwesomeIcon icon={faDownload} title="Download layer" />
              </a>
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
                setActiveOpacity,
                setActualLayer,
              )
            }
          />
        )}
    </LayerTypeOptionsContainer>
  )
}
