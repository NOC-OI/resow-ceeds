import { listBiodiversities } from './listBiodiversities'
// import { useState } from 'react'
import {
  LayerSelectionContainer,
  LayerSelectionTitle,
  LayerTypes,
} from '../DataExplorationSelection/styles'
import { Info } from 'phosphor-react'
import { BiodiversityType } from '../BiodiversityType'

interface BiodiversitySelectionProps {
  setCalculationValue: any
  selectedArea: boolean
  setSelectedArea: any
  latLonLimits: any
  setLatLonLimits: any
  setInfoButtonBox?: any
}

export function BiodiversitySelection({
  setCalculationValue,
  selectedArea,
  setSelectedArea,
  latLonLimits,
  setLatLonLimits,
  setInfoButtonBox,
}: BiodiversitySelectionProps) {
  // const [calcClasses, setCalcClasses] = useState(listBiodiversities)

  const calcClasses = listBiodiversities

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
          <h1>Biodiversity</h1>
          <Info
            size={20}
            onClick={() =>
              handleClickLayerInfo('Biodiversity', 'Some information about...')
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
            <BiodiversityType
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
