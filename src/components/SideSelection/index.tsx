import { SideSelectionContainer, SideSelectionLink } from "./styles";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalculator, faCamera, faLayerGroup, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Icon } from '@iconify/react';
import { useNavigate } from "react-router-dom";

interface SideSelectionProps{
  layer: boolean,
  setLayer: any,
  calc?: boolean,
  setCalc?: any,
  selectedLayers: Object,
  setSelectedLayers: any,
  actualLayer: string[],
  setActualLayer: any,
  setLayerAction: any,
  setSelectedArea?: any
}

export function SideSelection({layer, setLayer, calc, setCalc, selectedLayers, setSelectedLayers, actualLayer, setActualLayer, setLayerAction, setSelectedArea}: SideSelectionProps ) {

  const navigate = useNavigate();

  function handleShowLayerSelection() {
    if (window.location.pathname === '/3d') {
      navigate('/')
      setLayer(false)
      setCalc(false)
    } else{
      setLayer((layer: any) => !layer)
      setSelectedArea(false)
      setCalc(false)
    }
  }

  function handleShowCalcSelection() {
    if (window.location.pathname === '/3d') {
      navigate('/')
      setLayer(false)
      setCalc(true)
    } else{
      setCalc((calc: any) => !calc)
      setLayer(false)
    }
  }
  function handleEraseLayers() {
    setActualLayer(Object.keys(selectedLayers))
    setSelectedLayers({})
    setLayerAction('remove')
  }

  function handleGoToBathymetry() {
    if (window.location.pathname !== '/3d') {
      navigate('/3d')
    }
  }

  return (
    <>
      <SideSelectionContainer>
        <SideSelectionLink onClick={handleShowLayerSelection}>
          <FontAwesomeIcon title={"Select Layers"} icon={faLayerGroup} />
        </SideSelectionLink>
        <SideSelectionLink>
          <FontAwesomeIcon title={"Select Pictures"} icon={faCamera} />
        </SideSelectionLink>
        <SideSelectionLink  onClick={handleShowCalcSelection} >
          <FontAwesomeIcon title={"Use Cases Calculations"} icon={faCalculator} />
        </SideSelectionLink>
        <SideSelectionLink onClick={handleGoToBathymetry}>
          <Icon icon="bi:badge-3d-fill" />
        </SideSelectionLink>
        <SideSelectionLink onClick={handleEraseLayers}>
          <FontAwesomeIcon title={"Clean map"} icon={faTrash} />
        </SideSelectionLink>
      </SideSelectionContainer>
    </>
  )
}
