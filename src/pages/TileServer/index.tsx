import { useState } from "react";
import { LayerSelection } from "../../components/LayerSelection";
import { MapHome } from "../../components/MapHome";
import { SideSelection } from "../../components/SideSelection";
import { TileServerContainer, SideBar } from "./styles";

export function TileServer() {
  const [layer, setLayer] = useState<boolean>(false)


  const [selectedLayers, setSelectedLayers] = useState<Object>({})

  const [actualLayer, setActualLayer] = useState<string[]>([''])

  const [layerAction, setLayerAction] = useState('')

  return (
    <TileServerContainer>
      <SideBar>
        <SideSelection
          layer={layer}
          setLayer={setLayer}
          selectedLayers={selectedLayers}
          setSelectedLayers={setSelectedLayers}
          actualLayer={actualLayer}
          setActualLayer={setActualLayer}
          setLayerAction={setLayerAction}
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
        actualLayer={actualLayer}
        layerAction={layerAction}
        setLayerAction={setLayerAction}
      />
    </TileServerContainer>
  )
}
