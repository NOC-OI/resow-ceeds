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
  selectedLayers: any
  setSelectedLayers: any
  layerAction: any
  setLayerAction: any
  actualLayer: any
  setActualLayer: any
  listLayers: any
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

  const APIBaseUrl = process.env.VITE_API_URL
  let url = `${APIBaseUrl}${params.url}`
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
  selectedLayers,
  setSelectedLayers,
  layerAction,
  setLayerAction,
  actualLayer,
  setActualLayer,
  listLayers,
}: BiodiversityTypeProps) {
  const [subCalcs, setSubCalcs] = useState([])

  const [isActive, setIsActive] = useState(false)
  const [isActiveText, setIsActiveText] = useState('')

  const [loading, setLoading] = useState<boolean>(false)

  function verifyIfWasSelectedBefore(subLayer: string) {
    return !!selectedLayers[subLayer]
  }

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

  function changeMapLayer(newSelectedLayers: any) {
    setLayerAction('marker-changes')
    setSelectedLayers((selectedLayers: any) => {
      const copy = { ...selectedLayers }
      newSelectedLayers.forEach((layerInfo: any) => {
        delete copy[layerInfo.subLayer]
        layerInfo.dataInfo.opacity = 1
        layerInfo.dataInfo.zoom = true
        layerInfo.dataInfo.plotLimits = true
        copy[layerInfo.subLayer] = layerInfo.dataInfo
      })
      return copy
    })
  }
  async function handleChangeMapLayer(subLayer: any) {
    const newActualLayers: string[] = []
    const newSelectedLayers: { subLayer: string; dataInfo: any }[] = []
    Object.keys(subLayer.layers).forEach((newActualLayer) => {
      subLayer.layers[newActualLayer].forEach((layerClass: any) => {
        newActualLayers.push(`${newActualLayer}_${layerClass}`)
        const layerInfo = {
          subLayer: `${newActualLayer}_${layerClass}`,
          dataInfo: listLayers[newActualLayer].layerNames[layerClass],
        }
        if (verifyIfWasSelectedBefore(`${newActualLayer}_${layerClass}`)) {
          // eslint-disable-next-line dot-notation
          layerInfo.dataInfo['selectedBefore'] = true
        } else {
          // eslint-disable-next-line dot-notation
          layerInfo.dataInfo['selectedBefore'] = false
        }
        layerInfo.dataInfo.show = []
        layerInfo.dataInfo.photos.forEach((photo: any) => {
          if (photo[subLayer.tableName] > 0) {
            layerInfo.dataInfo.show.push(photo.filename)
          }
        })
        newSelectedLayers.push(layerInfo)
      })
    })
    setActualLayer(newActualLayers)
    changeMapLayer(newSelectedLayers)
  }

  return (
    <CalcTypeContainer>
      <div>
        <header id="general-types">
          <p onClick={handleShowCalcOptions}>{title}</p>
          <div>
            <span>
              <FontAwesomeIcon
                icon={faCircleInfo}
                id="info-subsection-button"
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
                {/* <p>{subCalcs[subCalc]['name']}</p> */}
                <p
                  id="type-option"
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
                    await handleChangeMapLayer(subCalc)
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
