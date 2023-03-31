import { SideSelectionContainer, SideSelectionLink } from "./styles";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalculator, faCamera, faLayerGroup, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Icon } from '@iconify/react';
import { useNavigate } from "react-router-dom";

interface SideSelectionProps{
  layer: boolean,
  setLayer: any,
  selectedLayers: Object,
  setSelectedLayers: any,
  actualLayer: string[],
  setActualLayer: any,
  setLayerAction: any,
}

export function SideSelection({layer, setLayer, selectedLayers, setSelectedLayers, actualLayer, setActualLayer, setLayerAction}: SideSelectionProps ) {

  const navigate = useNavigate();

  function handleShowLayerSelection() {
    if (window.location.pathname === '/bathymetry') {
      navigate('/')
    } else{
      setLayer((layer: any) => !layer)
    }
  }

  function handleEraseLayers() {
    setActualLayer(Object.keys(selectedLayers))
    setSelectedLayers({})
    setLayerAction('remove')
  }

  function handleGoToBathymetry() {
    if (window.location.pathname !== '/bathymetry') {
      navigate('/bathymetry')
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
        <SideSelectionLink >
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
