import { ArrowCircleDown, ArrowCircleUp } from "phosphor-react";
import { useEffect, useRef, useState } from "react";
import { CalcTypeContainer, CalcTypeOptionsContainer } from "./styles";
import { faCircleInfo, faMagnifyingGlass, faSliders } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CalculationValue } from "../CalculationValue";
import { calculateSize } from "@iconify/react";
import { Loading } from "../Loading";

interface keyable {
  [key: string]: any
}


interface CalcTypeProps {
  content: String
  childs: Object
  setCalculationValue: any
}

interface CalcTypeOptionsProps {
  subCalc: any,
}

async function handleShowCalcValues(params: keyable, setCalculationValue: any, setLoading: any){
  setLoading(true)
  setCalculationValue(null)
  const baseUrl = 'https://haigfras-api.herokuapp.com'
  async function getCalculationResults() {
    const response = await fetch(`${baseUrl}${params['url']}`, {
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

export function CalcType({ content, childs, setCalculationValue }: CalcTypeProps) {

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
                  <p onClick={async() => {await handleShowCalcValues(subCalcs[subCalc], setCalculationValue, setLoading)}}>{subCalcs[subCalc]['name']}</p>
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
