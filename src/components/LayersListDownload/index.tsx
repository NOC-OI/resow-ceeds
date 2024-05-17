/* eslint-disable no-multi-str */
// import { Info } from 'phosphor-react'
import { CalcTypeContainer } from '../DataExplorationType/styles'
import { LayerTypesDownload } from './styles'
import { LayerTypeOptionsContainer } from '../DataExplorationTypeOptions/styles'
import { useContextHandle } from '../../lib/contextHandle'
import { useDownloadManagementHandle } from '../../lib/data/downloadManagement'
import { Button } from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDownload } from '@fortawesome/free-solid-svg-icons'
import { GetTifLayer } from '../../lib/map/addGeoraster'
import * as turf from '@turf/turf'

interface LayersListDownloadProps {
  listLayers: any
  setDownloadPopup: any
  selectedLayers: any
}

export function LayersListDownload({
  listLayers,
  setDownloadPopup,
  selectedLayers,
}: LayersListDownloadProps) {
  const { setFlashMessage } = useContextHandle()
  const { downloadInputValue, downloadableLayers } =
    useDownloadManagementHandle()

  const dateTimeNow = new Date().toISOString().replace(/:/g, '-').slice(0, 19)

  async function clipAndDownloadGeoTIFF(layerInfo, layerName) {
    const georaster = downloadableLayers[layerName]
    const getTifLayer = new GetTifLayer()
    const values = await getTifLayer.clipGeo(
      georaster,
      downloadInputValue.region,
    )
    if (values[0].length === 0) {
      setFlashMessage({
        messageType: 'warning',
        content: 'No data available in the selected area',
      })
    } else {
      setFlashMessage({
        messageType: 'info',
        content: 'Generating and downloading data',
      })

      const nrows = values[0].length
      const ncols = values[0][0].length
      const xllcorner = Number(downloadInputValue.region[0])
      const yllcorner = Number(downloadInputValue.region[1])
      const cellsize = georaster.pixelHeight
      const nodataValue = georaster.noDataValue
      let header = `ncols ${ncols}\n`
      header += `nrows ${nrows}\n`
      header += `xllcorner ${xllcorner}\n`
      header += `yllcorner ${yllcorner}\n`
      header += `cellsize ${cellsize}\n`
      header += `NODATA_value ${nodataValue}\n`

      let body = ''
      for (let i = 0; i < nrows; i++) {
        for (let j = 0; j < ncols; j++) {
          body += values[0][i][j] + ' '
        }
        body = body.trim() + '\n'
      }

      const ascContent = header + body
      const blob = new Blob([ascContent], { type: 'text/plain' })

      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `${layerName}_${dateTimeNow}.asc`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  async function clipAndDownloadGeoJSON(layerInfo, layerName) {
    const geojsonData = downloadableLayers[layerName]
    downloadGeoJSON(geojsonData, layerName)
  }

  async function downloadGeoJSON(data, layerName) {
    const bbox = downloadInputValue.region.map((x) => Number(x))
    const bboxPolygon = turf.bboxPolygon(bbox)
    const clippedFeatures = data.features.filter((feature) => {
      switch (feature.geometry.type) {
        case 'Point': {
          const point = turf.point(feature.geometry.coordinates)
          return turf.booleanPointInPolygon(point, bboxPolygon)
        }
        case 'LineString': {
          const line = turf.lineString(feature.geometry.coordinates)
          const intersection = turf.lineIntersect(line, bboxPolygon)
          return intersection.features.length > 0
        }
        case 'Polygon': {
          const polygon = turf.polygon(feature.geometry.coordinates)
          const intersection = turf.intersect(polygon, bboxPolygon)
          return intersection !== null
        }
        case 'MultiPolygon': {
          const multiPolygon = turf.multiPolygon(feature.geometry.coordinates)
          const intersection = turf.intersect(multiPolygon, bboxPolygon)
          return intersection !== null
        }

        default:
          return false
      }
    })
    if (clippedFeatures.length === 0) {
      setFlashMessage({
        messageType: 'warning',
        content: 'No data available in the selected area',
      })
      return
    }
    setFlashMessage({
      messageType: 'info',
      content: 'Generating and downloading data',
    })

    const filteredGeoJSON = {
      type: 'FeatureCollection',
      features: clippedFeatures,
    }

    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(filteredGeoJSON))
    const downloadAnchorNode = document.createElement('a')
    downloadAnchorNode.setAttribute('href', dataStr)
    downloadAnchorNode.setAttribute(
      'download',
      `${layerName}_${dateTimeNow}.geojson`,
    )
    document.body.appendChild(downloadAnchorNode)
    downloadAnchorNode.click()
    downloadAnchorNode.remove()
  }

  async function clipAndDownloadFGB(layerInfo, layerName) {
    const fgbFile = downloadableLayers[layerName]
    downloadGeoJSON(fgbFile, layerName)
  }

  function checkInputValue() {
    if (
      downloadInputValue.region[0] === '' ||
      downloadInputValue.region[1] === '' ||
      downloadInputValue.region[2] === '' ||
      downloadInputValue.region[3] === '' ||
      downloadInputValue.layers.length === 0
    ) {
      return true
    }
    // TODO: check if there are selected Layers
    return false
  }

  async function handleDownloadArea(layerInfo, layerName) {
    if (checkInputValue()) {
      setFlashMessage({
        messageType: 'warning',
        content: 'Please check your input values',
      })
      return
    }
    if (layerInfo.dataType === 'GeoTIFF') {
      clipAndDownloadGeoTIFF(layerInfo, layerName)
    } else if (layerInfo.dataType === 'GeoJSON') {
      clipAndDownloadGeoJSON(layerInfo, layerName)
    } else if (layerInfo.dataType === 'FGB') {
      clipAndDownloadFGB(layerInfo, layerName)
    }
  }

  return (
    <LayerTypesDownload>
      {Object.keys(selectedLayers).length === 0 ? (
        <p className="text-sm text-white text-center">No layers selected</p>
      ) : (
        Object.keys(listLayers).map((layerClass: any) => {
          return (
            Object.keys(selectedLayers).some((element) =>
              element.split('_')[0].includes(layerClass),
            ) && (
              <CalcTypeContainer key={layerClass}>
                <div>
                  <header id="general-types" style={{ color: 'white' }}>
                    <p>{layerClass}</p>
                  </header>
                </div>
                <div className="flex flex-col gap-1 pt-1">
                  {Object.keys(listLayers[layerClass].layerNames).map(
                    (baseLayer, index) => {
                      return (
                        Object.keys(selectedLayers).some((element) =>
                          element.split('_')[1].includes(baseLayer),
                        ) && (
                          <LayerTypeOptionsContainer key={index}>
                            <div id="type-option">
                              <p className="text-md">{baseLayer}</p>
                              <div id="layer-edit">
                                {listLayers[layerClass].layerNames[baseLayer]
                                  .download_area ? (
                                  <Button
                                    onClick={() =>
                                      handleDownloadArea(
                                        listLayers[layerClass].layerNames[
                                          baseLayer
                                        ],
                                        `${layerClass}_${baseLayer}`,
                                      )
                                    }
                                    variant="contained"
                                    className="!w-full !text-white !bg-black !rounded-lg opacity-50 hover:!opacity-70 !text-xs"
                                    title="Download Selected Area"
                                  >
                                    <FontAwesomeIcon
                                      icon={faDownload}
                                      className="pr-3"
                                    />
                                    Area
                                  </Button>
                                ) : (
                                  <></>
                                )}
                                <Button
                                  onClick={() =>
                                    setDownloadPopup({
                                      [`${layerClass}_${baseLayer}`]:
                                        listLayers[layerClass].layerNames[
                                          baseLayer
                                        ].download,
                                    })
                                  }
                                  variant="contained"
                                  className="!w-full !text-white !bg-black !rounded-lg opacity-50 hover:!opacity-70 !text-xs"
                                >
                                  <FontAwesomeIcon
                                    icon={faDownload}
                                    className="pr-3"
                                  />
                                  Layer
                                </Button>
                              </div>
                            </div>
                          </LayerTypeOptionsContainer>
                        )
                      )
                    },
                  )}
                </div>
              </CalcTypeContainer>
            )
          )
        })
      )}
    </LayerTypesDownload>
  )
}
