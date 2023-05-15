import { PhotoType } from "../PhotoType";
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
  listPhotos: any,
  title?: string,
}

export function PhotoSelection({selectedLayers, setSelectedLayers, actualLayer, setActualLayer, layerAction, setLayerAction, layerLegend, setLayerLegend, setShowPhotos, listPhotos, title}: PhotoSelectionProps) {

  return (
    <PhotoSelectionContainer>
      <PhotoSelectionTitle>
        <h1>Photo Selection</h1>
      </PhotoSelectionTitle>
      <PhotoTypes>
        {listPhotos.map((layerClass: any) => {
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
