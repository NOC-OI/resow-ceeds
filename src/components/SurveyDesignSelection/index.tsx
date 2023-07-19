import {
  LayerSelectionContainer,
  LayerSelectionTitle,
  LayerTypes,
} from '../DataExplorationSelection/styles'
// import { AreaSelector } from '../AreaSelector'
import { Info } from 'phosphor-react'
import { SurveyDesignType } from '../SurveyDesignType'
// import { AreaSelector } from '../AreaSelector'
import { listSurveyDesign } from '../../data/listSurveyDesign'

interface SurveyDesignSelectionProps {
  setInfoButtonBox?: any
  dynamicGraphData: any
  setDynamicGraphData: any
  fileSurveyDesign: any
  setFileSurveyDesign: any
}

export function SurveyDesignSelection({
  setInfoButtonBox,
  dynamicGraphData,
  setDynamicGraphData,
  fileSurveyDesign,
  setFileSurveyDesign,
}: SurveyDesignSelectionProps) {
  // const [calcClasses, setCalcClasses] = useState(listHabitats)

  const calcClasses = listSurveyDesign

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
          <h1>Survey Design</h1>
          <Info
            size={20}
            onClick={() =>
              handleClickLayerInfo(
                'Survey Design',
                'Some information about...',
                { layers: ['Seabed Images_2012 AUV Image Survey'] },
              )
            }
          />
        </div>
      </LayerSelectionTitle>
      <LayerTypes>
        {calcClasses.map((calcClass) => {
          return (
            <SurveyDesignType
              key={calcClass.calcClass}
              title={calcClass.calcClass}
              content={calcClass.content}
              childs={calcClass.calcNames}
              setInfoButtonBox={setInfoButtonBox}
              dynamicGraphData={dynamicGraphData}
              setDynamicGraphData={setDynamicGraphData}
              fileSurveyDesign={fileSurveyDesign}
              setFileSurveyDesign={setFileSurveyDesign}
            />
          )
        })}
      </LayerTypes>
    </LayerSelectionContainer>
  )
}
