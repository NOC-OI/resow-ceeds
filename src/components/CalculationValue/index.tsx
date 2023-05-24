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

  function addMapLayer(layerInfo: any) {
    setLayerAction('add')
    const newSelectedLayer = layerInfo.dataInfo
    newSelectedLayer.opacity = 1
    newSelectedLayer.zoom = true
    setSelectedLayers({
      ...selectedLayers,
      [layerInfo.subLayer]: newSelectedLayer,
    })
  }

  function changeMapLayer(layerInfo: any) {
    setLayerAction('marker-changes')
    const newSelectedLayer = layerInfo.dataInfo
    setSelectedLayers((selectedLayers: any) => {
      const copy = { ...selectedLayers }
      delete copy[layerInfo.subLayer]
      return {
        [layerInfo.subLayer]: newSelectedLayer,
        ...copy,
      }
    })
  }

  async function handleChangeMapLayer(e: any) {
    setActiveButton(e.currentTarget.id)
    const [column, result] = e.currentTarget.value.split('_')
    const layerInfo = {
      subLayer: 'Seabed Images_2012',
      dataInfo: listLayers['Seabed Images'].layerNames['2012'],
    }
    setActualLayer([layerInfo.subLayer])
    layerInfo.dataInfo.show = []
    layerInfo.dataInfo.photos.forEach((photo: any) => {
      if (photo[column] === result) {
        layerInfo.dataInfo.show.push(photo.FileName)
      }
    })

    if (verifyIfWasSelectedBefore(layerInfo.subLayer)) {
      changeMapLayer(layerInfo)
    } else {
      addMapLayer(layerInfo)
    }
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
      setShowPhotos(photoList)
    }
  }, [selectedLayers])

  return (
    <CalculationValueContainer>
      <div className="flex justify-end">
        <FontAwesomeIcon icon={faCircleXmark} onClick={handleClose} />
      </div>
      {Object.keys(calculationValue[Object.keys(calculationValue)[0]]).map(
        (column: any, idx: any) => {
          const newObject =
            calculationValue[Object.keys(calculationValue)[0]][column]
          return Object.keys(newObject).map((calc: any, ii: any) => {
            const newObject2 = newObject[calc]
            return newObject2.map((result: any, i: any) => {
              if (i === 0) {
                if (ii === 0) {
                  if (idx === 0) {
                    return (
                      <div key={`${column}_${calc}_${result}`}>
                        <h1>{column}</h1>
                        <h2>{calc}</h2>
                        {result.length ? (
                          <>
                            <div className="flex justify-center pb-5">
                              <Button
                                value={`${column}_${result[0]}`}
                                onClick={handleChangeMapLayer}
                                id={`${column}_${calc}_${result}`}
                                className={
                                  activeButton === `${column}_${calc}_${result}`
                                    ? 'active-button'
                                    : ''
                                }
                              >
                                <p>{result[0]}</p>
                                <CalculationValueImage>
                                  <img
                                    src={`${BASIC_BUCKET_URL}/${result[1]}_1.png`}
                                  />
                                </CalculationValueImage>
                              </Button>
                            </div>
                          </>
                        ) : (
                          <p>{result}</p>
                        )}
                      </div>
                    )
                  } else {
                    return (
                      <div key={`${calc}_${result}`}>
                        <h2>{calc}</h2>
                        {result.length ? (
                          <>
                            <div className="flex justify-center pb-5">
                              <Button
                                value={`${column}_${result[0]}`}
                                onClick={handleChangeMapLayer}
                                id={`${column}_${calc}_${result}`}
                                className={
                                  activeButton === `${column}_${calc}_${result}`
                                    ? 'active-button'
                                    : ''
                                }
                              >
                                <p>{result[0]}</p>
                                <CalculationValueImage>
                                  <img
                                    src={`${BASIC_BUCKET_URL}/${result[1]}_1.png`}
                                  />
                                </CalculationValueImage>
                              </Button>
                            </div>
                          </>
                        ) : (
                          <p>{result}</p>
                        )}
                      </div>
                    )
                  }
                } else {
                  return (
                    <div key={`${result}`}>
                      <h2>{calc}</h2>
                      {result.length ? (
                        <>
                          <div className="flex justify-center pb-5">
                            <Button
                              value={`${column}_${result[0]}`}
                              onClick={handleChangeMapLayer}
                              id={`${column}_${calc}_${result}`}
                              className={
                                activeButton === `${column}_${calc}_${result}`
                                  ? 'active-button'
                                  : ''
                              }
                            >
                              <p>{result[0]}</p>
                              <CalculationValueImage>
                                <img
                                  src={`${BASIC_BUCKET_URL}/${result[1]}_1.png`}
                                />
                              </CalculationValueImage>
                            </Button>
                          </div>
                        </>
                      ) : (
                        <p>{result}</p>
                      )}
                    </div>
                  )
                }
              } else {
                return (
                  <div key={`${result}_1`}>
                    {result.length ? (
                      <>
                        <div className="flex justify-center  pb-5">
                          <Button
                            value={`${column}_${result[0]}`}
                            onClick={handleChangeMapLayer}
                            id={`${column}_${calc}_${result}`}
                            className={
                              activeButton === `${column}_${calc}_${result}`
                                ? 'active-button'
                                : ''
                            }
                          >
                            <p>{result[0]}</p>
                            <CalculationValueImage>
                              <img
                                src={`${BASIC_BUCKET_URL}/${result[1]}_1.png`}
                              />
                            </CalculationValueImage>
                          </Button>
                        </div>
                      </>
                    ) : (
                      <p>{result}</p>
                    )}
                  </div>
                )
              }
            })
          })
        },
      )}
    </CalculationValueContainer>
  )
}
