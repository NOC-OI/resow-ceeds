/* eslint-disable no-multi-str */
import {
  LayerSelectionContainer,
  LayerTypes,
} from '../DataExplorationSelection/styles'
import { ThreeDDataExplorationType } from '../ThreeDDataExplorationType'

interface ThreeDDataExplorationSelectionProps {
  selectedLayers: object
  setSelectedLayers: any
  setActualLayer: any
  layerAction: string
  setLayerAction: any
  layerLegend: any
  setLayerLegend: any
  setInfoButtonBox?: any
  listLayers?: any
  isLogged?: any
  threeD: any
  setThreeD: any
  setDownloadPopup?: any
}

export function ThreeDDataExplorationSelection({
  selectedLayers,
  setSelectedLayers,
  setActualLayer,
  layerAction,
  setLayerAction,
  layerLegend,
  setLayerLegend,
  setInfoButtonBox,
  listLayers,
  isLogged,
  threeD,
  setThreeD,
  setDownloadPopup,
}: ThreeDDataExplorationSelectionProps) {
  return (
    <LayerSelectionContainer>
      <LayerTypes>
        {Object.keys(listLayers).map((layerClass: any) => (
          <ThreeDDataExplorationType
            key={layerClass}
            content={layerClass}
            childs={listLayers[layerClass].layerNames}
            selectedLayers={selectedLayers}
            setSelectedLayers={setSelectedLayers}
            setActualLayer={setActualLayer}
            layerAction={layerAction}
            setLayerAction={setLayerAction}
            layerLegend={layerLegend}
            setLayerLegend={setLayerLegend}
            setInfoButtonBox={setInfoButtonBox}
            isLogged={isLogged}
            threeD={threeD}
            setThreeD={setThreeD}
            listLayers={listLayers}
            setDownloadPopup={setDownloadPopup}
          />
        ))}
      </LayerTypes>
    </LayerSelectionContainer>
  )
}
