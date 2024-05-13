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
  content: string
  childs: object
  selectedLayers: keyable
  setSelectedLayers: any
  setActualLayer: any
  layerAction: string
  setLayerAction: any
  layerLegend: any
  setLayerLegend: any
  setInfoButtonBox?: any
  isLogged?: any
  threeD: any
  setThreeD: any
  listLayers: any
  setDownloadPopup?: any
}

export function ThreeDDataExplorationType({
  content,
  childs,
  selectedLayers,
  setSelectedLayers,
  setActualLayer,
  layerAction,
  setLayerAction,
  layerLegend,
  setLayerLegend,
  setInfoButtonBox,
  isLogged,
  threeD,
  setThreeD,
  listLayers,
  setDownloadPopup,
}: ThreeDDataExplorationTypeProps) {
  const [subLayers, setSubLayers] = useState<keyable>({})

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
            {listLayers[`${content}`].ceeds && (
              <div
                className="flex justify-center items-center pl-2"
                title="Layer produced by RESOW project"
              >
                <img src="favicon.png" className="h-3" />
              </div>
            )}
          </div>
        </header>
      </div>
      <div>
        {Object.keys(subLayers).map((subLayer) => {
          if (subLayers[subLayer].dataType !== 'MBTiles') {
            return (
              <ThreeDDataExplorationTypeOptions
                key={`${content}_${subLayer}`}
                subLayer={subLayer}
                content={content}
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
                threeD={threeD}
                setThreeD={setThreeD}
                setDownloadPopup={setDownloadPopup}
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
