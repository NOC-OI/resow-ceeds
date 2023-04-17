import { useState } from "react";
import { LayerSelection } from "../../components/LayerSelection";
import { CalcSelection } from "../../components/CalcSelection";
import { MapHome } from "../../components/MapHome";
import { SideSelection } from "../../components/SideSelection";
import { TileServerContainer, SideBar } from "./styles";
import { CalculationValue } from "../../components/CalculationValue";

export function TileServer() {
  const [layer, setLayer] = useState<boolean>(false)

  const [calc, setCalc] = useState<boolean>(false)

  const [selectedArea, setSelectedArea] = useState(false);


  const [selectedLayers, setSelectedLayers] = useState<Object>({})

  const [actualLayer, setActualLayer] = useState<string[]>([''])

  const [layerAction, setLayerAction] = useState('')

  const [calculationValue, setCalculationValue] = useState('');

  return (
    <TileServerContainer>
      <SideBar>
        <SideSelection
          layer={layer}
          setLayer={setLayer}
          calc={calc}
          setCalc={setCalc}
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
        {calc ?
          <CalcSelection setCalculationValue={setCalculationValue}
            selectedArea={selectedArea}
            setSelectedArea={setSelectedArea}
          /> :
          null
        }
        {calculationValue?
          <CalculationValue
            calculationValue={calculationValue}
            setCalculationValue={setCalculationValue}
          />
          : null
        }
      </SideBar>
      <MapHome
        selectedLayers={selectedLayers}
        actualLayer={actualLayer}
        layerAction={layerAction}
        setLayerAction={setLayerAction}
        selectedArea={selectedArea}
      />
    </TileServerContainer>
  )
}
