import { ArrowCircleDown, ArrowCircleUp } from 'phosphor-react'
import { useState } from 'react'
import { LayerTypeContainer } from '../DataExplorationType/styles'
import { IndicatorSpeciesTypeOptions } from '../IndicatorSpeciesTypeOptions'
import { Loading } from '../Loading'

interface IndicatorSpeciesTypeProps {
  title: any
  content: any
  childs: any
  setCalculationValue: any
  latLonLimits: any
  selectedArea: any
  setInfoButtonBox: any
  selectedLayers: any
  setSelectedLayers: any
  layerAction: any
  setLayerAction: any
  actualLayer: any
  setActualLayer: any
  listLayers: any
  setShowPhotos: any
}

export function IndicatorSpeciesType({
  title,
  content,
  childs,
  setCalculationValue,
  latLonLimits,
  selectedArea,
  setInfoButtonBox,
  selectedLayers,
  setSelectedLayers,
  layerAction,
  setLayerAction,
  actualLayer,
  setActualLayer,
  listLayers,
  setShowPhotos,
}: IndicatorSpeciesTypeProps) {
  const [subLayers, setSubLayers] = useState([])

  const [isActive, setIsActive] = useState(false)

  const [isClicked, setIsClicked] = useState('')

  const [loading, setLoading] = useState<boolean>(false)

  function handleShowLayers() {
    setIsActive((isActive) => !isActive)
    setSubLayers((subLayers) =>
      Object.keys(subLayers).length === 0 ? childs : [],
    )
  }
  return (
    <LayerTypeContainer>
      <div>
        <header onClick={handleShowLayers}>
          <p>{title}</p>
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
        {subLayers.map((subLayer: any) => {
          return (
            <IndicatorSpeciesTypeOptions
              key={`${content}_${subLayer.name}`}
              subLayer={subLayer}
              subLayers={subLayers}
              setInfoButtonBox={setInfoButtonBox}
              isClicked={isClicked}
              setIsClicked={setIsClicked}
              selectedLayers={selectedLayers}
              setSelectedLayers={setSelectedLayers}
              layerAction={layerAction}
              setLayerAction={setLayerAction}
              actualLayer={actualLayer}
              setActualLayer={setActualLayer}
              listLayers={listLayers}
              setShowPhotos={setShowPhotos}
              setLoading={setLoading}
              setCalculationValue={setCalculationValue}
            />
          )
        })}
      </div>
      {loading && <Loading />}
    </LayerTypeContainer>
  )
}
