import { useEffect } from 'react'
import { LayerTypeOptionsContainer } from '../DataExplorationTypeOptions/styles'

interface IndicatorSpeciesTypeOptionsProps {
  subLayer: any
  subLayers: any
  setInfoButtonBox: any
  isClicked: any
  setIsClicked: any
  selectedLayers: any
  setSelectedLayers: any
  layerAction: any
  setLayerAction: any
  actualLayer: any
  setActualLayer: any
  listLayers: any
  setShowPhotos: any
}

export function IndicatorSpeciesTypeOptions({
  subLayer,
  subLayers,
  setInfoButtonBox,
  isClicked,
  setIsClicked,
  selectedLayers,
  setSelectedLayers,
  layerAction,
  setLayerAction,
  actualLayer,
  setActualLayer,
  listLayers,
  setShowPhotos,
}: IndicatorSpeciesTypeOptionsProps) {
  function verifyIfWasSelectedBefore(subLayer: string) {
    return !!selectedLayers[subLayer]
  }

  function addMapLayer(layerInfo: any) {
    setLayerAction('add')
    const newSelectedLayer = layerInfo.dataInfo
    newSelectedLayer.opacity = 1
    newSelectedLayer.zoom = true
    setSelectedLayers({
      ...selectedLayers,
      [layerInfo.subLayer]: newSelectedLayer,
    })
  }

  function changeMapLayer(layerInfo: any) {
    setLayerAction('marker-changes')
    const newSelectedLayer = layerInfo.dataInfo
    setSelectedLayers((selectedLayers: any) => {
      const copy = { ...selectedLayers }
      delete copy[layerInfo.subLayer]
      return {
        [layerInfo.subLayer]: newSelectedLayer,
        ...copy,
      }
    })
  }

  async function fetchDatatoUpdateCalculationBox(result: any) {
    setInfoButtonBox({
      title: result.toUpperCase(),
      content: ['XXXXX'],
    })
  }

  async function handleChangeMapLayer(e: any) {
    setIsClicked(e.currentTarget.id)
    const result = e.currentTarget.value
    const layerInfo = {
      subLayer: 'Seabed Images_2012',
      dataInfo: listLayers['Seabed Images'].layerNames['2012'],
    }
    setActualLayer([layerInfo.subLayer])
    layerInfo.dataInfo.show = []
    layerInfo.dataInfo.photos.forEach((photo: any) => {
      if (photo[result] > 0) {
        layerInfo.dataInfo.show.push(photo.FileName)
      }
    })
    if (verifyIfWasSelectedBefore(layerInfo.subLayer)) {
      changeMapLayer(layerInfo)
    } else {
      addMapLayer(layerInfo)
    }
    await fetchDatatoUpdateCalculationBox(result)
  }
  useEffect(() => {
    if (layerAction) {
      const photoList: any[] = []
      Object.keys(selectedLayers).forEach((layer) => {
        if (selectedLayers[layer].data_type === 'Photo') {
          selectedLayers[layer].photos.forEach((photo: any) => {
            photo.layerName = actualLayer[0]
            photoList.push(photo)
          })
        }
      })
      setShowPhotos(photoList)
    }
  }, [selectedLayers])

  return (
    <LayerTypeOptionsContainer>
      <div>
        <label key={`${subLayer.name}_${subLayer}`} htmlFor={subLayer.name}>
          <input
            onChange={handleChangeMapLayer}
            value={subLayer.name}
            type="radio"
            checked={isClicked === subLayer.name}
            id={subLayer.name}
          />
          <p>{subLayer.name}</p>
        </label>
        {/* {verifyIfWasSelectedBefore(content, subLayer) ? (
          <div>
            <FontAwesomeIcon
              icon={faCircleInfo}
              title={'Show Layer Info'}
              // onClick={() => handleClickLayerInfo(content, subLayer)}
            />
          </div>
        ) : null} */}
      </div>
    </LayerTypeOptionsContainer>
  )
}
