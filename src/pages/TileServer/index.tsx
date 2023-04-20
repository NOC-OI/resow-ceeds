import { useState } from "react";
import { LayerSelection } from "../../components/LayerSelection";
import { CalcSelection } from "../../components/CalcSelection";
import { MapHome } from "../../components/MapHome";
import { SideSelection } from "../../components/SideSelection";
import { TileServerContainer, SideBar } from "./styles";
import { CalculationValue } from "../../components/CalculationValue";
import * as L from 'leaflet';
import { LayerLegend } from "../../components/LayerLegend";


export function TileServer() {
  const [layer, setLayer] = useState<boolean>(false)

  const [calc, setCalc] = useState<boolean>(false)

  const [selectedArea, setSelectedArea] = useState(false);

  const [latLonLimits, setLatLonLimits] = useState([new L.LatLng(53.1, -16.9),
    new L.LatLng(53.1, 2.1),
    new L.LatLng(39.9, 2.1),
    new L.LatLng(39.9, -16.9)]
  )

  const [selectedLayers, setSelectedLayers] = useState<Object>({})

  const [actualLayer, setActualLayer] = useState<string[]>([''])

  const [layerAction, setLayerAction] = useState('')

  const [calculationValue, setCalculationValue] = useState('');

  const [layerLegend, setLayerLegend] = useState('');

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
          setSelectedArea={setSelectedArea}
        />
        {layer ?
          <LayerSelection
            selectedLayers={selectedLayers}
            setSelectedLayers={setSelectedLayers}
            actualLayer={actualLayer}
            setActualLayer={setActualLayer}
            layerAction={layerAction}
            setLayerAction={setLayerAction}
            layerLegend={layerLegend}
            setLayerLegend={setLayerLegend}
          /> :
          null
        }
        {calc ?
          <CalcSelection setCalculationValue={setCalculationValue}
            selectedArea={selectedArea}
            setSelectedArea={setSelectedArea}
            latLonLimits={latLonLimits}
            setLatLonLimits={setLatLonLimits}
          /> :
          null
        }
        {layerLegend?
          <LayerLegend
            layerLegend={layerLegend}
            setLayerLegend={setLayerLegend}
          />
          : null
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
        latLonLimits={latLonLimits}
      />
    </TileServerContainer>
  )
}
