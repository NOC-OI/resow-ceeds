import { useState } from "react";
import { PhotoType } from "../PhotoType";
import { listPhotos } from "./listPhotos";
import { PhotoSelectionContainer, PhotoSelectionTitle, PhotoTypes } from "./styles";

interface PhotoSelectionProps{
  selectedLayers: Object,
  setSelectedLayers: any,
  actualLayer: string[],
  setActualLayer: any,
  layerAction: String,
  setLayerAction: any,
  layerLegend: any,
  setLayerLegend: any,
  setShowPhotos: any,
}

export function PhotoSelection({selectedLayers, setSelectedLayers, actualLayer, setActualLayer, layerAction, setLayerAction, layerLegend, setLayerLegend, setShowPhotos}: PhotoSelectionProps) {

  const [photoClasses, setPhotoClasses] = useState(listPhotos)
  return (
    <PhotoSelectionContainer>
      <PhotoSelectionTitle>
        <h1>Photo Selection</h1>
      </PhotoSelectionTitle>
      <PhotoTypes>
        {photoClasses.map(layerClass => {
          return (
            <PhotoType
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
              setShowPhotos={setShowPhotos}
            />
          )
        })}
      </PhotoTypes>
    </PhotoSelectionContainer>
  )
}
