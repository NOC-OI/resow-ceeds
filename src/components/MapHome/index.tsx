import {
  MapContainer,
  TileLayer,
  ScaleControl,
  ZoomControl,
} from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import React, { useEffect, useMemo, useState } from 'react'
import * as L from 'leaflet'
import { GetTifLayer, GetCOGLayer } from '../../lib/map/addGeoraster'
import { callBetterWMS } from '../../lib/map/addBetterWMS'
import { GetMBTiles } from '../../lib/map/addMBTiles'
import { GetPhotoMarker } from '../../lib/map/addPhotoMarker'
import * as turf from '@turf/turf'
import LeafletRuler from '../LeafletRuler'
import { yearMonths } from '../../data/yearMonths'
// import { limits } from '../../data/limits'
import 'leaflet-draw'
import * as esri from 'esri-leaflet'
import { useContextHandle } from '../../lib/contextHandle'
import {
  bathymetryUrl,
  colorScale,
  createColor,
  createIcon,
  createTurfPoint,
  defaultBaseLayer,
  defaultOpacity,
  defaultView,
  defaultWMSBounds,
  defaultZoom,
  defineNewDepthValue,
  getGeorasterLayer,
  keyable,
  reorderPhotos,
  smallIcon,
} from '../../lib/map/utils'
import { useDownloadManagementHandle } from '../../lib/data/downloadManagement'
import { useUploadDataHandle } from '../../lib/data/uploadDataManagement'

interface MapProps {
  selectedLayers: any
  actualLayer: string[]
  layerAction: string
  setLayerAction: any
  showPhotos: any
  setShowPhotos: any
  activePhoto: any
  setActivePhoto: any
  mapBounds: any
  setMapBounds: any
  selectedSidebarOption: any
  getPolyline: any
  setGraphData: any
  actualDate: any
  setMapPopup: any
  clickPoint: any
  setClickPoint: any
  setDepth: any
  setPosition: any
  selectedBaseLayer: any
}

function MapHome1({
  selectedLayers,
  actualLayer,
  layerAction,
  setLayerAction,
  showPhotos,
  setShowPhotos,
  activePhoto,
  setActivePhoto,
  mapBounds,
  setMapBounds,
  selectedSidebarOption,
  getPolyline,
  setGraphData,
  actualDate,
  setMapPopup,
  clickPoint,
  setClickPoint,
  setDepth,
  setPosition,
  selectedBaseLayer,
}: MapProps) {
  const { setFlashMessage, setLoading } = useContextHandle()
  const {
    actualLayerUpload,
    setActualLayerUpload,
    selectedLayersUpload,
    actualLayerNowUpload,
  } = useUploadDataHandle()
  const { drawRectangle, setRectangleLimits } = useDownloadManagementHandle()
  const [map, setMap] = useState<any>(null)
  const [mapCenter, setMapCenter] = useState<L.LatLng>(
    new L.LatLng(defaultView[0], defaultView[1]),
  )
  function bringLayerToFront(layer: any) {
    try {
      layer.bringToFront()
      console.log(mapCenter)
    } catch (error) {}
    // const frontLayers = [
    //   'Coastline',
    //   'Marine Conservation Zones',
    //   'Special Areas of Conservation',
    // ]
    // map.eachLayer(function (mapLayer: any) {
    //   if (frontLayers.includes(mapLayer.options.attribution)) {
    //     mapLayer.bringToFront()
    //   }
    // })
  }

  useEffect(() => {
    if (map) {
      map.on('moveend', function () {
        setMapBounds(map.getBounds())
        setMapCenter(map.getCenter())
      })
      map.on('mousemove', (e: { latlng: unknown }) => {
        setPosition(e.latlng)
      })
    }
  }, [map])
  async function changeMapDateLayers() {
    let layer: any
    map.eachLayer(async (mapLayer: any) => {
      if (mapLayer.options.date_range) {
        const layerName = selectedLayers[mapLayer.options.attribution]
        const url = layerName.url.replace('actualDate', yearMonths[actualDate])
        const getTifLayer = new GetTifLayer(
          url,
          mapLayer.options.attribution,
          undefined,
          undefined,
          layerName,
        )
        await getTifLayer.parseGeo().then(function () {
          layer = getTifLayer.layer
          layer.options.date_range = layerName.date_range
          map.addLayer(layer, true)
          map.removeLayer(mapLayer)
        })
      }
    })
    setLoading(false)
  }

  useEffect(() => {
    if (map) {
      setLoading(true)
      changeMapDateLayers()
    }
  }, [actualDate])

  useEffect(() => {
    if (map) {
      map.on('moveend', function () {
        setMapBounds(map.getBounds())
        setMapCenter(map.getCenter())
      })
    }
  }, [map])

  useEffect(() => {
    if (map) {
      const layer = new L.TileLayer(selectedBaseLayer.url)
      layer.options.attribution = 'base layer'
      map.eachLayer((currentLayer) => {
        if (currentLayer.options.attribution === 'base layer') {
          map.removeLayer(currentLayer)
        }
      })
      map.addLayer(layer)
      map.eachLayer((currentLayer) => {
        if (currentLayer.options.attribution !== 'base layer') {
          bringLayerToFront(currentLayer)
        }
      })
    }
  }, [selectedBaseLayer])

  async function changeIcons(photo: any) {
    map.eachLayer(function (mapLayer: any) {
      if (mapLayer.options.dataType === 'marker') {
        if (mapLayer.options.filename === photo.filename) {
          mapLayer.setIcon(createIcon('/marker-icon_red.png', [25, 25]))
          if (!photo.notCenter) {
            map.setView(
              new L.LatLng(mapLayer._latlng.lat, mapLayer._latlng.lng),
              map._zoom,
            )
          }
        } else {
          const icon = L.divIcon({
            html: `<div class='all-icon'>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="15"
                viewBox="0 0 50 50"
              >
                <circle
                  cx="25"
                  cy="25"
                  r="24"
                  stroke="black"
                  fill="${mapLayer.options.color}"
                />
              </svg>
            </div>`,
            iconSize: [0, 0],
            iconAnchor: [0, 0],
          })
          mapLayer.setIcon(icon)
        }
      }
    })
  }

  async function addLayerIntoMap(actual?) {
    if (actual) {
      await generateSelectedUploadedLayer('old')
    } else {
      await generateSelectedLayer()
    }
    setLayerAction('')
  }

  function createTurfLayer(actual, turfConvex) {
    const colorLimits = createColor(colorScale)

    const myStyle = {
      color: colorLimits,
      fillColor: colorLimits,
      weight: 3,
      opacity: defaultOpacity,
      fillOpacity: defaultOpacity,
    }
    if (turfConvex) {
      const turflayer = L.geoJson(turfConvex, {
        style: myStyle,
      })
      turflayer.options.attribution = actual
      return turflayer
    }
  }

  async function addGeoblazeValue(layerName, actual, getCoords, layer) {
    map.on('mousemove', function (evt: { originalEvent: any }) {
      const latlng = map.mouseEventToLatLng(evt.originalEvent)
      let coords = null
      if (getCoords) {
        const pixelPoint = map
          .project(latlng, Math.floor(map.getZoom()))
          .floor()
        const tileSize = { x: 256, y: 256 }
        coords = pixelPoint.unscaleBy(tileSize).floor()
        coords.z = Math.floor(map.getZoom()) // { x: 212, y: 387, z: 10 }
      }
      defineNewDepthValue(actual, layerName, latlng, coords, layer, setDepth)
    })
  }

  async function generateSelectedLayer() {
    actualLayer.forEach(async (actual) => {
      const layerName = selectedLayers[actual]
      let layer: any
      let bounds
      if (layerName.dataType === 'WMS') {
        layer = await getWMSLayer(layerName, actual)
        console.log('AAAAAAAAAA', layer)
        bounds = defaultWMSBounds
      } else if (layerName.dataType === 'COG') {
        if (typeof layerName.url === 'string') {
          const getCOGLayer = new GetCOGLayer(layerName, actual, true)
          layer = await getCOGLayer.getTile()
          if (getCOGLayer.error) {
            setFlashMessage({
              messageType: 'error',
              content: getCOGLayer.error,
            })
          }
          // bounds = [
          //   [getCOGLayer.bounds[3], getCOGLayer.bounds[0]],
          //   [getCOGLayer.bounds[1], getCOGLayer.bounds[2]],
          // ]
          bounds = defaultWMSBounds
        } else {
          let minValue
          let maxValue
          const stats = await Promise.all(
            layerName.url.map(async (newUrl) => {
              const newSubLayer = { ...layerName }
              newSubLayer.url = newUrl
              const getCOGLayer = new GetCOGLayer(newSubLayer, actual, true)
              const stats = await getCOGLayer.getStats()
              if (minValue) {
                if (minValue > stats.b1.percentile_2.toFixed(4)) {
                  minValue = stats.b1.percentile_2.toFixed(4)
                }
              } else {
                minValue = stats.b1.percentile_2.toFixed(4)
              }
              if (maxValue) {
                if (maxValue < stats.b1.percentile_98.toFixed(4)) {
                  maxValue = stats.b1.percentile_98.toFixed(4)
                }
              } else {
                maxValue = stats.b1.percentile_98.toFixed(4)
              }
              return { b1: { percentile_2: minValue, percentile_98: maxValue } }
            }),
          )
          layer = await Promise.all(
            layerName.url.map(async (individualUrl) => {
              const newLayerName = { ...layerName }
              newLayerName.scale = [
                Number(stats[stats.length - 1].b1.percentile_2).toFixed(4),
                Number(stats[stats.length - 1].b1.percentile_98).toFixed(4),
              ]
              newLayerName.url = individualUrl
              const getCOGLayer = new GetCOGLayer(newLayerName, actual, true)

              if (getCOGLayer.error) {
                setFlashMessage({
                  messageType: 'error',
                  content: getCOGLayer.error,
                })
              }
              // bounds = [
              //   [getCOGLayer.bounds[3], getCOGLayer.bounds[0]],
              //   [getCOGLayer.bounds[1], getCOGLayer.bounds[2]],
              // ]
              bounds = defaultWMSBounds
              return await getCOGLayer.getTile(stats[stats.length - 1])
            }),
          )
        }
      } else if (layerName.dataType === 'MBTiles') {
        const getMBTilesLayer = new GetMBTiles(layerName, actual)
        await getMBTilesLayer.getLayer().then(async function () {
          layer = getMBTilesLayer.layer
          if (layer) {
            layer.on('click', async function (e: any) {
              const strContent: string[] = []
              Object.keys(e.layer.properties).forEach((c) => {
                strContent.push(
                  `<p>${c}: ${
                    e.layer.properties[c] === ' ' ? '--' : e.layer.properties[c]
                  }<p>`,
                )
              })
              L.popup({ maxWidth: 200 })
                .setLatLng(e.latlng)
                .setContent(strContent.join(''))
                .openOn(map)
            })
          }
        })
      } else if (layerName.dataType === 'GeoTIFF') {
        const url = layerName.url.replace('actualDate', yearMonths[actualDate])
        const getTifLayer = new GetTifLayer(
          url,
          actual,
          undefined,
          undefined,
          layerName,
        )
        await getTifLayer.parseGeo().then(function () {
          layer = getTifLayer.layer
          layer.options.date_range = layerName.date_range
          bounds = defaultWMSBounds
        })
      } else if (layerName.dataType === 'arcgis') {
        layer = esri.dynamicMapLayer({ url: layerName.url })
        layer.setLayers([1, 2, 3, 4, 5, 6, 7, 8, 12, 13, 14, 15])
        bounds = defaultWMSBounds
      } else if (layerName.dataType === 'GeoJSON') {
        layer = await generateGeoJSONLayer(layerName, actual, layer)
        bounds = defaultWMSBounds
      } else if (layerName.dataType === 'Photo') {
        let markers: any = []
        const colorMarker = colorScale[Math.floor(Math.random() * 30)]
        const shuffledPhotos = reorderPhotos(
          layerName.photos,
          showPhotos,
          mapBounds,
        )
        await layerName.photos.map(async (photo: any) => {
          markers = createTurfPoint(markers, photo.coordinates, 0.003)
          if (shuffledPhotos.includes(photo.filename)) {
            const getPhotoMarker = new GetPhotoMarker(
              photo,
              actual,
              colorMarker,
            )
            await getPhotoMarker.getMarker().then(async function () {
              map.addLayer(getPhotoMarker.layer)
              if (getPhotoMarker.layer) {
                getPhotoMarker.layer.on('click', async function (e) {
                  L.popup()
                    .setLatLng(e.latlng)
                    .setContent(getPhotoMarker.popupText)
                    .openOn(map)
                  photo.notCenter = true
                  setActivePhoto(photo)
                })
                if (layerName.show.includes(getPhotoMarker.fileName)) {
                  getPhotoMarker.layer.setOpacity(1)
                  getPhotoMarker.layer.setZIndexOffset(9999)
                } else {
                  getPhotoMarker.layer.setOpacity(0)
                  getPhotoMarker.layer.setIcon(smallIcon)
                  getPhotoMarker.layer.setZIndexOffset(-9999)
                }
              }
            })
          }
        })
        const turfConvex = turf.convex(turf.featureCollection(markers))
        const turfBbox = turf.bbox(turfConvex)
        bounds = [
          [turfBbox[1] - 0.05, turfBbox[0] - 0.35],
          [turfBbox[3] + 0.05, turfBbox[2] + 0.15],
        ]
        if (layerName.plotLimits && turfConvex) {
          const turflayer = createTurfLayer(actual, turfConvex)
          turflayer.addTo(map)
        }
      } else if (layerName.dataType === 'Photo-Limits') {
        let markers: any = []
        layerName.photos.map(async (photo: any) => {
          markers = createTurfPoint(markers, photo.coordinates, 0.003)
        })
        const turfConvex = turf.convex(turf.featureCollection(markers))
        layer = createTurfLayer(actual, turfConvex)
      }
      if (layerName.dataType !== 'Photo') {
        console.log('layer', layer)
        try {
          layer.forEach((individualLayer) => {
            individualLayer.options.attribution = actual
            map.addLayer(individualLayer, true)
            individualLayer && bringLayerToFront(individualLayer)
          })
        } catch {
          layer.options.attribution = actual
          map.addLayer(layer, true)
          layer && bringLayerToFront(layer)
        }
        if (layerName.dataType === 'COG' && layerName.get_value) {
          if (selectedLayers[actual]) {
            addGeoblazeValue(layerName, actual, true, null)
          }
        }
      }
      if (layerName.dataType !== 'Photo') {
        bounds = defaultWMSBounds
      }
      console.log(bounds)
      // map.fitBounds(bounds)
    })
    setLoading(false)
  }

  async function generateUploadedGeoTIFFLayer(actualLayerUpload) {
    const getTifLayer = new GetTifLayer(
      actualLayerUpload,
      `uploaded_${actualLayerUpload.name}`,
      undefined,
      undefined,
      undefined,
    )
    await getTifLayer.parseGeoSimple().then(function () {
      const layer = getTifLayer.layer
      layer.addTo(map)
    })
  }

  async function generateUploadedCOGLayer(actualLayerUpload) {
    actualLayerUpload.url = actualLayerUpload.data
    const getCOGLayer = new GetCOGLayer(
      actualLayerUpload,
      `uploaded_${actualLayerUpload.name}`,
      2,
      'COG',
      actualLayerUpload.colors,
    )
    const layer = await getCOGLayer.getTile()
    layer.addTo(map)

    if (getCOGLayer.error) {
      setFlashMessage({
        messageType: 'error',
        content: getCOGLayer.error,
      })
    }
  }

  async function generateUploadedGeoJSONLayer(actualLayerUpload) {
    console.log('actualLayerUpload', actualLayerUpload)
    const layer = L.geoJSON(actualLayerUpload.data, {
      pointToLayer: function (feature, latlng) {
        return L.marker(latlng, {
          icon: createIcon('/marker-icon.png', [25, 25]),
        })
      },
      onEachFeature: function (feature, layer) {
        layer.on({
          click: () => {
            setMapPopup({
              'Uploaded Layer': feature.properties,
            })
          },
        })
      },
      style: function () {
        const color = actualLayerUpload.colors[0]
        const myStyle = {
          color,
          fillColor: actualLayerUpload.colors[0],
          weight: 3,
          opacity: defaultOpacity,
          fillOpacity: defaultOpacity,
        }
        return myStyle
      },
    })
    layer.options.attribution = `uploaded_${actualLayerUpload.name}`
    layer.addTo(map)
  }

  async function generateSelectedUploadedLayer(type: string) {
    const layerName =
      type === 'new'
        ? actualLayerUpload
        : selectedLayersUpload[actualLayerNowUpload[0]]
    if (['GeoJSON', 'Shapefile', 'CSV'].includes(layerName.dataType)) {
      generateUploadedGeoJSONLayer(layerName)
    } else if (layerName.dataType === 'GeoTIFF') {
      generateUploadedGeoTIFFLayer(layerName)
    } else if (layerName.dataType === 'COG') {
      generateUploadedCOGLayer(layerName)
    } else if (layerName.dataType === 'WMS') {
      layerName.params = {
        layers: layerName.data,
        style: layerName.colors,
      }
      const layer = await getWMSLayer(layerName, `uploaded_${layerName.name}`)
      layer.addTo(map)
    }
    setLoading(false)
  }

  useEffect(() => {
    if (actualLayerUpload.data) {
      if (!actualLayerUpload.active) {
        generateSelectedUploadedLayer('new')
        setActualLayerUpload({
          ...actualLayerUpload,
          active: true,
        })
      }
    }
  }, [actualLayerUpload])

  async function generateGeoJSONLayer(layerName, actual, layer) {
    const color = layerName.color
      ? layerName.color
      : colorScale[Math.floor(Math.random() * 30)]
    await fetch(layerName.url)
      .then((response) => response.json())
      .then((data) => {
        layer = L.geoJSON(data, {
          pointToLayer: function (feature, latlng) {
            return L.marker(latlng, {
              icon: createIcon('/marker-icon.png', [25, 25]),
            })
          },
          onEachFeature: function (feature, layer) {
            layer.on({
              click: () => {
                setMapPopup({
                  [`${actual}`]: feature.properties,
                })
              },
              // click: () => {
              //   const popupContent = `<h3>${actual}</h3><p>${JSON.stringify(
              //     feature.properties,
              //   )}</p>`
              //   layer.bindPopup(popupContent).openPopup()
              // },
            })
          },
          style: function () {
            const myStyle = {
              color,
              fillColor: color,
              weight: 3,
              opacity: defaultOpacity,
              fillOpacity: defaultOpacity,
            }
            return myStyle
          },
        })
      })
      .catch((error) => console.error('Error:', error))
    return layer
  }

  async function getWMSLayer(layerName: any, actual: any) {
    const params: keyable = {
      service: 'wms',
      request: 'GetMap',
      version: '1.3.0',
      layers: layerName.params.layers,
      format: 'image/png',
      transparent: true,
      width: 20,
      height: 20,
      attribution: actual,
    }
    if (layerName.params.style) {
      params.style = layerName.params.style
    }
    const layer = callBetterWMS(layerName.url, params)
    layer.setOpacity(defaultOpacity)
    return layer
  }

  function removeLayerFromMap(actual?): void {
    const layerToBeChanged = actual || actualLayer
    map.eachLayer(function (layer) {
      if (layerToBeChanged.includes(layer.options.attribution)) {
        map.removeLayer(layer)
        if (activePhoto.layerName === layer.options.attribution) {
          setActivePhoto('')
        }
        setLayerAction('')
        setLayerAction('')
      }
    })
    setLoading(false)
  }

  const [batLayer, setBatLayer] = useState(null)

  useEffect(() => {
    async function fetchLayer() {
      const layer = await getGeorasterLayer(bathymetryUrl)
      setBatLayer(layer)
    }
    fetchLayer()
  }, [bathymetryUrl])

  useEffect(() => {
    if (map) {
      if (selectedSidebarOption !== 'Download') {
        removeNormalLayerFromMap('drawn')
      }
    }
  }, [selectedSidebarOption])

  useEffect(() => {
    if (map) {
      const fetchData = async () => {
        await addGeoblazeValue({}, '_Depth', false, batLayer)
      }
      fetchData()
    }
  }, [batLayer])

  useEffect(() => {
    if (activePhoto) {
      const newShowPhotos = [...showPhotos]
      newShowPhotos.forEach((photo, i) => {
        if (activePhoto.filename === photo.filename) {
          newShowPhotos[i].active = true
        } else {
          newShowPhotos[i].active = false
        }
      })
      changeIcons(activePhoto)
      setShowPhotos([])
    }
  }, [activePhoto])

  function removeNormalLayerFromMap(attribution: string) {
    map.eachLayer(function (layer: any) {
      if (layer.options.attribution === attribution) {
        map.removeLayer(layer)
      }
    })
  }

  async function changeMapZoom(actual?) {
    const layerToBeChanged = actual || actualLayer
    const localSelectedLayers = actual ? selectedLayersUpload : selectedLayers
    map.eachLayer(function (layer: any) {
      if (layerToBeChanged.includes(layer.options.attribution)) {
        if (
          localSelectedLayers[layer.options.attribution].dataType !== 'Photo'
        ) {
          // const newBounds = [
          //   [layer.options.limits[3], layer.options.limits[0]],
          //   [layer.options.limits[1], layer.options.limits[2]],
          // ]
          map.fitBounds(defaultWMSBounds)
          bringLayerToFront(layer)
          // map.fitBounds(newBounds)
        } else {
          if (!layer.options.dataType) {
            bringLayerToFront(layer)
            map.fitBounds(defaultWMSBounds)
          }
        }
        setLayerAction('')
        setLoading(false)
        return false
      }
    })
  }

  function changeMapOpacity(actual?) {
    const layerToBeChanged = actual || actualLayer
    const localSelectedLayers = actual ? selectedLayersUpload : selectedLayers
    map.eachLayer(function (layer: any) {
      if (layerToBeChanged.includes(layer.options.attribution)) {
        if (!layer.options.dataType) {
          if (layer.options.opacity) {
            layer.setOpacity(
              localSelectedLayers[layer.options.attribution].opacity,
            )
          } else {
            const newStyle = layer.options.style
            if (newStyle) {
              newStyle.fillOpacity =
                localSelectedLayers[layer.options.attribution].opacity
              newStyle.opacity =
                localSelectedLayers[layer.options.attribution].opacity
              layer.setStyle(newStyle)
            }
            layer.eachLayer(function (subLayer: any) {
              const newStyle = subLayer.options.style
              if (newStyle) {
                newStyle.fillOpacity =
                  localSelectedLayers[layer.options.attribution].opacity
                newStyle.opacity =
                  localSelectedLayers[layer.options.attribution].opacity
                subLayer.setStyle(newStyle)
              }
            })
          }
        }
      }
    })
    setLoading(false)
  }

  function changeMapMarkerShow() {
    map.eachLayer(function (layer: any) {
      if (actualLayer.includes(layer.options.attribution)) {
        map.removeLayer(layer)
        if (activePhoto.layerName === layer.options.attribution) {
          setActivePhoto('')
        }
      }
    })
    let markersAll: any = []
    actualLayer.forEach(async (actual) => {
      const color = colorScale[Math.floor(Math.random() * 30)]
      let markers: any = []
      await selectedLayers[actual].photos.map(async (photo: any) => {
        markersAll = createTurfPoint(markersAll, photo.coordinates, 0)
        markers = createTurfPoint(markers, photo.coordinates, 0.003)
        const getPhotoMarker = new GetPhotoMarker(photo, actual, color)
        await getPhotoMarker.getMarker().then(async function () {
          if (getPhotoMarker.layer) {
            if (selectedLayers[actual].show.includes(getPhotoMarker.fileName)) {
              map.addLayer(getPhotoMarker.layer)
              getPhotoMarker.layer.on('click', async function (e) {
                L.popup()
                  .setLatLng(e.latlng)
                  .setContent(getPhotoMarker.popupText)
                  .openOn(map)
                photo.notCenter = true
                setActivePhoto(photo)
              })
              getPhotoMarker.layer.setOpacity(1)
              // getPhotoMarker.layer.setIcon(inactiveIcon)
              getPhotoMarker.layer.setZIndexOffset(9999)
            }
          }
        })
      })
      if (selectedLayers[actual].plotLimits) {
        const turfConvex = turf.convex(turf.featureCollection(markers))
        const turfLayer = createTurfLayer(actual, turfConvex)
        if (turfLayer) {
          turfLayer.addTo(map)
        }
      }
    })
    const turfConvexAll = turf.convex(turf.featureCollection(markersAll))
    const turfBbox = turf.bbox(turfConvexAll)
    const bounds = [
      [turfBbox[1] - 0.05, turfBbox[0] - 0.35],
      [turfBbox[3] + 0.05, turfBbox[2] + 0.15],
    ]
    map.fitBounds(bounds)
    setLoading(false)
  }

  async function changeMapColors(actual?) {
    const layerToBeChanged = actual || actualLayer
    map.eachLayer(async (mapLayer: any) => {
      if (mapLayer.options.attribution === layerToBeChanged[0]) {
        map.removeLayer(mapLayer)
      }
    })
    if (actual) {
      await generateSelectedUploadedLayer('old')
    } else {
      await generateSelectedLayer()
    }
    setLayerAction('')
    setLoading(false)
  }

  useEffect(() => {
    if (map) {
      map.closePopup()
    }
    const actionMap = {
      remove: removeLayerFromMap,
      add: addLayerIntoMap,
      zoom: changeMapZoom,
      opacity: changeMapOpacity,
      'marker-changes': changeMapMarkerShow,
      'update-colors': changeMapColors,
    }
    if (actionMap[layerAction]) {
      setLoading(true)
      actionMap[layerAction](actualLayerNowUpload)
      setLayerAction('')
    }
  }, [selectedLayersUpload])

  useEffect(() => {
    if (map) {
      map.closePopup()
    }
    const actionMap = {
      remove: removeLayerFromMap,
      add: addLayerIntoMap,
      zoom: changeMapZoom,
      opacity: changeMapOpacity,
      'marker-changes': changeMapMarkerShow,
      'update-colors': changeMapColors,
    }
    if (actionMap[layerAction]) {
      setLoading(true)
      actionMap[layerAction]()
      setLayerAction('')
    }
  }, [selectedLayers])

  function handleSetLatlng(e: any) {
    const icon = createIcon('/marker-icon_old.png', [27, 45])
    let counter = 0
    const lineLayer: any[] = []
    Object.keys(map._layers).forEach((layer) => {
      if (map._layers[layer].options.attribution) {
        if (map._layers[layer].options.attribution === 'draw-polyline1') {
          if (lineLayer.length === 0) {
            lineLayer.push(map._layers[layer]._latlng)
            counter += 1
          }
        }
        if (map._layers[layer].options.attribution === 'draw-polyline2') {
          if (lineLayer.length === 1) {
            lineLayer.push(map._layers[layer]._latlng)
            counter += 1
          }
        }
      }
    })
    if (counter === 0) {
      const markerLayer = L.marker(e.latlng, {
        attribution: 'draw-polyline1',
        icon,
      })
        .addTo(map)
        .bindPopup('Point <br/>' + e.latlng)
      lineLayer.push(markerLayer.getLatLng())
    } else if (counter === 1) {
      const markerLayer = L.marker(e.latlng, {
        attribution: 'draw-polyline2',
        icon,
      })
        .addTo(map)
        .bindPopup('Point <br/>' + e.latlng)

      if (lineLayer.length === 1) {
        lineLayer.push(markerLayer.getLatLng())
      }
      L.polyline([lineLayer[0], lineLayer[1]], {
        color: 'red',
        attribution: 'draw-polyline3',
      }).addTo(map)
      map.dragging.enable()
      map.touchZoom.enable()
      map.doubleClickZoom.enable()
      map.scrollWheelZoom.enable()
      map.boxZoom.enable()
      map.keyboard.enable()
      map.off('click', handleSetLatlng)
      setGraphData(lineLayer)
    } else {
      map.dragging.enable()
      map.touchZoom.enable()
      map.doubleClickZoom.enable()
      map.scrollWheelZoom.enable()
      map.boxZoom.enable()
      map.keyboard.enable()
      map.off('click', handleSetLatlng)
    }
  }
  useEffect(() => {
    if (map) {
      if (getPolyline) {
        setFlashMessage({
          messageType: 'warning',
          content: 'Select two points in the map to make a graph',
        })
        map.dragging.disable()
        map.touchZoom.disable()
        map.doubleClickZoom.disable()
        map.scrollWheelZoom.disable()
        map.boxZoom.disable()
        map.keyboard.disable()
        map.on('click', handleSetLatlng)
      } else {
        map.dragging.enable()
        map.touchZoom.enable()
        map.doubleClickZoom.enable()
        map.scrollWheelZoom.enable()
        map.boxZoom.enable()
        map.keyboard.enable()
        map.off('click', handleSetLatlng)
        setGraphData(null)
        Object.keys(map._layers).forEach((layer) => {
          if (map._layers[layer].options) {
            if (map._layers[layer].options.attribution) {
              if (map._layers[layer].options.attribution === 'draw-polyline1') {
                map.removeLayer(map._layers[layer])
              } else if (
                map._layers[layer].options.attribution === 'draw-polyline2'
              ) {
                map.removeLayer(map._layers[layer])
              } else if (
                map._layers[layer].options.attribution === 'draw-polyline3'
              ) {
                map.removeLayer(map._layers[layer])
              }
            }
          }
        })
      }
    }
  }, [getPolyline])

  async function handleSetLatlngPoint(e: any) {
    setGraphData([e.latlng])
    setClickPoint(false)
  }
  useEffect(() => {
    if (clickPoint) {
      setFlashMessage({
        messageType: 'warning',
        content: 'Click on a point on the map to generate a time series graph',
      })
      map.on('click', handleSetLatlngPoint)
    } else {
      if (map) {
        map.off('click', handleSetLatlngPoint)
      }
    }
  }, [clickPoint])

  async function addInitialLayers() {
    const layerNames = [
      [
        {
          url: 'https://mpa-ows.jncc.gov.uk/mpa_mapper/wms',
          params: {
            layers: 'sac_mc_full',
          },
        },
        'Marine Protected Areas_Special Areas of Conservation',
      ],
      [
        {
          url: 'https://mpa-ows.jncc.gov.uk/mpa_mapper/wms',
          params: {
            layers: 'mcz',
          },
        },
        'Marine Protected Areas_Marine Conservation Zones',
      ],
    ]
    layerNames.forEach(async (layerName) => {
      const layer = await getWMSLayer(layerName[0], layerName[1])
      map.addLayer(layer)
    })
  }

  useEffect(() => {
    if (map) {
      addInitialLayers()
    }
  }, [map])

  useEffect(() => {
    if (map) {
      if (drawRectangle) {
        const rectangle = new L.Draw.Rectangle(map, {
          shapeOptions: {
            color: 'red',
          },
        })
        rectangle.enable()
      }
    }
  }, [drawRectangle])

  const DrawControl = () => {
    useEffect(() => {
      if (map) {
        const drawnItems = new L.FeatureGroup()
        map.addLayer(drawnItems)

        const drawControl = new L.Control.Draw({
          draw: {
            polyline: false,
            polygon: false,
            circle: false,
            circlemarker: false,
            marker: false,
          },
        })

        map.addControl(drawControl)

        map.on(L.Draw.Event.CREATED, (e) => {
          removeNormalLayerFromMap('drawn')
          const { layer } = e
          layer.options.attribution = 'drawn'
          setRectangleLimits(layer.getBounds())
          drawnItems.addLayer(layer)
        })
        return () => {
          map.removeControl(drawControl)
        }
      }
    }, [map])

    return null
  }

  const displayMap = useMemo(
    () => (
      <MapContainer
        style={{ height: '100vh', width: '100vw' }}
        center={new L.LatLng(defaultView[0], defaultView[1])}
        zoom={defaultZoom}
        zoomSnap={0.1}
        maxZoom={30}
        minZoom={3}
        scrollWheelZoom={true}
        zoomControl={false}
        ref={setMap}
      >
        <ZoomControl position="topright" />
        <ScaleControl position="bottomleft" />
        <LeafletRuler />
        <TileLayer attribution={'base layer'} url={defaultBaseLayer.url} />
        <DrawControl />
      </MapContainer>
    ),
    [map],
  )

  return <div className="absolute top-0 left-0">{displayMap}</div>
}

function mapPropsAreEqual(prevMap: any, nextMap: any) {
  return (
    prevMap.selectedLayers === nextMap.selectedLayers &&
    prevMap.actualLayer === nextMap.actualLayer &&
    prevMap.selectedArea === nextMap.selectedArea &&
    prevMap.latLonLimits === nextMap.latLonLimits &&
    prevMap.showPhotos === nextMap.showPhotos &&
    prevMap.activePhoto === nextMap.activePhoto &&
    prevMap.getPolyline === nextMap.getPolyline &&
    prevMap.clickPoint === nextMap.clickPoint &&
    prevMap.drawRectangle === nextMap.drawRectangle &&
    prevMap.rectangleLimits === nextMap.rectangleLimits &&
    prevMap.actualDate === nextMap.actualDate &&
    prevMap.selectedBaseLayer === nextMap.selectedBaseLayer &&
    prevMap.actualLayerUpload === nextMap.actualLayerUpload &&
    prevMap.selectedLayersUpload === nextMap.selectedLayersUpload &&
    prevMap.layerAction === nextMap.layerAction
  )
}

export const MapHome = React.memo(MapHome1, mapPropsAreEqual)
