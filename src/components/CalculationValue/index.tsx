import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { CalculationValueContainer, CalculationValueImage } from './styles'
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons'
import { Button } from '../AreaSelector/styles'
import '../../../index.css'
import { useEffect, useState } from 'react'

interface CalculationValueProps {
  calculationValue: any
  setCalculationValue: any
  selectedLayers: any
  setSelectedLayers: any
  listLayers: any
  layerAction: any
  setLayerAction: any
  actualLayer: any
  setActualLayer: any
  setShowPhotos: any
}

const BASIC_BUCKET_URL =
  'https://pilot-imfe-o.s3-ext.jc.rl.ac.uk/haig-fras/output'

export function CalculationValue({
  calculationValue,
  setCalculationValue,
  selectedLayers,
  setSelectedLayers,
  listLayers,
  layerAction,
  setLayerAction,
  actualLayer,
  setActualLayer,
  setShowPhotos,
}: CalculationValueProps) {
  function handleClose() {
    setCalculationValue('')
  }

  const [activeButton, setActiveButton] = useState('')

  function verifyIfWasSelectedBefore(subLayer: string) {
    return !!selectedLayers[subLayer]
  }

  // function addMapLayer(layerInfo: any) {
  //   setLayerAction('add')
  //   const newSelectedLayer = layerInfo.dataInfo
  //   newSelectedLayer.opacity = 1
  //   newSelectedLayer.zoom = true
  //   setSelectedLayers({
  //     ...selectedLayers,
  //     [layerInfo.subLayer]: newSelectedLayer,
  //   })
  // }

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

  async function handleChangeMapLayer(e: any) {
    setActiveButton(e.currentTarget.id)
    const buttonValue = JSON.parse(e.currentTarget.value)
    const [column, result] = buttonValue.result.split('_')
    const newActualLayers: string[] = []
    const newSelectedLayers: { subLayer: string; dataInfo: any }[] = []
    Object.keys(buttonValue.value.layers).forEach((newActualLayer) => {
      buttonValue.value.layers[newActualLayer].forEach((layerClass: any) => {
        newActualLayers.push(`${newActualLayer}_${layerClass}`)
        const layerInfo = {
          subLayer: `${newActualLayer}_${layerClass}`,
          dataInfo: listLayers[newActualLayer].layerNames[layerClass],
        }
        if (verifyIfWasSelectedBefore(`${newActualLayer}_${layerClass}`)) {
          layerInfo.dataInfo.selectedBefore = true
        } else {
          layerInfo.dataInfo.selectedBefore = false
        }
        layerInfo.dataInfo.show = []
        layerInfo.dataInfo.photos.forEach((photo: any) => {
          if (photo[column] === result) {
            layerInfo.dataInfo.show.push(photo.filename)
          }
        })
        console.log(layerInfo.dataInfo.show)
        newSelectedLayers.push(layerInfo)
      })
    })
    setActualLayer(newActualLayers)
    // if (verifyIfWasSelectedBefore(layerInfo.subLayer)) {
    changeMapLayer(newSelectedLayers)
    // } else {
    //   addMapLayer(layerInfo)
    // }
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
    <CalculationValueContainer>
      <div className="flex justify-end">
        <FontAwesomeIcon icon={faCircleXmark} onClick={handleClose} />
      </div>
      {Object.keys(calculationValue.result).map((column) => {
        return (
          <div key={column}>
            <h1 className="capitalize">{column}</h1>
            {Object.keys(calculationValue.result[column]).map((calc) => {
              return (
                <div key={`${column}_${calc}`}>
                  {calc !== 'Types' && <h2>{calc}</h2>}
                  {calculationValue.result[column][calc].map(
                    (results: any, i: any) => {
                      if (typeof results === 'object') {
                        const name = results[column]
                        return (
                          <div
                            className="flex justify-center pb-5"
                            key={`${column}_${calc}_${name}`}
                          >
                            <Button
                              value={JSON.stringify({
                                value: calculationValue,
                                result: `${column}_${name}`,
                              })}
                              onClick={handleChangeMapLayer}
                              id={`${column}_${calc}_${name}`}
                              className={
                                activeButton === `${column}_${calc}_${name}`
                                  ? 'active-button'
                                  : ''
                              }
                              disabled={!calculationValue.button}
                            >
                              {Object.keys(
                                calculationValue.result[column][calc][i],
                              ).map((key) => {
                                const result =
                                  calculationValue.result[column][calc][i][key]
                                if (key === 'filename') {
                                  const extension =
                                    calculationValue.result[column][calc][i]
                                      .fileformat
                                  return (
                                    <CalculationValueImage
                                      key={`${result}.${extension}`}
                                    >
                                      <img
                                        src={`${BASIC_BUCKET_URL}/${result}.${extension}`}
                                      />
                                    </CalculationValueImage>
                                  )
                                } else if (key !== 'fileformat') {
                                  return (
                                    <div key={`${key}_${results}`}>
                                      <p className="capitalize">
                                        {key}:{' '}
                                        {typeof result === 'number'
                                          ? result.toFixed(0)
                                          : result}
                                      </p>
                                    </div>
                                  )
                                } else {
                                  return null
                                }
                              })}
                            </Button>
                          </div>
                        )
                      } else {
                        return (
                          <div key={results}>
                            <p className="capitalize">
                              {typeof results === 'number'
                                ? results.toFixed(0)
                                : results}
                            </p>
                          </div>
                        )
                      }
                    },
                  )}
                </div>
              )
            })}
          </div>
        )
      })}
    </CalculationValueContainer>
  )
}
