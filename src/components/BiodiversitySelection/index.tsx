/* eslint-disable no-multi-str */
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
  setSelectedArea?: any
  latLonLimits: any
  setLatLonLimits?: any
  setInfoButtonBox?: any
  selectedLayers?: any
  setSelectedLayers?: any
  layerAction?: any
  setLayerAction?: any
  actualLayer?: any
  setActualLayer?: any
  listLayers?: any
}

export function BiodiversitySelection({
  setCalculationValue,
  selectedArea,
  setSelectedArea,
  latLonLimits,
  setLatLonLimits,
  setInfoButtonBox,
  selectedLayers,
  setSelectedLayers,
  layerAction,
  setLayerAction,
  actualLayer,
  setActualLayer,
  listLayers,
}: BiodiversitySelectionProps) {
  // const [calcClasses, setCalcClasses] = useState(listBiodiversities)

  const calcClasses = listBiodiversities

  function handleClickLayerInfo(title: String, content: string, link: any) {
    setInfoButtonBox({
      title,
      content,
      link,
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
              handleClickLayerInfo(
                'Biodiversity',
                'Biodiversity metrics in seabed images captured with the autonomous \
                underwater vehicle were calculated based on replicate photographic sample \
                units within each substratum types that were created by randomly selecting \
                tiles without replacement to meet the target sample unit size (as defined by \
                Benoist *et al*. 2019). \n \
                **Target sample unit size:** 150 m$^2$ \n \
                **Number of sample units in 2012:** \n \
                - hard: 6  \n \
                - hard+coarse: 10  \n \
                - hard+sand: 10 \n \
                - coarse+hard: 29 \n \
                - sand+hard: 6 \n \
                - coarse: 33 \n \
                - sand: 36 \
                ',
                { layers: ['Seabed Images_2012 AUV Image Survey'] },
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
