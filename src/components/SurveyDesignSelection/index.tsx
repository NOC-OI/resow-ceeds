import { listSurveyDesign } from './listSurveyDesign'
import {
  LayerSelectionContainer,
  LayerSelectionTitle,
  LayerTypes,
} from '../DataExplorationSelection/styles'
// import { AreaSelector } from '../AreaSelector'
import { Info } from 'phosphor-react'
import { SurveyDesignType } from '../SurveyDesignType'
import { AreaSelector } from '../AreaSelector'

interface SurveyDesignSelectionProps {
  setCalculationValue: any
  selectedArea: boolean
  setSelectedArea: any
  latLonLimits: any
  setLatLonLimits: any
  setInfoButtonBox?: any
}

export function SurveyDesignSelection({
  setCalculationValue,
  selectedArea,
  setSelectedArea,
  latLonLimits,
  setLatLonLimits,
  setInfoButtonBox,
}: SurveyDesignSelectionProps) {
  // const [calcClasses, setCalcClasses] = useState(listHabitats)

  const calcClasses = listSurveyDesign

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
          <h1>Survey Design</h1>
          <Info
            size={20}
            onClick={() =>
              handleClickLayerInfo('Survey Design', 'Some information about...')
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
            <SurveyDesignType
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
