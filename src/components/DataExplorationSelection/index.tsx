/* eslint-disable no-multi-str */
import { LayerSelectionContainer, LayerTypes } from './styles'
import { DataExplorationType } from '../DataExplorationType'
// import { Info } from 'phosphor-react'
import styles from './DataExplorationSelection.module.css'
import { BaseLayerSwitcher } from '../BaseLayerSwitcher'

interface DataExplorationSelectionProps {
  selectedLayers: Object
  setSelectedLayers: any
  actualLayer: string[]
  setActualLayer: any
  layerAction: String
  setLayerAction: any
  layerLegend: any
  setLayerLegend: any
  setInfoButtonBox?: any
  listLayers?: any
  setShowPhotos?: any
  getPolyline?: any
  setGetPolyline?: any
  setShowRange?: any
  setClickPoint: any
  showSuitability?: any
  selectedBaseLayer: any
  setSelectedBaseLayer: any
}

export function DataExplorationSelection({
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
  setShowPhotos,
  getPolyline,
  setGetPolyline,
  setClickPoint,
  showSuitability,
  selectedBaseLayer,
  setSelectedBaseLayer,
}: DataExplorationSelectionProps) {
  // function handleClickLayerInfo(title: String, content: string) {
  //   setInfoButtonBox({
  //     title,
  //     content,
  //   })
  // }
  return (
    <LayerSelectionContainer className={styles.fade_in}>
      <LayerTypes>
        <BaseLayerSwitcher
          setSelectedBaseLayer={setSelectedBaseLayer}
          selectedBaseLayer={selectedBaseLayer}
        />
        {Object.keys(listLayers).map((layerClass: any) => (
          <DataExplorationType
            key={layerClass}
            content={layerClass}
            childs={listLayers[layerClass].layerNames}
            selectedLayers={selectedLayers}
            setSelectedLayers={setSelectedLayers}
            actualLayer={actualLayer}
            setActualLayer={setActualLayer}
            layerAction={layerAction}
            setLayerAction={setLayerAction}
            layerLegend={layerLegend}
            setLayerLegend={setLayerLegend}
            setInfoButtonBox={setInfoButtonBox}
            setShowPhotos={setShowPhotos}
            getPolyline={getPolyline}
            setGetPolyline={setGetPolyline}
            setClickPoint={setClickPoint}
            listLayers={listLayers}
          />
        ))}
      </LayerTypes>
    </LayerSelectionContainer>
  )
}
