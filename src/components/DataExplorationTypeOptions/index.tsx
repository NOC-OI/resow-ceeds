import { useState } from 'react'
import { LayerTypeOptionsContainer } from './styles'
import {
  faCircleInfo,
  faList,
  faMagnifyingGlass,
  faSliders,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Annotations } from '../Annotations'

const organisms = [
  'antedon',
  'anthozoa',
  'anthozoa_01',
  'anthozoa_03',
  'anthozoa_05',
  'anthozoa_06',
  'anthozoa_07',
  'anthozoa_08',
  'anthozoa_11',
  'anthozoa_16',
  'anthozoa_19',
  'anthozoa_24',
  'anthozoa_34',
  'anthozoa_39',
  'asterias_rubens',
  // 'asteroid_01',
  // 'asteroid_07',
  // 'asteroidea',
  // 'astropecten_irregularis',
  // 'axinellidae',
  // 'bolocera',
  // 'bryozoa_01',
  // 'callionymus',
  // 'caryophyllia_smithii',
  // 'cerianthid_01',
  // 'cerianthid_03',
  // 'echinoid_01',
  // 'echinoidea',
  // 'echinus_esculentus',
  // 'eledone_02',
  // 'eledone_cirrhosa',
  // 'fish',
  // 'fish_10',
  // 'flatfish',
  // 'gadidae',
  // 'gadiforme_09',
  // 'gaidropsarus_vulgaris',
  // 'galeus',
  // 'hippoglossoides_platessoides',
  // 'hydroid_01',
  // 'inachidae_01',
  // 'inachidae_02',
  // 'INDETERMINATE',
  // 'indeterminate_29',
  // 'indeterminate_36',
  // 'lepidorhombus_whiffiagonis',
  // 'leucoraja_naevus',
  // 'liocarcinus',
  // 'lithodes_maja',
  // 'luidia_ciliaris',
  // 'luidia_sarsii',
  // 'marthasterias_glacialis',
  // 'microchirus_variegatus',
  // 'munida',
  // 'ophiuroid_01',
  // 'ophiuroid_02',
  // 'paguridae_01',
  // 'paguridae_02',
  // 'parazoanthus',
  // 'pentapora_foliacea',
  // 'porania_pulvillus',
  // 'porcellanidae',
  // 'porella',
  // 'porifera_02',
  // 'porifera_03',
  // 'porifera_20',
  // 'porifera_22',
  // 'porifera_23',
  // 'porifera_24',
  // 'porifera_25',
  // 'rajidae_01',
  // 'reteporella',
  // 'salmacina_dysteri',
  // 'scyliorhinus_canicula',
  // 'squid',
  // 'stichastrella_rosea',
  // 'urticina',
]
const defaultOpacity = 0.7

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
      title: `${content}_${subLayer}`,
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
          layerInfo.dataInfo.show.push(photo.FileName)
        })
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

  function handleClickAnnotations() {
    setShowAnnotations((showAnnotations) => !showAnnotations)
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

  async function handleClickLegend() {
    const newParams = subLayers[subLayer].params
    newParams.request = 'GetLegendGraphic'
    newParams.layer = newParams.layers
    async function getURILegend(newParams: any) {
      const response = await fetch(
        subLayers[subLayer].url + new URLSearchParams(newParams),
      )
      const url = response.url
      setLayerLegend({ layerName: subLayer, url })
    }
    await getURILegend(newParams)
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
  return (
    <LayerTypeOptionsContainer>
      <div>
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
            type="checkbox"
            checked={verifyIfWasSelectedBefore(content, subLayer)}
            id={`${content}_${subLayer}`}
          />
          <p>{subLayer}</p>
        </label>
        {verifyIfWasSelectedBefore(content, subLayer) ? (
          <div>
            <FontAwesomeIcon
              icon={faCircleInfo}
              title={'Show Layer Info'}
              onClick={() => handleClickLayerInfo(content, subLayer)}
            />
            {subLayers[subLayer].data_type !== 'Photo' ? (
              <FontAwesomeIcon
                icon={faList}
                title="Show Legend"
                onClick={handleClickLegend}
              />
            ) : null}
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              title="Zoom to the layer"
              onClick={handleClickZoom}
            />
            {subLayers[subLayer].data_type !== 'Photo' ? (
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
            )}
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
      {opacityIsClicked && (
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