import { ThreeDContainer } from './styles'
import { useState } from 'react'
import { SideSelection } from '../../components/SideSelection'
import { SideBar } from '../TileServer/styles'
import { ThreeDMap } from '../../components/ThreeDMap'

export function ThreeD() {
  const [layer, setLayer] = useState<boolean>(false)

  const [selectedLayers, setSelectedLayers] = useState<Object>({})

  const [actualLayer, setActualLayer] = useState<string[]>([''])

  const [layerAction, setLayerAction] = useState('')

  return (
    <ThreeDContainer>
      <SideBar>
        <SideSelection
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
      <ThreeDMap />
    </ThreeDContainer>
  )
}
