import { LayerSelectionContainer, LayerSelectionTitle, LayerTypes} from "./styles";
import { useState } from "react";
import { LayerType } from "../LayerType";
import * as L from 'leaflet';
import { listLayers } from "./listLayers";

interface LayerSelectionProps{
  selectedLayers: Object,
  setSelectedLayers: any,
  actualLayer: string[],
  setActualLayer: any,
  layerAction: String,
  setLayerAction: any,
  layerLegend: any,
  setLayerLegend: any,
}

export function LayerSelection({selectedLayers, setSelectedLayers, actualLayer, setActualLayer, layerAction, setLayerAction, layerLegend, setLayerLegend}: LayerSelectionProps) {

  const [layerClasses, setLayerClasses] = useState(listLayers)

  return (
    <LayerSelectionContainer>
      <LayerSelectionTitle>
        <h1>Layer Selection</h1>
      </LayerSelectionTitle>
      <LayerTypes>
        {layerClasses.map(layerClass => {
          return (
            <LayerType
              key={layerClass.layerClass}
              content={layerClass.layerClass}
              childs={layerClass.layerNames}
              selectedLayers={selectedLayers}
              setSelectedLayers={setSelectedLayers}
              actualLayer={actualLayer}
              setActualLayer={setActualLayer}
              layerAction={layerAction}
              setLayerAction={setLayerAction}
              layerLegend={layerLegend}
              setLayerLegend={setLayerLegend}
            />
          )
        })}
      </LayerTypes>
    </LayerSelectionContainer>
  )
}
