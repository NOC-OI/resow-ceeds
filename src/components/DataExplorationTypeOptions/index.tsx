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
import {
  calculateColorsForLegend,
  colorScale,
  defaultOpacity,
  getLegendCapabilities,
} from '../../lib/map/utils'
import chroma from 'chroma-js'

export function handleChangeOpacity(
  e: any,
  setLayerAction,
  setSelectedLayers,
  content,
  subLayer,
  subLayers,
  setActualLayer,
) {
  function changeMapOpacity(layerInfo: any, opacity: number) {
    setLayerAction('opacity')
    const newSelectedLayer = layerInfo.dataInfo
    newSelectedLayer.opacity = opacity
    newSelectedLayer.zoom = true
    setSelectedLayers((selectedLayers: any) => {
      const copy = { ...selectedLayers }
      newSelectedLayer.order = copy[layerInfo.subLayer].order
      delete copy[layerInfo.subLayer]
      const newSelectedLayers: any = {
        [layerInfo.subLayer]: newSelectedLayer,
        ...copy,
      }
      const sortedArray = Object.entries(newSelectedLayers).sort(
        (a: any, b: any) => b[1].order - a[1].order,
      )
      const sortedObj = Object.fromEntries(sortedArray)
      return sortedObj
    })
  }

  const layerInfo = JSON.parse(
    JSON.stringify({
      subLayer: `${content}_${subLayer}`,
      dataInfo: subLayers[subLayer],
    }),
  )
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
  const legendLayerName = `${content}_${subLayer}`
  if (subLayers[subLayer].dataType === 'WMS') {
    const newParams = subLayers[subLayer].params
    newParams.request = 'GetLegendGraphic'
    newParams.layer = newParams.layers
    async function getURILegend(newParams: any) {
      let responseUrl = await getLegendCapabilities(
        subLayers[subLayer].url,
        newParams.layers,
      )
      if (!responseUrl) {
        responseUrl = `${subLayers[subLayer].url}?request=${newParams.request}&layer=${newParams.layer}`
        responseUrl = responseUrl.replace('layers=', 'layer=')
        responseUrl = responseUrl.replace('amp;', '')
        responseUrl = responseUrl + '&SERVICE=wms&format=image/png'
      }
      setLayerLegend((layerLegend: any) => {
        const newLayerLegend = { ...layerLegend }
        delete newLayerLegend[legendLayerName]
        newLayerLegend[legendLayerName] = {
          layerName: legendLayerName,
          url: responseUrl,
        }
        return newLayerLegend
      })
    }
    await getURILegend(newParams)
  } else if (subLayers[subLayer].dataType === 'MBTiles') {
    setLayerLegend((layerLegend: any) => {
      const newLayerLegend = { ...layerLegend }
      delete newLayerLegend[legendLayerName]
      newLayerLegend[legendLayerName] = {
        layerName: legendLayerName,
        legend: [[subLayers[subLayer].colors], [subLayer]],
      }
      return newLayerLegend
    })
  } else if (
    ['GeoJSON', 'CSV', 'KML', 'KMZ', 'FGB', 'Shapefile'].includes(
      subLayers[subLayer].dataType,
    )
  ) {
    const colorName = selectedLayers
      ? selectedLayers[`${content}_${subLayer}`].colors
      : typeof subLayers[subLayer].colors === 'string'
      ? subLayers[subLayer].colors
      : subLayers[subLayer].colors[0]
    setLayerLegend((layerLegend: any) => {
      const newLayerLegend = { ...layerLegend }
      delete newLayerLegend[legendLayerName]
      newLayerLegend[legendLayerName] = {
        layerName: legendLayerName,
        legend: [[colorName], [subLayer]],
        dataType: subLayers[subLayer].dataType,
        selectedLayersKey: legendLayerName,
      }
      return newLayerLegend
    })
  } else if (subLayers[subLayer].dataType === 'COG') {
    let scale
    if (!selectedLayers) {
      if (typeof subLayers[subLayer].url === 'string') {
        if (!subLayers[subLayer].scale) {
          const getCOGLayer = new GetCOGLayer(
            subLayers[subLayer],
            subLayer,
            true,
          )
          await getCOGLayer.getStats().then((stats) => {
            const minValue = stats.b1.percentile_2.toFixed(4)
            const maxValue = stats.b1.percentile_98.toFixed(4)
            scale = [minValue, maxValue]
          })
        } else {
          scale = subLayers[subLayer].scale
        }
      } else {
        let minValue
        let maxValue
        if (subLayers[subLayer].scale) {
          scale = subLayers[subLayer].scale
        } else {
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
      }
    } else {
      scale = selectedLayers[`${content}_${subLayer}`].scale
    }
    const colorName = selectedLayers
      ? selectedLayers[`${content}_${subLayer}`].colors
      : subLayers[subLayer].colors
      ? subLayers[subLayer].colors
      : 'ocean_r'
    const { listColors, listColorsValues } = calculateColorsForLegend(
      colorName,
      scale,
      30,
    )
    setLayerLegend((layerLegend: any) => {
      const newLayerLegend = { ...layerLegend }
      delete newLayerLegend[legendLayerName]
      newLayerLegend[legendLayerName] = {
        layerName: legendLayerName,
        layerInfo: { ...subLayers[subLayer], colors: colorName },
        selectedLayersKey: `${content}_${subLayer}`,
        scale,
        dataDescription: subLayers[subLayer].dataDescription,
        legend: [listColors, listColorsValues],
        dataType: subLayers[subLayer].dataType,
      }
      return newLayerLegend
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
    const colors = selectedLayers
      ? selectedLayers[`${content}_${subLayer}`].colors
      : subLayers[subLayer].colors
    const { listColors, listColorsValues } = calculateColorsForLegend(
      colors,
      scale,
      30,
      typeof colors !== 'string',
    )
    setLayerLegend((layerLegend: any) => {
      const newLayerLegend = { ...layerLegend }
      delete newLayerLegend[legendLayerName]
      newLayerLegend[legendLayerName] = {
        layerName: legendLayerName,
        layerInfo: subLayers[subLayer],
        selectedLayersKey: `${content}_${subLayer}`,
        scale,
        dataDescription: subLayers[subLayer].dataDescription,
        legend: [listColors, listColorsValues],
        dataType: subLayers[subLayer].dataType,
      }
      return newLayerLegend
    })
  } else if (subLayers[subLayer].dataType === 'ASC') {
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
    const colors = selectedLayers
      ? selectedLayers[`${content}_${subLayer}`].colors
      : subLayers[subLayer].colors
    const { listColors, listColorsValues } = calculateColorsForLegend(
      colors,
      scale,
      30,
      typeof colors !== 'string',
    )
    setLayerLegend((layerLegend: any) => {
      const newLayerLegend = { ...layerLegend }
      delete newLayerLegend[legendLayerName]
      newLayerLegend[legendLayerName] = {
        layerName: legendLayerName,
        layerInfo: subLayers[subLayer],
        selectedLayersKey: `${content}_${subLayer}`,
        scale,
        dataDescription: subLayers[subLayer].dataDescription,
        legend: [listColors, listColorsValues],
        dataType: subLayers[subLayer].dataType,
      }
      return newLayerLegend
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
    metadata: selectedLayers[`${content}_${subLayer}`].download.metadata,
  })
}

export function handleClickZoom(
  content,
  subLayers,
  subLayer,
  setActualLayer,
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
  let order = 0
  Object.keys(selectedLayers).forEach((key) => {
    if (selectedLayers[key].order > order) {
      order = selectedLayers[key].order
    }
  })
  newSelectedLayer.order = order + 1
  setSelectedLayers((selectedLayers: any) => {
    const copy = { ...selectedLayers }
    delete copy[layerInfo.subLayer]
    const newSelectedLayers: any = {
      [layerInfo.subLayer]: newSelectedLayer,
      ...copy,
    }
    const sortedArray = Object.entries(newSelectedLayers).sort(
      (a: any, b: any) => b[1].order - a[1].order,
    )
    const sortedObj = Object.fromEntries(sortedArray)
    return sortedObj
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
      if (!newSelectedLayer.scale) {
        const getCOGLayer = new GetCOGLayer(newSelectedLayer, undefined, true)
        await getCOGLayer.getStats().then((stats) => {
          const minValue = stats.b1.percentile_2
          const maxValue = stats.b1.percentile_98
          newSelectedLayer.scale = [minValue, maxValue]
        })
      }
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
  let order = 0
  Object.keys(selectedLayers).forEach((key) => {
    if (selectedLayers[key].order > order) {
      order = selectedLayers[key].order
    }
  })
  newSelectedLayer.order = order + 1
  setSelectedLayers((selectedLayers: any) => {
    const newSelectedLayers: any = {
      [layerInfo.subLayer]: newSelectedLayer,
      ...selectedLayers,
    }
    const sortedArray = Object.entries(newSelectedLayers).sort(
      (a: any, b: any) => b[1].order - a[1].order,
    )
    const sortedObj = Object.fromEntries(sortedArray)
    return sortedObj
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
  setLayerAction: any,
  setSelectedLayers: any,
  selectedLayers: any,
  subLayers: any,
  subLayer: any,
  setLayerLegend: any,
  layerLegend: any,
  content: any,
) {
  const color = subLayers[subLayer].colors
    ? subLayers[subLayer].colors
    : colorScale[Math.floor(Math.random() * 100)]
  if (e.target.checked && !['Photo'].includes(subLayers[subLayer].dataType)) {
    const copySubLayers = { ...subLayers }
    if (
      ['GeoJSON', 'CSV', 'KML', 'KMZ', 'FGB', 'Shapefile'].includes(
        subLayers[subLayer].dataType,
      )
    ) {
      copySubLayers[subLayer].colors = color
    }
    handleClickLegend(copySubLayers, subLayer, setLayerLegend, content)
  } else {
    const legendLayerName = `${content}_${subLayer}`
    if (layerLegend[legendLayerName]) {
      setLayerLegend((layerLegend: any) => {
        const newLayerLegend = { ...layerLegend }
        delete newLayerLegend[legendLayerName]
        return newLayerLegend
      })
    }
  }
  await handleChangeMapLayer(
    e,
    setActualLayer,
    setOpacityIsClicked,
    setLayerAction,
    setSelectedLayers,
    selectedLayers,
    color,
  )
}

export async function handleChangeMapLayer(
  e: any,
  setActualLayer: any,
  setOpacityIsClicked: any,
  setLayerAction: any,
  setSelectedLayers: any,
  selectedLayers: any,
  color?: any,
) {
  const layerInfo = JSON.parse(e.target.value)
  if (color) {
    layerInfo.dataInfo.color = color
  }
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
      setOpacityIsClicked(false)
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
      removeMapLayer(layerInfo, setLayerAction, setSelectedLayers)
    }
  }
}

interface DataExplorationTypeOptionsProps {
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
  getPolyline: any
  setGetPolyline: any
  setShowRange?: any
  setClickPoint: any
  setDownloadPopup?: any
}

export function DataExplorationTypeOptions({
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
  getPolyline,
  setGetPolyline,
  setClickPoint,
  setDownloadPopup,
}: DataExplorationTypeOptionsProps) {
  const [opacityIsClicked, setOpacityIsClicked] = useState(false)

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
            {!['Photo'].includes(subLayers[subLayer].dataType) ? (
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
    </LayerTypeOptionsContainer>
  )
}
