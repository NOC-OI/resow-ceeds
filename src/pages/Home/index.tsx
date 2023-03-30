import { useState } from "react";
import { useMap } from "react-leaflet";
import { InfoBox } from "../../components/InfoBox";
import { LayerSelection } from "../../components/LayerSelection";
import { MapHome } from "../../components/MapHome";
import { SideSelection } from "../../components/SideSelection";
import { HomeContainer, SideBar } from "./styles";

export function Home() {
  const [layer, setLayer] = useState<boolean>(false)


  const [selectedLayers, setSelectedLayers] = useState<Object>({})

  const [actualLayer, setActualLayer] = useState(null)

  const [layerAction, setLayerAction] = useState('')

  return (
    <HomeContainer>
      <SideBar>
        <SideSelection
          layer={layer}
          setLayer={setLayer}
          selectedLayers={selectedLayers}
          setSelectedLayers={setSelectedLayers}
          actualLayer={actualLayer}
          setActualLayer={setActualLayer}
        />
        {layer ?
          <LayerSelection
            selectedLayers={selectedLayers}
            setSelectedLayers={setSelectedLayers}
            actualLayer={actualLayer}
            setActualLayer={setActualLayer}
            layerAction={layerAction}
            setLayerAction={setLayerAction}
          /> :
          null
        }
      </SideBar>
      <MapHome
        selectedLayers={selectedLayers}
        setSelectedLayers={setSelectedLayers}
        actualLayer={actualLayer}
        setActualLayer={setActualLayer}
        layerAction={layerAction}
        setLayerAction={setLayerAction}
      />
    </HomeContainer>
  )
}
