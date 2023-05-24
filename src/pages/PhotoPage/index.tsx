import { PhotoPageContainer } from './styles'
import { useState } from 'react'
import { SideSelection } from '../../components/SideSelection'
import { SideBar } from '../TileServer/styles'
import { useParams } from 'react-router'
import { MapHomeSimple } from '../../components/MapHomeSimple'

export function PhotoPage() {
  const [selectedArea, setSelectedArea] = useState(false)

  const [selectedLayers, setSelectedLayers] = useState<Object>({})

  const [actualLayer, setActualLayer] = useState<string[]>([''])

  const [showPhotos, setShowPhotos] = useState<object[]>([])

  const [contrast, setContrast] = useState<boolean>(false)
  const [layerAction, setLayerAction] = useState('')
  const { id } = useParams()

  return (
    <PhotoPageContainer>
      <SideBar>
        <SideSelection
          selectedLayers={selectedLayers}
          setSelectedLayers={setSelectedLayers}
          actualLayer={actualLayer}
          setActualLayer={setActualLayer}
          setLayerAction={setLayerAction}
          setSelectedArea={setSelectedArea}
          setShowPhotos={setShowPhotos}
          photoId={id}
          photoPage={true}
          contrast={contrast}
          setContrast={setContrast}
        />
      </SideBar>
      <MapHomeSimple
        photoId={id}
        contrast={contrast}
        setContrast={setContrast}
        actualLayer={actualLayer}
        setActualLayer={setActualLayer}
      />
    </PhotoPageContainer>
  )
}
