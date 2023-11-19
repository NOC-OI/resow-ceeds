import { Fish, Mountains, StackSimple, Waves } from 'phosphor-react'
import { useState } from 'react'
import { CalcTypeContainer } from '../DataExplorationType/styles'
import { ThreeDDataExplorationTypeOptions } from '../ThreeDDataExplorationTypeOptions'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCube } from '@fortawesome/free-solid-svg-icons'

interface keyable {
  [key: string]: any
}

interface ThreeDDataExplorationTypeProps {
  content: String
  childs: Object
  selectedLayers: keyable
  setSelectedLayers: any
  setActualLayer: any
  layerAction: String
  setLayerAction: any
  setLayerLegend: any
  setInfoButtonBox?: any
  isLogged?: any
  threeD: any
  setThreeD: any
  listLayers: any
}

export function ThreeDDataExplorationType({
  content,
  childs,
  selectedLayers,
  setSelectedLayers,
  setActualLayer,
  layerAction,
  setLayerAction,
  setLayerLegend,
  setInfoButtonBox,
  isLogged,
  threeD,
  setThreeD,
  listLayers,
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
        <header
          id="general-types"
          onClick={handleShowLayers}
          style={isActive ? { color: '#D49511' } : { color: 'white' }}
        >
          <div className="flex">
            <span title="expand">
              {listLayers[`${content}`].icon === 'mountain' ? (
                <Mountains size={30} />
              ) : listLayers[`${content}`].icon === 'waves' ? (
                <Waves size={30} />
              ) : listLayers[`${content}`].icon === 'fish' ? (
                <Fish size={30} />
              ) : listLayers[`${content}`].icon === 'area' ? (
                <StackSimple size={32} />
              ) : (
                <StackSimple size={32} />
              )}
            </span>
            <p>{content}</p>
            {content === 'Bathymetry' ? (
              threeD ? (
                <FontAwesomeIcon
                  className="pl-3 active"
                  icon={faCube}
                  title="Terrain layer active"
                />
              ) : (
                <FontAwesomeIcon
                  className="pl-3"
                  icon={faCube}
                  title="Terrain layer available"
                />
              )
            ) : null}
          </div>
        </header>
      </div>
      <div>
        {Object.keys(subLayers).map((subLayer) => {
          if (subLayers[subLayer].data_type !== 'MBTiles') {
            return (
              <ThreeDDataExplorationTypeOptions
                key={`${content}_${subLayer}`}
                subLayer={subLayer}
                content={content}
                activeOpacity={activeOpacity}
                setActiveOpacity={setActiveOpacity}
                setActualLayer={setActualLayer}
                subLayers={subLayers}
                setLayerLegend={setLayerLegend}
                layerAction={layerAction}
                setLayerAction={setLayerAction}
                selectedLayers={selectedLayers}
                setSelectedLayers={setSelectedLayers}
                setInfoButtonBox={setInfoButtonBox}
                isLogged={isLogged}
                threeD={threeD}
                setThreeD={setThreeD}
              />
            )
          } else {
            return <></>
          }
        })}
      </div>
    </CalcTypeContainer>
  )
}
