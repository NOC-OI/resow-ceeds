import { useUploadDataHandle } from '../../lib/data/uploadDataManagement'
import { LayerTypeOptionsContainer } from '../DataExplorationTypeOptions/styles'
import styles1 from '../DataExplorationTypeOptions/DataExplorationTypeOptions.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faChartSimple,
  faList,
  faMagnifyingGlass,
  faSliders,
  faTrash,
} from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react'
import {
  getPreviousOpacityValue,
  handleChangeOpacity,
  handleClickLegend,
  handleClickSlider,
  handleClickZoom,
} from '../DataExplorationTypeOptions'
import { colorScale } from '../../lib/map/utils'

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
    setListLayersUpload,
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
    const color = selectedLayersUpload[`uploaded_${layerClass}`]?.colors
    if (color) {
      newListLayersUpload[layerClass].colors = color
    }
    const scale = selectedLayersUpload[`uploaded_${layerClass}`]?.scale
    if (scale) {
      newListLayersUpload[layerClass].scale = scale
    }

    handleClickLegend(newListLayersUpload, layerClass, setLayerLegend, content)
  }

  async function handleChangeMapLayerUpload(e: any, layerClass: string) {
    const layerInfo = listLayersUpload[layerClass]
    const color = layerInfo.colors
      ? layerInfo.colors
      : colorScale[Math.floor(Math.random() * 100)]
    if (e.target.checked) {
      if (
        ['GeoJSON', 'CSV', 'KML', 'KMZ', 'FGB', 'Shapefile'].includes(
          layerInfo.dataType,
        )
      ) {
        layerInfo.colors = color
      }
      handleLocalClickLegend(layerClass, layerInfo, 'uploaded')
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
  function handleRemoveUploadedLayer(layerClass) {
    setListLayersUpload((listLayersUpload) => {
      const copy = { ...listLayersUpload }
      delete copy[layerClass]
      return copy
    })
    setLayerAction('remove')
    setActualLayerNowUpload([`uploaded_${layerClass}`])
    setSelectedLayersUpload((selectedLayersUpload) => {
      const copy = { ...selectedLayersUpload }
      delete copy[`uploaded_${layerClass}`]
      return copy
    })
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

            {!['Photo', 'CSV'].includes(
              selectedLayersUpload[`uploaded_${layerClass}`].dataType,
            ) && (
              <FontAwesomeIcon
                icon={faSliders}
                title="Change Opacity"
                onClick={() => handleClickSlider(setOpacityIsClicked)}
              />
            )}
            <FontAwesomeIcon
              icon={faTrash}
              title="Remove Layer"
              onClick={() => handleRemoveUploadedLayer(layerClass)}
            />
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
