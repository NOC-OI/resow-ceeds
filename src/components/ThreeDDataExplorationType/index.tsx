import { ArrowCircleDown, ArrowCircleUp } from 'phosphor-react'
import { useState } from 'react'
// import { LayerTypeContainer } from './styles'
import { CalcTypeContainer } from '../BiodiversityType/styles'
import { ThreeDDataExplorationTypeOptions } from '../ThreeDDataExplorationTypeOptions'

interface keyable {
  [key: string]: any
}

interface ThreeDDataExplorationTypeProps {
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
  isLogged?: any
}

export function ThreeDDataExplorationType({
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
  isLogged,
}: ThreeDDataExplorationTypeProps) {
  const [subLayers, setSubLayers] = useState<keyable>({})

  const [activeOpacity, setActiveOpacity] = useState(null)

  const [isActive, setIsActive] = useState(false)

  function handleShowLayers() {
    setIsActive((isActive) => !isActive)
    setSubLayers((subLayers) =>
      Object.keys(subLayers).length === 0 ? childs : {},
    )
  }

  return (
    <CalcTypeContainer>
      <div>
        <header id="general-types" onClick={handleShowLayers}>
          <p>{content}</p>
          <span title="expand">
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
            <ThreeDDataExplorationTypeOptions
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
              isLogged={isLogged}
            />
          )
        })}
      </div>
    </CalcTypeContainer>
  )
}
