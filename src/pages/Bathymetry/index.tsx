import { BathymetryContainer } from "./styles";
import { useState } from "react";
import { LayerSelection } from "../../components/LayerSelection";
import { SideSelection } from "../../components/SideSelection";
import { SideBar } from "../Home/styles";
import { ThreeDMap } from "../../components/ThreeDMap";

export function Bathymetry() {
  const [layer, setLayer] = useState<boolean>(false)

  const [selectedLayers, setSelectedLayers] = useState<Object>({})

  const [actualLayer, setActualLayer] = useState<string[]>([''])

  const [layerAction, setLayerAction] = useState('')

  return (
    <BathymetryContainer>
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
        {/* {layer ?
          <ThreeDLayerSelection
            selectedLayers={selectedLayers}
            setSelectedLayers={setSelectedLayers}
            actualLayer={actualLayer}
            setActualLayer={setActualLayer}
            layerAction={layerAction}
            setLayerAction={setLayerAction}
          /> :
          null
        } */}
      </SideBar>
      <ThreeDMap
      />
    </BathymetryContainer>
  )
}
