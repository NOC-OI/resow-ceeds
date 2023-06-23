import { ArrowCircleDown, ArrowCircleUp } from 'phosphor-react'
import { useState } from 'react'
import { CalcTypeContainer, CalcTypeOptionsContainer } from './styles'
import { Loading } from '../Loading'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons'

interface keyable {
  [key: string]: any
}

interface BiodiversityTypeProps {
  title: string
  content: string
  childs: any
  setCalculationValue: any
  latLonLimits: any
  selectedArea: any
  setInfoButtonBox?: any
}

async function handleShowCalcValues(
  params: keyable,
  setCalculationValue: any,
  setLoading: any,
  latLonLimits: any,
  selectedArea: any,
  setIsActiveText: any,
  activeText: any,
) {
  setLoading(true)
  setCalculationValue(null)
  setIsActiveText(activeText)

  const baseUrl = 'https://imfe-pilot-api.noc.ac.uk/'
  // const baseUrl = 'http://localhost:8000'
  let url = `${baseUrl}${params.url}`
  if (selectedArea) {
    url = `${url}&bbox=${latLonLimits[2].lat},${latLonLimits[0].lng},${latLonLimits[0].lat},${latLonLimits[2].lng}`
  }

  async function getCalculationResults() {
    const response = await fetch(url, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    })
    const data = await response.json()
    const deleteKey = Object.keys(data)[0]
    // eslint-disable-next-line dot-notation
    data[params.name] = data[deleteKey]
    delete data[deleteKey]
    params.result = data
    if (params.noButton) {
      params.button = false
    } else {
      params.button = true
    }
    // const newCalculationValue = dat: Object = {}
    // newCalculationValue[params.name as keyof Object] = data
    setCalculationValue(params)
    setLoading(false)
  }
  await getCalculationResults()
}

export function BiodiversityType({
  title,
  content,
  childs,
  setCalculationValue,
  latLonLimits,
  selectedArea,
  setInfoButtonBox,
}: BiodiversityTypeProps) {
  const [subCalcs, setSubCalcs] = useState([])

  const [isActive, setIsActive] = useState(false)
  const [isActiveText, setIsActiveText] = useState('')

  const [loading, setLoading] = useState<boolean>(false)

  function handleShowCalcOptions() {
    setIsActive((isActive) => !isActive)
    setSubCalcs((subCalcs) => (subCalcs.length === 0 ? childs : []))
  }

  function handleClickLayerInfo(title: string, content: String) {
    setInfoButtonBox({
      title,
      content,
    })
  }

  return (
    <CalcTypeContainer>
      <div>
        <header>
          <p onClick={handleShowCalcOptions}>{title}</p>
          <div>
            <span>
              <FontAwesomeIcon
                icon={faCircleInfo}
                onClick={() => handleClickLayerInfo(title, content)}
              />
            </span>
            <span onClick={handleShowCalcOptions}>
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
                {/* <p>{subCalcs[subCalc]['name']}</p> */}
                <p
                  className={
                    isActiveText === `${title}_${subCalc.name}_${subCalc.url}`
                      ? 'active-text'
                      : ''
                  }
                  onClick={async () => {
                    await handleShowCalcValues(
                      subCalc,
                      setCalculationValue,
                      setLoading,
                      latLonLimits,
                      selectedArea,
                      setIsActiveText,
                      `${title}_${subCalc.name}_${subCalc.url}`,
                    )
                  }}
                >
                  {subCalc.name}
                </p>
              </label>
            </CalcTypeOptionsContainer>
          )
        })}
      </div>
      {loading && <Loading />}
    </CalcTypeContainer>
  )
}

// https://mpa-ows.jncc.gov.uk/geoserver/mpa_mapper/wms?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image%2Fpng8&TRANSPARENT=true&LAYERS=prot_annexi_reef_full&TILED=TRUE&WIDTH=256&HEIGHT=256&CRS=EPSG%3A4327&STYLES=&BBOX=40%2C-10%2C50%2C2
