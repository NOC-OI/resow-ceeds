import { useUploadDataHandle } from '../../lib/data/uploadDataManagement'
import { LayerTypeOptionsContainer } from '../DataExplorationTypeOptions/styles'
import styles1 from '../DataExplorationTypeOptions/DataExplorationTypeOptions.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faChartSimple,
  faList,
  faMagnifyingGlass,
  faSliders,
} from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react'
import {
  getPreviousOpacityValue,
  handleChangeOpacity,
  handleClickLegend,
  handleClickSlider,
  handleClickZoom,
} from '../DataExplorationTypeOptions'

interface LayersUploadedOptionsProps {
  layerClass: string
  layerAction: string
  setLayerAction: any
  layerLegend: any
  setLayerLegend: any
}

export function LayersUploadedOptions({
  layerClass,
  layerAction,
  setLayerAction,
  layerLegend,
  setLayerLegend,
}: LayersUploadedOptionsProps) {
  const {
    selectedLayersUpload,
    setSelectedLayersUpload,
    listLayersUpload,
    setActualLayerNowUpload,
  } = useUploadDataHandle()
  const [opacityIsClicked, setOpacityIsClicked] = useState(false)
  async function addMapLayerUpload(layerInfo: any, layerClass: string) {
    setLayerAction('add')
    setActualLayerNowUpload([`uploaded_${layerClass}`])
    setSelectedLayersUpload({
      ...selectedLayersUpload,
      [`uploaded_${layerClass}`]: layerInfo,
    })
  }

  function removeMapLayerUpload(layerClass: string) {
    setOpacityIsClicked(false)
    setLayerAction('remove')
    setActualLayerNowUpload([`uploaded_${layerClass}`])
    setSelectedLayersUpload((selectedLayersUpload: any) => {
      const copy = { ...selectedLayersUpload }
      delete copy[`uploaded_${layerClass}`]
      return copy
    })
  }

  async function handleLocalClickLegend(layerClass, layerInfo, content) {
    const newListLayersUpload = { ...listLayersUpload }
    newListLayersUpload[layerClass].params = {
      layers: layerInfo.data,
      styles: layerInfo.colors,
      request: '',
    }
    handleClickLegend(newListLayersUpload, layerClass, setLayerLegend, content)
  }

  async function handleChangeMapLayerUpload(e: any, layerClass: string) {
    const layerInfo = listLayersUpload[layerClass]
    if (e.target.checked) {
      if (
        !['Photo', 'GeoJSON', 'CSV', 'Shapefile'].includes(layerInfo.dataType)
      ) {
        handleLocalClickLegend(layerClass, layerInfo, 'uploaded')
      }
      await addMapLayerUpload(layerInfo, layerClass)
    } else {
      if (layerLegend[layerClass]) {
        setLayerLegend((layerLegend: any) => {
          const newLayerLegend = { ...layerLegend }
          delete newLayerLegend[layerClass]
          return newLayerLegend
        })
      }
      removeMapLayerUpload(layerClass)
    }
  }
  return (
    <LayerTypeOptionsContainer key={`uploaded_${layerClass}`}>
      <div id="type-option">
        <label htmlFor={`uploaded_${layerClass}`} title="layer uploaded">
          <input
            id={`uploaded_${layerClass}`}
            onChange={(e) => handleChangeMapLayerUpload(e, layerClass)}
            className={styles1.chk}
            type="checkbox"
            name="baseLayer"
            checked={Object.keys(selectedLayersUpload).includes(
              `uploaded_${layerClass}`,
            )}
          />
          <label
            htmlFor={`uploaded_${layerClass}`}
            className={styles1.switch}
            title="layer uploaded"
          >
            <span className={styles1.slider}></span>
          </label>
          <p>
            {layerClass.length > 30
              ? layerClass.slice(0, 27) + '...'
              : layerClass}
          </p>
        </label>
        {Object.keys(selectedLayersUpload).includes(
          `uploaded_${layerClass}`,
        ) && (
          <div id="layer-edit">
            {!['Photo', 'GeoJSON', 'CSV', 'Shapefile'].includes(
              selectedLayersUpload[`uploaded_${layerClass}`].dataType,
            ) ? (
              <FontAwesomeIcon
                icon={faList}
                title="Show Legend"
                onClick={() =>
                  handleLocalClickLegend(
                    layerClass,
                    listLayersUpload[layerClass],
                    'uploaded',
                  )
                }
              />
            ) : null}
            {['COG', 'GeoTIFF'].includes(
              selectedLayersUpload[`uploaded_${layerClass}`].dataType,
            ) ? (
              <FontAwesomeIcon
                icon={faChartSimple}
                title="Make a graph"
                // onClick={() =>
                //   handleGenerateGraph(
                //     setGetPolyline,
                //     setActualLayer,
                //     subLayers,
                //     subLayer,
                //   )
                // }
                // className={getPolyline ? 'active' : ''}
              />
            ) : null}
            {!['CSV'].includes(
              selectedLayersUpload[`uploaded_${layerClass}`].dataType,
            ) && (
              <FontAwesomeIcon
                icon={faMagnifyingGlass}
                title="Zoom to the layer"
                onClick={() =>
                  handleClickZoom(
                    'uploaded',
                    listLayersUpload,
                    selectedLayersUpload[`uploaded_${layerClass}`].name,
                    setActualLayerNowUpload,
                    setLayerAction,
                    selectedLayersUpload,
                    setSelectedLayersUpload,
                  )
                }
              />
            )}
            {!['Photo', 'CSV'].includes(
              selectedLayersUpload[`uploaded_${layerClass}`].dataType,
            ) && (
              <FontAwesomeIcon
                icon={faSliders}
                title="Change Opacity"
                onClick={() => handleClickSlider(setOpacityIsClicked)}
              />
            )}
          </div>
        )}
      </div>
      {opacityIsClicked &&
        Object.keys(selectedLayersUpload).includes(
          `uploaded_${layerClass}`,
        ) && (
          <input
            type="range"
            step={0.1}
            min={0}
            max={1}
            value={getPreviousOpacityValue(
              `uploaded_${layerClass}`,
              selectedLayersUpload,
            )}
            onChange={(e) =>
              handleChangeOpacity(
                e,
                setLayerAction,
                setSelectedLayersUpload,
                'uploaded',
                selectedLayersUpload[`uploaded_${layerClass}`].name,
                listLayersUpload,
                setActualLayerNowUpload,
              )
            }
          />
        )}
    </LayerTypeOptionsContainer>
  )
}
