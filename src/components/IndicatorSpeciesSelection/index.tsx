import {
  LayerSelectionContainer,
  LayerSelectionTitle,
  LayerTypes,
} from '../DataExplorationSelection/styles'
import { Info } from 'phosphor-react'
import { IndicatorSpeciesType } from '../IndicatorSpeciesType'
import { listIndicatorSpecies } from './listIndicatorSpecies'

interface IndicatorSpeciesSelectionProps {
  setCalculationValue: any
  selectedArea: boolean
  setSelectedArea: any
  latLonLimits: any
  setLatLonLimits: any
  setInfoButtonBox?: any
}

export function IndicatorSpeciesSelection({
  setCalculationValue,
  selectedArea,
  setSelectedArea,
  latLonLimits,
  setLatLonLimits,
  setInfoButtonBox,
}: IndicatorSpeciesSelectionProps) {
  // const [calcClasses, setCalcClasses] = useState(listBiodiversities)

  const calcClasses = listIndicatorSpecies

  function handleClickLayerInfo(title: String, content: string) {
    setInfoButtonBox({
      title,
      content,
    })
  }

  return (
    <LayerSelectionContainer>
      <LayerSelectionTitle>
        <div>
          <h1>Indicator Species</h1>
          <Info
            size={20}
            onClick={() =>
              handleClickLayerInfo(
                'Indicator Species',
                'Some information about...',
              )
            }
          />
        </div>
      </LayerSelectionTitle>
      <LayerTypes>
        {/* <AreaSelector
          setCalculationValue={setCalculationValue}
          selectedArea={selectedArea}
          setSelectedArea={setSelectedArea}
          latLonLimits={latLonLimits}
          setLatLonLimits={setLatLonLimits}
          setInfoButtonBox={setInfoButtonBox}
        /> */}
        {calcClasses.map((calcClass) => {
          return (
            <IndicatorSpeciesType
              key={calcClass.calcClass}
              title={calcClass.calcClass}
              content={calcClass.content}
              childs={calcClass.calcNames}
              setCalculationValue={setCalculationValue}
              latLonLimits={latLonLimits}
              selectedArea={selectedArea}
              setInfoButtonBox={setInfoButtonBox}
            />
          )
        })}
      </LayerTypes>
    </LayerSelectionContainer>
  )
}
