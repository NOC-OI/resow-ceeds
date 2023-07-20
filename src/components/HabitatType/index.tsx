import { ArrowCircleDown, ArrowCircleUp } from 'phosphor-react'
import { useState } from 'react'
import { CalcTypeContainer, CalcTypeOptionsContainer } from './styles'
import { Loading } from '../Loading'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons'
import ReactMarkdown from 'react-markdown'
import rehypeKatex from 'rehype-katex'
import remarkBreaks from 'remark-breaks'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'

interface keyable {
  [key: string]: any
}

interface HabitatTypeProps {
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
) {
  setLoading(true)
  setCalculationValue(null)

  const APIBaseUrl = process.env.VITE_API_URL

  let url = `${APIBaseUrl}${params.url}`
  if (selectedArea) {
    url = `${url}&bbox=${latLonLimits[2].lat},${latLonLimits[0].lng},${latLonLimits[0].lat},${latLonLimits[2].lng}`
  }
  async function getCalculationResults() {
    console.log(url)
    const response = await fetch(url, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    })
    const data = await response.json()
    // const deleteKey = Object.keys(data)[0]
    // data[`${deleteKey} ${params.name.toLowerCase()}`] = data[deleteKey]
    // delete data[deleteKey]
    params.result = data
    params.button = true
    // const newCalculationValue = dat: Object = {}
    // newCalculationValue[params.name as keyof Object] = data
    setCalculationValue(params)
    setLoading(false)
  }
  await getCalculationResults()
}

export function HabitatType({
  title,
  content,
  childs,
  setCalculationValue,
  latLonLimits,
  selectedArea,
  setInfoButtonBox,
}: HabitatTypeProps) {
  const [subCalcs, setSubCalcs] = useState([])

  const [isActive, setIsActive] = useState(false)

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
          <div onClick={handleShowCalcOptions}>
            <ReactMarkdown
              children={title}
              remarkPlugins={[remarkGfm, remarkMath, remarkBreaks]}
              rehypePlugins={[rehypeKatex]}
              linkTarget={'_blank'}
            />
          </div>
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
                  onClick={async () => {
                    await handleShowCalcValues(
                      subCalc,
                      setCalculationValue,
                      setLoading,
                      latLonLimits,
                      selectedArea,
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
