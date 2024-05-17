import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { LayerLegendContainer } from './styles'
import { faCircleXmark, faPenToSquare } from '@fortawesome/free-solid-svg-icons'
import { ColorBar } from '../ColorBar'
import React, { useEffect, useRef, useState } from 'react'
import Draggable from 'react-draggable'
import { allColorScales, colorScaleByName } from '../../lib/map/jsColormaps'
import { Button } from '@mui/material'
import { CssTextField } from '../DownloadSelection/styles'
import chroma from 'chroma-js'
import { useUploadDataHandle } from '../../lib/data/uploadDataManagement'
import { useContextHandle } from '../../lib/contextHandle'
import { calculateColorsForLegend } from '../../lib/map/utils'

interface LayerLegendProps {
  layerLegend: any
  layerLegendName: string
  setLayerLegend: any
  setSelectedLayers: any
  setLayerAction: any
  setActualLayer: any
}

export function DataExplorationLegend({
  layerLegend,
  layerLegendName,
  setLayerLegend,
  setSelectedLayers,
  setLayerAction,
  setActualLayer,
}: LayerLegendProps) {
  function handleClose() {
    setLayerLegend((layerLegend) => {
      const newLayerLegend = { ...layerLegend }
      delete newLayerLegend[layerLegendName]
      return newLayerLegend
    })
  }
  const { setFlashMessage } = useContextHandle()

  const [colorScale, setColorScale] = useState<string>(
    layerLegend[layerLegendName].layerInfo?.colors,
  )

  const [scaleLimits, setScaleLimits] = useState<any[]>(
    layerLegend[layerLegendName].scale,
  )
  const [editLayerColors, setEditLayerColors] = useState<boolean>(false)
  const [customColors, setCustomColors] = useState<string[]>([
    '#0859fc',
    '#fd1317',
  ])

  const { setSelectedLayersUpload, setActualLayerNowUpload } =
    useUploadDataHandle()
  const [wmsError, setWmsError] = useState(false)

  const [error, setError] = useState('')
  const errorTimeoutRef = useRef<number | null>(null)
  useEffect(() => {
    if (errorTimeoutRef.current !== null) {
      clearTimeout(errorTimeoutRef.current)
      errorTimeoutRef.current = null
    }
    if (error) {
      errorTimeoutRef.current = window.setTimeout(() => {
        setError('')
      }, 5000)
    }
    return () => {
      if (errorTimeoutRef.current !== null) {
        clearTimeout(errorTimeoutRef.current)
      }
    }
  }, [error])
  useEffect(() => {
    setColorScale(layerLegend[layerLegendName].layerInfo?.colors)
    setScaleLimits(layerLegend[layerLegendName].scale)
  }, [layerLegend])

  const handleColorChange = (event, index) => {
    setCustomColors((customColors) => {
      const newCustomColors = [...customColors]
      newCustomColors[index] = event.target.value
      return newCustomColors
    })
  }

  function handleChangeScaleLimits(
    e: React.ChangeEvent<HTMLInputElement>,
    idx: number,
  ) {
    setScaleLimits((scaleLimits) => {
      const newScaleLimits = [...scaleLimits]
      newScaleLimits[idx] = parseFloat(e.target.value)
      return newScaleLimits
    })
  }

  function checkInputValue() {
    if (
      isNaN(scaleLimits[0]) ||
      isNaN(scaleLimits[1]) ||
      scaleLimits[0] === '' ||
      scaleLimits[1] === '' ||
      scaleLimits[0] >= scaleLimits[1]
    ) {
      return true
    }
    return false
  }
  const handleSubmit = async () => {
    const setState = layerLegend[layerLegendName].selectedLayersKey.startsWith(
      'uploaded_',
    )
      ? setSelectedLayersUpload
      : setSelectedLayers
    const setActualLayerState = layerLegend[
      layerLegendName
    ].selectedLayersKey.startsWith('uploaded_')
      ? setActualLayerNowUpload
      : setActualLayer
    if (
      ['COG', 'GeoTIFF', 'ASC'].includes(layerLegend[layerLegendName].dataType)
    ) {
      if (checkInputValue()) {
        setError('Please enter valid values')
        setFlashMessage({
          messageType: 'error',
          content: 'Please enter valid values',
        })
        return
      }
    }
    setActualLayerState([layerLegend[layerLegendName].selectedLayersKey])
    setLayerAction('update-colors')
    if (
      ['COG', 'GeoTIFF', 'ASC'].includes(layerLegend[layerLegendName].dataType)
    ) {
      setState((selectedLayers) => {
        const newSelectedLayers = { ...selectedLayers }
        newSelectedLayers[layerLegend[layerLegendName].selectedLayersKey] = {
          ...newSelectedLayers[layerLegend[layerLegendName].selectedLayersKey],
          colors:
            colorScale === 'Custom' || typeof colorScale === 'object'
              ? customColors
              : colorScale,
          scale: scaleLimits,
        }
        return newSelectedLayers
      })
      const colors = colorScale === 'Custom' ? customColors : colorScale
      const { listColors, listColorsValues } = calculateColorsForLegend(
        colors,
        scaleLimits,
        30,
        typeof colors !== 'string',
      )
      setLayerLegend((layerLegend) => {
        const newLayerLegend = { ...layerLegend }
        delete newLayerLegend[layerLegendName]
        newLayerLegend[layerLegendName] = {
          ...layerLegend[layerLegendName],
          scale: scaleLimits,
          layerInfo: {
            ...layerLegend.layerInfo,
            colors:
              colorScale === 'Custom' || typeof colorScale === 'object'
                ? customColors
                : colorScale,
            scale: scaleLimits,
          },
          legend: [listColors, listColorsValues],
        }
        return newLayerLegend
      })
    } else {
      setState((selectedLayers) => {
        const newSelectedLayers = { ...selectedLayers }
        newSelectedLayers[layerLegend[layerLegendName].selectedLayersKey] = {
          ...newSelectedLayers[layerLegend[layerLegendName].selectedLayersKey],
          color: customColors[0],
          colors: customColors[0],
          scale: scaleLimits,
        }
        return newSelectedLayers
      })
      setLayerLegend((layerLegend) => {
        const newLayerLegend = { ...layerLegend }
        delete newLayerLegend[layerLegendName]
        newLayerLegend[layerLegendName] = {
          ...layerLegend[layerLegendName],
          legend: [[customColors[0]], layerLegend[layerLegendName].legend[1]],
        }
        return newLayerLegend
      })
    }
  }

  useEffect(() => {
    if (layerLegend[layerLegendName].url) {
      setEditLayerColors(false)
    }
  }, [layerLegend])

  const nodeRef = useRef(null)
  return (
    <Draggable nodeRef={nodeRef} cancel=".clickable">
      <LayerLegendContainer ref={nodeRef} id="legend-box">
        <div className="flex justify-end pb-1">
          <FontAwesomeIcon
            contentStyleType={'regular'}
            icon={faCircleXmark}
            onClick={handleClose}
            className="clickable"
          />
        </div>
        <div>
          <h1>LEGEND</h1>
          <h1>{layerLegend[layerLegendName].layerName}</h1>
          <div>
            {layerLegend[layerLegendName].url &&
              (wmsError ? (
                <p>
                  <strong>Legend not available</strong>
                </p>
              ) : (
                <img
                  src={layerLegend[layerLegendName].url}
                  onError={() => setWmsError(true)}
                />
              ))}
            {['COG', 'GeoTIFF', 'ASC'].includes(
              layerLegend[layerLegendName].dataType,
            ) ? (
              <div className="flex flex-col justify-center items-center gap-2">
                <ColorBar layerLegend={layerLegend[layerLegendName]} />
              </div>
            ) : (
              layerLegend[layerLegendName].legend &&
              layerLegend[layerLegendName].legend[0].map(
                (color: any, idx: any) => {
                  return (
                    <div key={color} className="flex p-1">
                      <div
                        style={{ backgroundColor: color }}
                        className="rounded w-4"
                      ></div>
                      <p>{layerLegend[layerLegendName].legend[1][idx]}</p>
                    </div>
                  )
                },
              )
            )}
            {layerLegend[layerLegendName].dataType && (
              <div className="flex flex-col justify-center items-center gap-2">
                <Button
                  id="edit-layer-colors-button"
                  onClick={() => setEditLayerColors(!editLayerColors)}
                  variant="contained"
                  className="!w-full !text-white !bg-black !rounded-lg opacity-50 hover:!opacity-70 flex justify-center items-center !py-0 gap-2 clickable"
                >
                  <FontAwesomeIcon icon={faPenToSquare} />
                  <p>Edit Colors</p>
                </Button>
              </div>
            )}
          </div>
        </div>
        {editLayerColors &&
          (['COG', 'GeoTIFF', 'ASC'].includes(
            layerLegend[layerLegendName].dataType,
          ) ? (
            <div
              className="flex flex-col items-center gap-2"
              id="edit-layer-colors-options1"
            >
              <div className="pt-4 flex justify-left w-full items-center gap-2">
                <p className="text-md font-bold text-white text-center">
                  Color Scale:
                </p>
                <div className="flex flex-col items-center gap-2">
                  <div className="flex justify-left items-center w-full">
                    <select
                      id="fileFormat-select"
                      value={
                        typeof colorScale === 'object' ? 'Custom' : colorScale
                      }
                      onChange={(e) => setColorScale(e.target.value)}
                      className="clickable bg-black border border-black bg-opacity-20 text-white text-sm rounded-lg  block w-max p-2 hover:bg-opacity-80"
                    >
                      {layerLegend[layerLegendName].dataType !== 'COG' && (
                        <option
                          className="!bg-black !bg-opacity-80 opacity-30 !text-white clickable"
                          value="Custom"
                        >
                          Custom
                        </option>
                      )}
                      {allColorScales.map((allColorScale, index) => (
                        <option
                          className="!bg-black !bg-opacity-80 opacity-30 !text-white clickable"
                          value={allColorScale}
                          key={index}
                        >
                          {allColorScale}
                        </option>
                      ))}
                    </select>
                    {(colorScale === 'Custom' ||
                      typeof colorScale === 'object') && (
                      <div className="pl-2 flex justify-start items-center gap-1">
                        <input
                          type="color"
                          className="p-1 block bg-black  bg-opacity-30 cursor-pointer rounded-lg disabled:opacity-50 disabled:pointer-events-none clickable"
                          id="hs-color-input"
                          value={customColors[0]}
                          onChange={(e) => handleColorChange(e, 0)}
                          title="Choose your color"
                        />
                        <input
                          type="color"
                          className="p-1 block bg-black bg-opacity-30  cursor-pointer rounded-lg disabled:opacity-50 disabled:pointer-events-none clickable"
                          id="hs-color-input"
                          value={customColors[1]}
                          onChange={(e) => handleColorChange(e, 1)}
                          title="Choose your color"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="pt-4 flex justify-left w-full items-center gap-2">
                <p className="text-md font-bold text-white text-center">
                  Color Limits:
                </p>
                <div className="flex gap-4 justify-center items-center border-white border-b-2">
                  <CssTextField
                    id="min-color"
                    label="Min Value"
                    type="number"
                    name="min_value"
                    variant="standard"
                    InputLabelProps={{
                      style: {
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        width: '100%',
                        color: 'white',
                        borderWidth: '10px',
                        borderColor: 'white !important',
                      },
                    }}
                    className="clickable"
                    InputProps={{
                      style: {
                        color: 'white',
                      },
                    }}
                    value={isNaN(scaleLimits[0]) ? '' : scaleLimits[0]}
                    onInput={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleChangeScaleLimits(e, 0)
                    }
                  />
                  <CssTextField
                    id="max-color"
                    label="Max Value"
                    type="number"
                    name="max_value"
                    variant="standard"
                    className="clickable"
                    InputLabelProps={{
                      style: {
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        width: '100%',
                        color: 'white',
                        borderWidth: '10px',
                        borderColor: 'white !important',
                      },
                    }}
                    InputProps={{
                      style: {
                        color: 'white',
                      },
                    }}
                    value={isNaN(scaleLimits[1]) ? '' : scaleLimits[1]}
                    onInput={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleChangeScaleLimits(e, 1)
                    }
                  />
                </div>
              </div>
              <div className="text-red-500 text-sm mt-1">
                {error ? <p>{error}</p> : <div className="pt-[18px]"></div>}
              </div>
              <Button
                onClick={() => handleSubmit()}
                variant="contained"
                className="!w-full !text-white !bg-black !rounded-lg opacity-50 hover:!opacity-70 clickable"
              >
                Update Layer
              </Button>
            </div>
          ) : (
            <div
              className="flex flex-col items-center gap-2"
              id="edit-layer-colors-options2"
            >
              <div className="pt-4 flex justify-left w-full items-center gap-2">
                <p className="text-md font-bold text-white text-center">
                  Color:
                </p>
                <div className="pl-2 flex justify-start items-center gap-1">
                  <input
                    type="color"
                    className="p-1 block bg-black  bg-opacity-30 cursor-pointer rounded-lg disabled:opacity-50 disabled:pointer-events-none clickable"
                    id="hs-color-input"
                    value={customColors[0]}
                    onChange={(e) => handleColorChange(e, 0)}
                    title="Choose your color"
                  />
                </div>
              </div>
              <Button
                onClick={() => handleSubmit()}
                variant="contained"
                className="!w-full !text-white !bg-black !rounded-lg opacity-50 hover:!opacity-70 clickable"
              >
                Update Layer
              </Button>
            </div>
          ))}
      </LayerLegendContainer>
    </Draggable>
  )
}
