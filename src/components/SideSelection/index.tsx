import { SideSelectionContainer, SideSelectionLink } from "./styles";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalculator, faCamera, faLayerGroup, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Icon } from '@iconify/react';

interface SideSelectionProps{
  layer: boolean,
  setLayer: any,
  selectedLayers: Object,
  setSelectedLayers: any,
  actualLayer: string,
  setActualLayer: any
}

export function SideSelection({layer, setLayer, selectedLayers, setSelectedLayers, actualLayer, setActualLayer}: SideSelectionProps ) {

  function handleShowLayerSelection() {
    setLayer((layer: any) => !layer)
  }

  function handleEraseLayers() {
    setSelectedLayers({})
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
        <SideSelectionLink>
          <Icon icon="bi:badge-3d-fill" />
        </SideSelectionLink>
        <SideSelectionLink onClick={handleEraseLayers}>
          <FontAwesomeIcon title={"Clean map"} icon={faTrash} />
        </SideSelectionLink>
      </SideSelectionContainer>
    </>
  )
}
