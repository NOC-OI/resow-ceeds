import { useEffect } from 'react'
import { CalcTypeOptionsContainer } from '../BiodiversityType/styles'
import ReactMarkdown from 'react-markdown'
import rehypeKatex from 'rehype-katex'
import remarkBreaks from 'remark-breaks'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'

interface IndicatorSpeciesTypeOptionsProps {
  title: any
  subLayer: any
  subLayers: any
  setInfoButtonBox: any
  isClicked: any
  setIsClicked: any
  selectedLayers: any
  setSelectedLayers: any
  layerAction: any
  setLayerAction: any
  actualLayer: any
  setActualLayer: any
  listLayers: any
  setShowPhotos: any
  setLoading: any
  setCalculationValue: any
}

export function IndicatorSpeciesTypeOptions({
  title,
  subLayer,
  subLayers,
  setInfoButtonBox,
  isClicked,
  setIsClicked,
  selectedLayers,
  setSelectedLayers,
  layerAction,
  setLayerAction,
  actualLayer,
  setActualLayer,
  listLayers,
  setShowPhotos,
  setLoading,
  setCalculationValue,
}: IndicatorSpeciesTypeOptionsProps) {
  function verifyIfWasSelectedBefore(subLayer: string) {
    return !!selectedLayers[subLayer]
  }

  async function fetchDatatoUpdateCalculationBox(result: any) {
    setLoading(true)
    setCalculationValue(null)
    // const baseUrl = 'http://localhost:8000'
    const baseUrl = 'https://imfe-pilot.ddns.net/'
    const url = `${baseUrl}${subLayer.url}`
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
      data[subLayer.name] = data[deleteKey]
      delete data[deleteKey]
      subLayer.result = data
      setCalculationValue(subLayer)
      setLoading(false)
    }
    await getCalculationResults()
  }

  function changeMapLayer(newSelectedLayers: any) {
    setLayerAction('marker-changes')
    setSelectedLayers((selectedLayers: any) => {
      const copy = { ...selectedLayers }
      newSelectedLayers.forEach((layerInfo: any) => {
        delete copy[layerInfo.subLayer]
        layerInfo.dataInfo.opacity = 1
        layerInfo.dataInfo.zoom = true
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
    // if (verifyIfWasSelectedBefore(layerInfo.subLayer)) {
    changeMapLayer(newSelectedLayers)

    await fetchDatatoUpdateCalculationBox(subLayer)
  }

  useEffect(() => {
    if (layerAction) {
      const photoList: any[] = []
      Object.keys(selectedLayers).forEach((layer) => {
        if (selectedLayers[layer].data_type === 'Photo') {
          selectedLayers[layer].photos.forEach((photo: any) => {
            photo.layerName = actualLayer[0]
            photoList.push(photo)
          })
        }
      })
      setShowPhotos([])
      // setShowPhotos(photoList)
    }
  }, [selectedLayers])

  return (
    <CalcTypeOptionsContainer>
      <div>
        <label
          key={`${subLayer.name}_${subLayer}`}
          htmlFor={subLayer.name}
          onClick={async () => {
            await handleChangeMapLayer(subLayer)
          }}
        >
          {/* <p>{subCalcs[subCalc]['name']}</p> */}
          <ReactMarkdown
            children={subLayer.name}
            remarkPlugins={[remarkGfm, remarkMath, remarkBreaks]}
            rehypePlugins={[rehypeKatex]}
            linkTarget={'_blank'}
          />
        </label>
        {/* {verifyIfWasSelectedBefore(content, subLayer) ? (
          <div>
            <FontAwesomeIcon
              icon={faCircleInfo}
              title={'Show Layer Info'}
              // onClick={() => handleClickLayerInfo(content, subLayer)}
            />
          </div>
        ) : null} */}
      </div>
    </CalcTypeOptionsContainer>
  )
}
