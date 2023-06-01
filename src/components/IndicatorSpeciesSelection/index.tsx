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
  selectedLayers: any
  setSelectedLayers: any
  layerAction: any
  setLayerAction: any
  actualLayer: any
  setActualLayer: any
  listLayers: any
  setShowPhotos: any
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
          <h1>Species of Interest</h1>
          <Info
            size={20}
            onClick={() =>
              handleClickLayerInfo(
                'Species of Interest',
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
