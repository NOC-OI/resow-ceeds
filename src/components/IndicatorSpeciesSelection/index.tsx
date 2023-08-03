/* eslint-disable no-multi-str */
import {
  LayerSelectionContainer,
  LayerSelectionTitle,
  LayerTypes,
} from '../DataExplorationSelection/styles'
import { Info } from 'phosphor-react'
import { IndicatorSpeciesType } from '../IndicatorSpeciesType'

interface IndicatorSpeciesSelectionProps {
  setCalculationValue: any
  selectedArea: boolean
  setSelectedArea: any
  latLonLimits: any
  setLatLonLimits: any
  setInfoButtonBox?: any
  selectedLayers: any
  setSelectedLayers: any
  layerAction: any
  setLayerAction: any
  actualLayer: any
  setActualLayer: any
  listLayers: any
  setShowPhotos: any
  dataFields: any
}

export function IndicatorSpeciesSelection({
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
  setShowPhotos,
  dataFields,
}: IndicatorSpeciesSelectionProps) {
  const calcClasses = dataFields.indicatorSpecies

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
          <h1>Species of Interest</h1>
          <Info
            id="info-section-button"
            size={20}
            onClick={() =>
              handleClickLayerInfo(
                'Species of Interest',
                '**Sea pens** \n \
                JNCC lists sea pens as a Habitat Feature of Conservation Importance \
                in the summary of the Greater Haig Fras MPA \
                (https://jncc.gov.uk/our-work/greater-haig-fras-mpa/). Note that sea \
                pens were not observed in seabed photographs captured during the \
                autonomous underwater vehicle surveys. \n \
                **Species of conservation interest** \n \
                These are species of general interest for conservation in the area: \
                Pentapora foliacea, Cartilagenous fish',
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
        {calcClasses.map((calcClass: any) => {
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
              selectedLayers={selectedLayers}
              setSelectedLayers={setSelectedLayers}
              layerAction={layerAction}
              setLayerAction={setLayerAction}
              actualLayer={actualLayer}
              setActualLayer={setActualLayer}
              listLayers={listLayers}
              setShowPhotos={setShowPhotos}
            />
          )
        })}
      </LayerTypes>
    </LayerSelectionContainer>
  )
}
