/* eslint-disable no-multi-str */
import {
  LayerSelectionContainer,
  LayerTypes,
} from '../DataExplorationSelection/styles'
import { ThreeDDataExplorationType } from '../ThreeDDataExplorationType'

interface ThreeDDataExplorationSelectionProps {
  selectedLayers: Object
  setSelectedLayers: any
  setActualLayer: any
  layerAction: String
  setLayerAction: any
  setLayerLegend: any
  setInfoButtonBox?: any
  listLayers?: any
  isLogged?: any
  threeD: any
  setThreeD: any
  showSuitability: any
}

export function ThreeDDataExplorationSelection({
  selectedLayers,
  setSelectedLayers,
  setActualLayer,
  layerAction,
  setLayerAction,
  setLayerLegend,
  setInfoButtonBox,
  listLayers,
  isLogged,
  threeD,
  setThreeD,
  showSuitability,
}: ThreeDDataExplorationSelectionProps) {
  return (
    <LayerSelectionContainer>
      <LayerTypes>
        {Object.keys(listLayers).map((layerClass: any) => {
          if (showSuitability) {
            if (layerClass === 'Suitability') {
              return (
                <ThreeDDataExplorationType
                  key={layerClass}
                  content={layerClass}
                  childs={listLayers[layerClass].layerNames}
                  selectedLayers={selectedLayers}
                  setSelectedLayers={setSelectedLayers}
                  setActualLayer={setActualLayer}
                  layerAction={layerAction}
                  setLayerAction={setLayerAction}
                  setLayerLegend={setLayerLegend}
                  setInfoButtonBox={setInfoButtonBox}
                  isLogged={isLogged}
                  threeD={threeD}
                  setThreeD={setThreeD}
                  listLayers={listLayers}
                />
              )
            } else {
              return null
            }
          } else {
            if (layerClass !== 'Suitability') {
              return (
                <ThreeDDataExplorationType
                  key={layerClass}
                  content={layerClass}
                  childs={listLayers[layerClass].layerNames}
                  selectedLayers={selectedLayers}
                  setSelectedLayers={setSelectedLayers}
                  setActualLayer={setActualLayer}
                  layerAction={layerAction}
                  setLayerAction={setLayerAction}
                  setLayerLegend={setLayerLegend}
                  setInfoButtonBox={setInfoButtonBox}
                  isLogged={isLogged}
                  threeD={threeD}
                  setThreeD={setThreeD}
                  listLayers={listLayers}
                />
              )
            } else {
              return null
            }
          }
        })}
      </LayerTypes>
    </LayerSelectionContainer>
  )
}
