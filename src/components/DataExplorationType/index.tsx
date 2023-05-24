import { ArrowCircleDown, ArrowCircleUp } from 'phosphor-react'
import { useEffect, useState } from 'react'
import { LayerTypeContainer } from './styles'
import { DataExplorationTypeOptions } from '../DataExplorationTypeOptions'

interface keyable {
  [key: string]: any
}

interface DataExplorationTypeProps {
  content: String
  childs: Object
  selectedLayers: keyable
  setSelectedLayers: any
  actualLayer: string[]
  setActualLayer: any
  layerAction: String
  setLayerAction: any
  layerLegend: any
  setLayerLegend: any
  setInfoButtonBox?: any
  setShowPhotos?: any
}

export function DataExplorationType({
  content,
  childs,
  selectedLayers,
  setSelectedLayers,
  actualLayer,
  setActualLayer,
  layerAction,
  setLayerAction,
  layerLegend,
  setLayerLegend,
  setInfoButtonBox,
  setShowPhotos,
}: DataExplorationTypeProps) {
  const [subLayers, setSubLayers] = useState<keyable>({})

  const [activeOpacity, setActiveOpacity] = useState(null)

  const [isActive, setIsActive] = useState(false)

  function handleShowLayers() {
    setIsActive((isActive) => !isActive)
    setSubLayers((subLayers) =>
      Object.keys(subLayers).length === 0 ? childs : {},
    )
  }

  useEffect(() => {
    if (layerAction) {
      const photoList: any[] = []
      Object.keys(selectedLayers).forEach((layer) => {
        if (selectedLayers[layer].data_type === 'Photo') {
          selectedLayers[layer].photos.forEach((photo: any) => {
            photo.layerName = actualLayer[0]
            photoList.push(photo)
          })
        }
      })
      setShowPhotos(photoList)
    }
  }, [selectedLayers])

  return (
    <LayerTypeContainer>
      <div>
        <header onClick={handleShowLayers}>
          <p>{content}</p>
          <span>
            {isActive ? (
              <ArrowCircleUp size={24} />
            ) : (
              <ArrowCircleDown size={24} />
            )}
          </span>
        </header>
      </div>
      <div>
        {Object.keys(subLayers).map((subLayer) => {
          return (
            <DataExplorationTypeOptions
              key={`${content}_${subLayer}`}
              subLayer={subLayer}
              content={content}
              activeOpacity={activeOpacity}
              setActiveOpacity={setActiveOpacity}
              setActualLayer={setActualLayer}
              subLayers={subLayers}
              layerLegend={layerLegend}
              setLayerLegend={setLayerLegend}
              layerAction={layerAction}
              setLayerAction={setLayerAction}
              selectedLayers={selectedLayers}
              setSelectedLayers={setSelectedLayers}
              setInfoButtonBox={setInfoButtonBox}
            />
          )
        })}
      </div>
    </LayerTypeContainer>
  )
}
