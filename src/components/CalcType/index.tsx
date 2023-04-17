import { ArrowCircleDown, ArrowCircleUp } from "phosphor-react";
import { useState } from "react";
import { CalcTypeContainer, CalcTypeOptionsContainer } from "./styles";
import { Loading } from "../Loading";

interface keyable {
  [key: string]: any
}


interface CalcTypeProps {
  content: String
  childs: Object
  setCalculationValue: any,
  latLonLimits: any,
  selectedArea: any,
}

interface CalcTypeOptionsProps {
  subCalc: any,
}

async function handleShowCalcValues(params: keyable, setCalculationValue: any, setLoading: any, latLonLimits: any, selectedArea: any){
  setLoading(true)
  setCalculationValue(null)

  const baseUrl = 'https://haigfras-api.herokuapp.com'
  let url = `${baseUrl}${params['url']}`
  if (selectedArea) {
    url = `${url}&bbox=${latLonLimits[2].lat},${latLonLimits[0].lng},${latLonLimits[0].lat},${latLonLimits[2].lng}`
  }

  async function getCalculationResults() {
    const response = await fetch(url, {
        method: 'GET',
        mode: 'cors',
        headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin':'*'},
    })
    const data = await response.json();
    const newCalculationValue: Object = {}
    newCalculationValue[params.name as keyof Object] = data
    setCalculationValue(newCalculationValue)
    setLoading(false)
  }
  await getCalculationResults()
}

export function CalcType({ content, childs, setCalculationValue, latLonLimits, selectedArea}: CalcTypeProps) {

  const [subCalcs, setSubCalcs] = useState<keyable>({})

  const [isActive, setIsActive] = useState(false);

  const [loading, setLoading] = useState<boolean>(false)

  function handleShowCalcOptions() {
    setIsActive(isActive => !isActive)
    setSubCalcs(subCalcs => Object.keys(subCalcs).length === 0? childs : {})
  }

  return (
      <CalcTypeContainer>
        <div>
          <header onClick={handleShowCalcOptions}>
            <p>{content}</p>
            <span>
              {isActive? <ArrowCircleUp size={24} /> : <ArrowCircleDown size={24} />}
            </span>
          </header>
        </div>
        <div>
          {Object.keys(subCalcs).map(subCalc => {
            let newValue = subCalcs[subCalc]
            return (
              <CalcTypeOptionsContainer key={subCalcs[subCalc]['url']}>
                <label>
                  {/* <p>{subCalcs[subCalc]['name']}</p> */}
                  <p onClick={async() => {await handleShowCalcValues(subCalcs[subCalc], setCalculationValue, setLoading, latLonLimits, selectedArea)}}>{subCalcs[subCalc]['name']}</p>
                </label>
              </CalcTypeOptionsContainer>
            )
          })}
        </div>
        {loading ? <Loading/> : null }
      </CalcTypeContainer>
  )
}

// https://mpa-ows.jncc.gov.uk/geoserver/mpa_mapper/wms?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image%2Fpng8&TRANSPARENT=true&LAYERS=prot_annexi_reef_full&TILED=TRUE&WIDTH=256&HEIGHT=256&CRS=EPSG%3A4327&STYLES=&BBOX=40%2C-10%2C50%2C2
