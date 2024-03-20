/* eslint-disable no-multi-str */
// import { Info } from 'phosphor-react'
import styles from '../DataExplorationSelection/DataExplorationSelection.module.css'
import {
  LayerSelectionContainer,
  LayerSelectionTitle,
  LayerTypes,
} from '../DataExplorationSelection/styles'
import { useEffect, useRef, useState } from 'react'
import { Button } from '@mui/material'
import { useUploadDataHandle } from '../../lib/data/uploadDataManagement'
import { CssTextField } from './styles'
import { CalcTypeContainer } from '../DataExplorationType/styles'
import { LayerTypeOptionsContainer } from '../DataExplorationTypeOptions/styles'
import styles1 from '../DataExplorationTypeOptions/DataExplorationTypeOptions.module.css'

// interface UploadSelectionProps {}

export function UploadSelection() {
  const {
    uploadFormats,
    actualLayerUpload,
    setActualLayerUpload,
    selectedLayersUpload,
    setSelectedLayersUpload,
    listLayersUpload,
    setActualLayerAction,
    setActualLayerUploadNow,
  } = useUploadDataHandle()
  const [error, setError] = useState('')
  const errorTimeoutRef = useRef<number | null>(null)

  const [localUploadInfo, setLocalUploadInfo] = useState<any>({})
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
  function checkInputValue() {
    if (
      !actualLayerUpload.uploadFormat ||
      Object.keys(localUploadInfo).length === 0
    ) {
      return true
    }
    return false
  }
  const handleFileUpload = (localUploadInfo) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const geojsonData = JSON.parse(e.target.result.toString())
      setActualLayerUpload((actualLayerUpload) => {
        const newActualLayerUpload = { ...actualLayerUpload }
        return {
          uploadFormat: newActualLayerUpload.uploadFormat,
          layer: {
            name: localUploadInfo.file.name,
            data: geojsonData,
          },
        }
      })
    }
    reader.readAsText(localUploadInfo.file)
  }
  const handleSubmit = async () => {
    if (checkInputValue()) {
      setError('Please fill all the fields')
    } else {
      handleFileUpload(localUploadInfo)
    }
  }

  const [labelText, setLabelText] = useState('Choose file')
  const handleChangeUploadFormat = (event) => {
    setActualLayerUpload({ uploadFormat: event.target.value, layer: {} })
  }
  const handleFileChange = (event) => {
    let fileName = event.target.files[0]
      ? event.target.files[0].name
      : 'Choose file'
    if (fileName !== 'Choose file') {
      setLocalUploadInfo({ file: event.target.files[0] })
      fileName = fileName.length > 18 ? fileName.slice(0, 18) + '...' : fileName
    } else {
      setLocalUploadInfo({})
    }
    setLabelText(fileName)
  }

  async function addMapLayerUpload(layerInfo: any, layerClass: string) {
    setActualLayerAction('add')
    setSelectedLayersUpload({
      ...selectedLayersUpload,
      [layerClass]: layerInfo,
    })
  }

  function removeMapLayerUpload(layerClass: string) {
    setActualLayerAction('remove')
    setSelectedLayersUpload((selectedLayersUpload: any) => {
      const copy = { ...selectedLayersUpload }
      delete copy[layerClass]
      return copy
    })
  }

  async function handleChangeMapLayerUpload(e: any, layerClass: string) {
    const layerInfo = listLayersUpload[layerClass]
    setActualLayerUploadNow(layerClass)
    if (e.target.checked) {
      await addMapLayerUpload(layerInfo, layerClass)
    } else {
      removeMapLayerUpload(layerClass)
    }
  }

  return (
    <LayerSelectionContainer className={styles.fade_in}>
      <div className={styles.fade_in}>
        <div className="space-y-1 md:space-y-2 py-4 px-2">
          <p className="text-lg font-bold text-white mb-2 text-center">
            Upload Layers
          </p>
          <div className="flex flex-col px-12 items-center">
            <div className="flex justify-between items-center w-full">
              <p className="pt-4 text-md font-bold text-white mb-2 text-center">
                Data format
              </p>
              <select
                id="fileFormat-select"
                value={actualLayerUpload.uploadFormat}
                onChange={(e) => handleChangeUploadFormat(e)}
                className="clickable bg-black border border-black bg-opacity-20 text-white text-sm rounded-lg  block w-max p-2 hover:bg-opacity-80"
              >
                {uploadFormats.map((uploadFormat, index) => (
                  <option
                    className="!bg-black !bg-opacity-80 opacity-30 !text-white"
                    value={uploadFormat}
                    key={index}
                  >
                    {uploadFormat}
                  </option>
                ))}
              </select>
            </div>
            {['GeoJSON', 'GeoTIFF'].includes(actualLayerUpload.uploadFormat) ? (
              <div className="flex justify-between w-full items-center">
                <p className="pt-4 text-md font-bold text-white mb-2 text-center">
                  Upload File
                </p>
                <div className="flex justify-center gap-6 items-center">
                  <label
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    htmlFor="file_input"
                  >
                    Upload file
                  </label>
                  <input
                    id="file_input"
                    type="file"
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                  />
                  <label
                    htmlFor="file_input"
                    className="block w-full text-sm text-white rounded-lg cursor-pointer bg-black bg-opacity-50 hover:bg-opacity-80"
                    style={{ padding: '10px', textAlign: 'center' }}
                  >
                    {labelText}
                  </label>
                </div>
              </div>
            ) : actualLayerUpload.uploadFormat === 'WMS' ? (
              <div className="flex justify-center w-full items-center">
                <CssTextField
                  id="wms-url"
                  label="Url"
                  type="text"
                  name="url-wms"
                  variant="standard"
                  className="!w-full"
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
                />
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
      <div className="text-red-500 text-sm mt-1">
        {error ? <p>{error}</p> : <div className="pt-[18px]"></div>}
      </div>
      <Button
        onClick={() => handleSubmit()}
        variant="contained"
        className="!w-full !text-white !bg-black !rounded-lg opacity-50 hover:!opacity-70"
      >
        Upload
      </Button>
      {Object.keys(listLayersUpload).length > 0 && (
        <LayerSelectionTitle>
          <h1>Layers Uploaded</h1>
        </LayerSelectionTitle>
      )}
      <LayerTypes>
        {Object.keys(listLayersUpload).map((layerClass: any) => {
          return (
            <CalcTypeContainer key={layerClass}>
              <LayerTypeOptionsContainer>
                <div id="type-option">
                  <label htmlFor={layerClass} title="layer uploaded">
                    <input
                      id={layerClass}
                      onChange={(e) =>
                        handleChangeMapLayerUpload(e, layerClass)
                      }
                      className={styles1.chk}
                      type="checkbox"
                      name="baseLayer"
                      checked={Object.keys(selectedLayersUpload).includes(
                        layerClass,
                      )}
                    />
                    <label htmlFor={layerClass} title="layer uploaded">
                      <span className={styles1.slider}></span>
                    </label>
                    <p>{layerClass}</p>
                  </label>
                </div>
              </LayerTypeOptionsContainer>
            </CalcTypeContainer>
          )
        })}
      </LayerTypes>
      {Object.keys(listLayersUpload).length > 0 && (
        <p className="text-center italic text-sm">
          If you refresh or close this page, this list will be erased
        </p>
      )}
    </LayerSelectionContainer>
  )
}
