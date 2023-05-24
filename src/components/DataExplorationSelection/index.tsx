import {
  LayerSelectionContainer,
  LayerSelectionTitle,
  LayerTypes,
} from './styles'
import { DataExplorationType } from '../DataExplorationType'
import { Info } from 'phosphor-react'

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
}: DataExplorationSelectionProps) {
  function handleClickLayerInfo(title: String, content: string) {
    setInfoButtonBox({
      title,
      content,
    })
  }

  return (
    <LayerSelectionContainer>
      <LayerSelectionTitle>
        <div>
          <h1>Data Exploration</h1>
          <Info
            size={20}
            onClick={() =>
              handleClickLayerInfo(
                'Data Exploration',
                'Some information about...',
              )
            }
          />
        </div>
      </LayerSelectionTitle>
      <LayerTypes>
        {Object.keys(listLayers).map((layerClass: any) => {
          return (
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
            />
          )
        })}
      </LayerTypes>
    </LayerSelectionContainer>
  )
}
