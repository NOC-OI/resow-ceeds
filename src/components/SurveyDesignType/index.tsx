import { ArrowCircleDown, ArrowCircleUp } from 'phosphor-react'
import { useEffect, useState } from 'react'
import {
  CalcTypeContainer,
  CalcTypeOptionsContainer,
} from '../BiodiversityType/styles'
import { Loading } from '../Loading'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons'
import { allYears } from '../../data/allYears'

interface keyable {
  [key: string]: any
}
interface SurveyDesignTypeProps {
  title: string
  content: string
  childs: any
  setInfoButtonBox?: any
  dynamicGraphData: any
  setDynamicGraphData: any
  fileSurveyDesign: any
  setFileSurveyDesign: any
  dynamicTableData: any
  setDynamicTableData: any
  yearSelected: any
  setYearSelected: any
}

async function handleShowGraphValues(
  params: keyable,
  setDynamicGraphData: any,
  setLoading: any,
  fileSurveyDesign: any,
  yearSelected: any,
) {
  setLoading(true)
  setDynamicGraphData(null)

  const APIBaseUrl = process.env.VITE_API_URL
  let url = `${APIBaseUrl}${params.url}${fileSurveyDesign}`
  let fileNames = ''
  if (yearSelected === allYears.length - 1) {
    Object.keys(params.years).forEach((year: string) => {
      fileNames += `${params.years[year].file_names},`
    })
    fileNames = fileNames.slice(0, -1)
  } else {
    fileNames = params.years[allYears[yearSelected]].file_names
  }
  url = url.replaceAll('file_names', fileNames)

  async function getCalculationResults() {
    const response = await fetch(url, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    })
    const data = { name: {}, data: null }
    params.habitat = params.years[allYears[yearSelected]].habitat
    data.name = params
    data.data = await response.json()
    setDynamicGraphData(data)
    setLoading(false)
  }
  await getCalculationResults()
}

export function SurveyDesignType({
  title,
  content,
  childs,
  setInfoButtonBox,
  dynamicGraphData,
  setDynamicGraphData,
  fileSurveyDesign,
  dynamicTableData,
  setDynamicTableData,
  yearSelected,
  setYearSelected,
}: SurveyDesignTypeProps) {
  const [subCalcs, setSubCalcs] = useState([])

  const [isActive, setIsActive] = useState(false)

  const [loading, setLoading] = useState<boolean>(false)

  function handleShowCalcOptions() {
    setIsActive((isActive) => !isActive)
    setSubCalcs((subCalcs) => (subCalcs.length === 0 ? childs : []))
  }

  useEffect(() => {
    if (dynamicGraphData) {
      const copyDynamicGraphData = { ...dynamicGraphData }
      setDynamicGraphData(null)
      handleShowGraphValues(
        copyDynamicGraphData.name,
        setDynamicGraphData,
        setLoading,
        fileSurveyDesign,
        yearSelected,
      )
    }
  }, [fileSurveyDesign])

  function handleClickLayerInfo(title: string, content: String) {
    setInfoButtonBox({
      title,
      content,
    })
  }

  async function handleShowTableValues(subCalc: keyable) {
    setDynamicTableData(subCalc)
  }

  return (
    <CalcTypeContainer>
      <div>
        <header id="general-types">
          <p onClick={handleShowCalcOptions}>{title}</p>
          <div>
            <span>
              <FontAwesomeIcon
                id="info-subsection-button"
                icon={faCircleInfo}
                onClick={() => handleClickLayerInfo(title, content)}
              />
            </span>
            <span title="expand" onClick={handleShowCalcOptions}>
              {isActive ? (
                <ArrowCircleUp size={24} />
              ) : (
                <ArrowCircleDown size={24} />
              )}
            </span>
          </div>
        </header>
      </div>
      <div>
        {subCalcs.map((subCalc: any) => {
          return (
            <CalcTypeOptionsContainer
              key={`${title}_${subCalc.name}_${subCalc.url}`}
            >
              <label>
                {Object.keys(subCalc.years).includes(allYears[yearSelected]) ||
                yearSelected === allYears.length - 1 ? (
                  <p
                    id="type-option"
                    onClick={async () => {
                      title === 'Biodiversity representation'
                        ? await handleShowGraphValues(
                            subCalc,
                            setDynamicGraphData,
                            setLoading,
                            fileSurveyDesign,
                            yearSelected,
                          )
                        : await handleShowTableValues(subCalc)
                    }}
                  >
                    {subCalc.name}
                  </p>
                ) : (
                  <p
                    id="type-option"
                    className={'opacity-40 cursor-not-allowed'}
                  >
                    {subCalc.name}
                  </p>
                )}
              </label>
            </CalcTypeOptionsContainer>
          )
        })}
      </div>
      {loading ? <Loading /> : null}
    </CalcTypeContainer>
  )
}

// https://mpa-ows.jncc.gov.uk/geoserver/mpa_mapper/wms?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image%2Fpng8&TRANSPARENT=true&LAYERS=prot_annexi_reef_full&TILED=TRUE&WIDTH=256&HEIGHT=256&CRS=EPSG%3A4327&STYLES=&BBOX=40%2C-10%2C50%2C2
