import { listHabitats } from './listHabitats'
import {
  LayerSelectionContainer,
  LayerSelectionTitle,
  LayerTypes,
} from '../DataExplorationSelection/styles'
import { AreaSelector } from '../AreaSelector'
import { HabitatType } from '../HabitatType'
import { Info } from 'phosphor-react'

interface HabitatSelectionProps {
  setCalculationValue: any
  selectedArea: boolean
  setSelectedArea: any
  latLonLimits: any
  setLatLonLimits: any
  setInfoButtonBox?: any
}

export function HabitatSelection({
  setCalculationValue,
  selectedArea,
  setSelectedArea,
  latLonLimits,
  setLatLonLimits,
  setInfoButtonBox,
}: HabitatSelectionProps) {
  // const [calcClasses, setCalcClasses] = useState(listHabitats)

  const calcClasses = listHabitats

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
          <h1>Habitats</h1>
          <Info
            size={20}
            onClick={() =>
              handleClickLayerInfo(
                'Habitats',
                'Some information about habitats...',
              )
            }
          />
        </div>
      </LayerSelectionTitle>
      <LayerTypes>
        <AreaSelector
          setCalculationValue={setCalculationValue}
          selectedArea={selectedArea}
          setSelectedArea={setSelectedArea}
          latLonLimits={latLonLimits}
          setLatLonLimits={setLatLonLimits}
          setInfoButtonBox={setInfoButtonBox}
        />
        {calcClasses.map((calcClass) => {
          return (
            <HabitatType
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
