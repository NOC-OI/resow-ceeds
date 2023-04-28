import { PhotoPageContainer } from "./styles";
import { useState } from "react";
import { SideSelection } from "../../components/SideSelection";
import { SideBar } from "../TileServer/styles";
import { useParams } from 'react-router';
import { MapHomeSimple } from "../../components/MapHomeSimple";

export function PhotoPage() {
  const [layer, setLayer] = useState<boolean>(false)

  const [calc, setCalc] = useState<boolean>(false)

  const [photo, setPhoto] = useState<boolean>(false);

  const [selectedArea, setSelectedArea] = useState(false);

  const [selectedLayers, setSelectedLayers] = useState<Object>({})

  const [actualLayer, setActualLayer] = useState<string[]>([''])

  const [showPhotos, setShowPhotos] = useState<object[]>([])


  const [layerAction, setLayerAction] = useState('')
  const { id } = useParams();

  return (
    <PhotoPageContainer>
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
          photo={photo}
          setPhoto={setPhoto}
          setShowPhotos={setShowPhotos}
          photoId={id}
        />
      </SideBar>
      <MapHomeSimple
        photoId={id}
      />
    </PhotoPageContainer>
  )
}
