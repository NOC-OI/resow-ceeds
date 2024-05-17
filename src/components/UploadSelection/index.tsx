/* eslint-disable no-multi-str */
// import { Info } from 'phosphor-react'
import styles from '../DataExplorationSelection/DataExplorationSelection.module.css'
import { LayerSelectionContainer } from '../DataExplorationSelection/styles'
import { useEffect, useRef, useState } from 'react'
import { Button } from '@mui/material'
import { useUploadDataHandle } from '../../lib/data/uploadDataManagement'
import { LayersUploaded } from '../LayersUploaded'
import { UploadLayerWMS } from '../UploadLayerWMS'
import { UploadLayerGeoJSONGeoTIFF } from '../UploadLayerGeoJSONGeoTIFF'
import { useContextHandle } from '../../lib/contextHandle'
import { UploadLayerCOG } from '../UploadLayerCOG'
import { UploadLayerCSV } from '../UploadLayerCSV'
import { LayerParser } from '../../lib/data/parseUploadData'
import { ConfirmationDialog } from '../ConfirmationDialog'

interface UploadSelectionProps {
  layerAction: any
  setLayerAction: any
  layerLegend: any
  setLayerLegend: any
}

export function UploadSelection({
  layerAction,
  setLayerAction,
  layerLegend,
  setLayerLegend,
}: UploadSelectionProps) {
  const {
    uploadFormats,
    fileTypes,
    actualLayerUpload,
    setActualLayerUpload,
    listLayersUpload,
  } = useUploadDataHandle()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [error, setError] = useState('')
  const errorTimeoutRef = useRef<number | null>(null)
  const { setLoading, setFlashMessage } = useContextHandle()

  const [colorScale, setColorScale] = useState<string>('Custom')
  const [localUploadInfo, setLocalUploadInfo] = useState<any>({})

  const [layers, setLayers] = useState({})
  const [wmsSelectedLayer, setWmsSelectedLayer] = useState(null)
  const [selectedStyle, setSelectedStyle] = useState('')
  const delimiterList = [',', '.', 'tab', 'space', 'other']
  const [csvData, setCsvData] = useState<any>({
    delimiterType: 'normal',
    delimiter: delimiterList[0],
    header: false,
    latLngColumnNames: ['lat', 'lng'],
    latLngColumnNumbers: [0, 1],
  })

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
      !actualLayerUpload.dataType ||
      Object.keys(localUploadInfo).length === 0
    ) {
      return true
    }
    if (
      actualLayerUpload.dataType === 'Shapefile' &&
      (!localUploadInfo.proj || !localUploadInfo.file)
    ) {
      return true
    }
    return false
  }

  const handleUploadLayer = async (localUploadInfo) => {
    const parser = new LayerParser(
      localUploadInfo,
      actualLayerUpload,
      setActualLayerUpload,
      setLayerLegend,
      colorScale,
      wmsSelectedLayer,
      selectedStyle,
      layers,
      listLayersUpload,
      csvData,
    )
    try {
      parser.parse()
    } catch (error) {
      setError('Error on the data. Please check the file/url')
      setFlashMessage({
        messageType: 'error',
        content: 'Error on the data. Please check the file/url',
      })
    }
  }
  const handleSubmit = async () => {
    if (checkInputValue()) {
      setError('Please check the fields')
      setFlashMessage({
        messageType: 'error',
        content: 'Please check the fields',
      })
    } else {
      setLoading(true)
      await handleUploadLayer(localUploadInfo)
    }
  }
  const [labelText, setLabelText] = useState('Choose file')
  const [labelPrjText, setLabelPrjText] = useState('Choose file')
  const [fileToUpload, setFileToUpload] = useState(null)

  const handleChangeUploadFormat = (event) => {
    if (event.target.value === 'COG') {
      setColorScale('Accent')
    } else {
      setColorScale('Custom')
    }
    setLocalUploadInfo({})
    setLabelPrjText('Choose file')
    setLabelText('Choose file')
    setActualLayerUpload({
      dataType: event.target.value,
      colors: ['#0859fc', '#fd1317'],
      data: '',
      name: '',
      active: false,
    })
  }

  useEffect(() => {
    if (typeof actualLayerUpload.colors === 'string') {
      setActualLayerUpload((actualLayerUpload) => {
        const newActualLayerUpload = { ...actualLayerUpload }
        newActualLayerUpload.colors = ['#0859fc', '#fd1317']
        return newActualLayerUpload
      })
    }
  }, [actualLayerUpload])
  const handleColorChange = (event, index) => {
    setActualLayerUpload((actualLayerUpload) => {
      const newActualLayerUpload = { ...actualLayerUpload }
      const newColor = [...newActualLayerUpload.colors]
      newColor[index] = event.target.value
      return {
        ...newActualLayerUpload,
        colors: newColor,
      }
    })
  }
  function checkInputFile(file) {
    const fileType = fileTypes[actualLayerUpload.dataType]
    console.log(file)
    if (
      fileType.mimeTypes.includes(file.type) ||
      fileType.extensions.includes(file.name)
    ) {
      return true
    }
    setError('Invalid file type')
    setFlashMessage({
      messageType: 'error',
      content: 'Invalid file type',
    })
    return false
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0]
    if (!file) {
      setLabelText('Choose file')
      return
    }
    if (!checkInputFile(file)) {
      setLabelText('Choose file')
      return
    }
    const fileSize = file.size / 1024 / 1024
    if (fileSize > 50) {
      setFileToUpload([file])
      setIsModalOpen(true)
    } else {
      uploadFile(file)
    }
  }

  const handleFileChangeProj = (event) => {
    const file = event.target.files[0]
    if (!file) {
      setLabelPrjText('Choose file')
      return
    }
    if (!checkInputFile(file)) {
      setLabelPrjText('Choose file')
      return
    }
    const fileSize = file.size / 1024 / 1024
    if (fileSize > 50) {
      setFileToUpload([file, true])
      setIsModalOpen(true)
    } else {
      uploadFile(file, true)
    }
  }

  const uploadFile = (file, proj?) => {
    let fileName = file.name
    fileName = fileName.length > 12 ? fileName.slice(0, 9) + '...' : fileName
    if (proj && !file.name.endsWith('.prj')) {
      setError('Please upload a .prj file')
      setFlashMessage({
        messageType: 'error',
        content: 'Please upload a .prj file',
      })
      return
    }
    if (proj) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const prjText = event.target.result as string
        setLocalUploadInfo((localUploadInfo) => ({
          ...localUploadInfo,
          proj: prjText,
        }))
      }
      reader.readAsText(file)
      setLabelPrjText(fileName)
    } else {
      setLocalUploadInfo((localUploadInfo) => ({
        ...localUploadInfo,
        file,
      }))
      setLabelText(fileName)
    }
    setIsModalOpen(false)
    setFileToUpload(null)
  }

  function handleConfirm() {
    if (fileToUpload.length > 1) {
      uploadFile(fileToUpload[0], fileToUpload[1])
    } else {
      uploadFile(fileToUpload[0])
    }
  }

  const handleClose = () => {
    setIsModalOpen(false)
    setFileToUpload(null)
  }

  const rout = window.location.pathname

  return (
    <LayerSelectionContainer className={styles.fade_in}>
      <div className={styles.fade_in}>
        <div className="space-y-1 md:space-y-2 py-4 px-2">
          <p className="text-lg font-bold text-white mb-2 text-center">
            Upload Layers
          </p>
          {rout === '/3d' ? (
            <p className="text-sm text-white text-center">
              This feature is not available in 3D mode
            </p>
          ) : (
            <div className="flex flex-col px-12 items-center">
              <div className="flex justify-between items-center w-full">
                <p className="pt-4 text-md font-bold text-white mb-2 text-center">
                  Data format:
                </p>
                <select
                  id="fileFormat-select"
                  value={actualLayerUpload.dataType}
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
              {[
                'GeoJSON',
                'GeoTIFF',
                'Shapefile',
                'ASC',
                'KML',
                'KMZ',
              ].includes(actualLayerUpload.dataType) ? (
                <UploadLayerGeoJSONGeoTIFF
                  handleFileChange={handleFileChange}
                  handleFileChangeProj={handleFileChangeProj}
                  labelText={labelText}
                  labelPrjText={labelPrjText}
                  actualLayerUpload={actualLayerUpload}
                  colorScale={colorScale}
                  setColorScale={setColorScale}
                  handleColorChange={handleColorChange}
                />
              ) : actualLayerUpload.dataType === 'WMS' ? (
                <UploadLayerWMS
                  localUploadInfo={localUploadInfo}
                  setLocalUploadInfo={setLocalUploadInfo}
                  selectedStyle={selectedStyle}
                  setSelectedStyle={setSelectedStyle}
                  layers={layers}
                  setLayers={setLayers}
                  wmsSelectedLayer={wmsSelectedLayer}
                  setWmsSelectedLayer={setWmsSelectedLayer}
                  setError={setError}
                />
              ) : actualLayerUpload.dataType === 'COG' ? (
                <UploadLayerCOG
                  setLocalUploadInfo={setLocalUploadInfo}
                  colorScale={colorScale}
                  setColorScale={setColorScale}
                />
              ) : actualLayerUpload.dataType === 'CSV' ? (
                <UploadLayerCSV
                  handleFileChange={handleFileChange}
                  labelText={labelText}
                  csvData={csvData}
                  setCsvData={setCsvData}
                  delimiterList={delimiterList}
                  actualLayerUpload={actualLayerUpload}
                  handleColorChange={handleColorChange}
                />
              ) : (
                <></>
              )}
            </div>
          )}
        </div>
      </div>
      {rout === '/' && (
        <>
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
            <LayersUploaded
              layerAction={layerAction}
              setLayerAction={setLayerAction}
              layerLegend={layerLegend}
              setLayerLegend={setLayerLegend}
            />
          )}
        </>
      )}
      {isModalOpen && (
        <ConfirmationDialog
          onClose={handleClose}
          onConfirm={handleConfirm}
          message={`The file size is ${(
            (fileToUpload.length > 0 ? fileToUpload[0]?.size : 0) /
            1024 /
            1024
          ).toFixed(
            2,
          )} MB. Your browser may freeze while uploading. Do you want to continue?`}
        />
      )}
    </LayerSelectionContainer>
  )
}
