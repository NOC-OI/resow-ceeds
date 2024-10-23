import {
  MapContainer,
  TileLayer,
  ScaleControl,
  ZoomControl,
} from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import React, { act, useEffect, useMemo, useState } from 'react'
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
  createDivIcon,
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
import * as flatgeobuf from 'flatgeobuf'

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
  setGraphLimits: any
  actualDate: any
  setMapPopup: any
  clickPoint: any
  setClickPoint: any
  setDepth: any
  setPosition: any
  selectedBaseLayer: any
  graphLimits: any
  setPolylineOnMap: any
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
  setGraphLimits,
  actualDate,
  setMapPopup,
  clickPoint,
  setClickPoint,
  setDepth,
  setPosition,
  selectedBaseLayer,
  graphLimits,
  setPolylineOnMap,
}: MapProps) {
  const { setFlashMessage, setLoading } = useContextHandle()
  const {
    actualLayerUpload,
    setActualLayerUpload,
    selectedLayersUpload,
    actualLayerNowUpload,
  } = useUploadDataHandle()
  const {
    drawRectangle,
    setRectangleLimits,
    setDownloadableLayers,
    downloadInputValue,
  } = useDownloadManagementHandle()
  const [map, setMap] = useState<any>(null)
  // const [mapCenter, setMapCenter] = useState<L.LatLng>(
  //   new L.LatLng(defaultView[0], defaultView[1]),
  // )
  function bringLayerToFront(layer: any) {
    try {
      layer.bringToFront()
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
      if (!graphLimits) {
        removeNormalLayerFromMap('drawn-polyline')
        setPolylineOnMap(false)
      }
    }
  }, [graphLimits])
  const DrawLine = L.Draw.Polyline.extend({
    initialize: function (map, options) {
      L.Draw.Polyline.prototype.initialize.call(this, map, options)
    },
    addVertex: function (latlng) {
      const markersLength = this._markers.length
      if (
        markersLength >= 2 &&
        !this.options.allowIntersection &&
        this._poly.newLatLngIntersects(latlng)
      ) {
        this._showErrorTooltip()
        return
      } else if (this._errorShown) {
        this._hideErrorTooltip()
      }
      this._markers.push(this._createMarker(latlng))

      this._poly.addLatLng(latlng)

      if (this._poly.getLatLngs().length === 2) {
        this._map.addLayer(this._poly)
      }
      this._vertexChanged(latlng, true)
      if (this._markers.length === 2) {
        this._finishShape()
      }
    },
  })
  useEffect(() => {
    if (map) {
      if (getPolyline) {
        setFlashMessage({
          messageType: 'warning',
          content: 'Select two points in the map to make a graph',
        })
        // @ts-expect-error drawLine is a new instance of DrawLine
        const polyline = new DrawLine(map, {
          shapeOptions: {
            color: 'red',
          },
        })
        polyline.enable()
      } else {
        setPolylineOnMap(false)
        removeNormalLayerFromMap('drawn-polyline')
      }
    }
  }, [getPolyline])

  useEffect(() => {
    if (map) {
      map.on('moveend', function () {
        setMapBounds(map.getBounds())
        // setMapCenter(map.getCenter())
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
        // setMapCenter(map.getCenter())
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

  // if (map) {
  //   map.eachLayer(function (mapLayer: any) {
  //     console.log(mapLayer)
  //   })
  // }

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

  async function getFlatGeoBufData(layerName, actual) {
    const response = await fetch(layerName.url)
    const layers = []
    const features = []
    for await (const data of flatgeobuf.geojson.deserialize(
      response.body,
      undefined,
    )) {
      features.push(data)
      const layer = L.geoJSON(data, {
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
          })
        },
        style: function () {
          const myStyle = {
            color: layerName.colors,
            fillColor: layerName.colors,
            weight: 3,
            opacity: defaultOpacity,
            fillOpacity: defaultOpacity,
          }
          return myStyle
        },
      })
      layer.options.attribution = actual
      layer.addTo(map)
      bringLayerToFront(layer)
      layers.push(layer)
    }
    const fgbFile = {
      type: 'FeatureCollection',
      features,
    }
    setDownloadableLayers((downloadableLayers) => {
      return {
        ...downloadableLayers,
        [actual]: fgbFile,
      }
    })
    return layers
  }

  async function generateSelectedLayer() {
    actualLayer.forEach(async (actual) => {
      const layerName = selectedLayers[actual]
      let layer: any
      if (layerName.dataType === 'WMS') {
        layer = await getWMSLayer(layerName, actual)
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
        } else {
          let minValue
          let maxValue
          let stats
          if (!layerName.scale) {
            stats = await Promise.all(
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
                return {
                  b1: { percentile_2: minValue, percentile_98: maxValue },
                }
              }),
            )
          }
          layer = await Promise.all(
            layerName.url.map(async (individualUrl) => {
              const newLayerName = { ...layerName }
              newLayerName.scale = newLayerName.scale
                ? newLayerName.scale
                : [
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
              return await getCOGLayer.getTile(
                stats ? stats[stats.length - 1] : undefined,
              )
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
      } else if (layerName.dataType === 'FGB') {
        layer = await getFlatGeoBufData(layerName, actual)
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
          setDownloadableLayers((downloadableLayers) => {
            return {
              ...downloadableLayers,
              [actual]: getTifLayer.georaster,
            }
          })
        })
      } else if (layerName.dataType === 'arcgis') {
        layer = esri.dynamicMapLayer({ url: layerName.url })
        layer.setLayers([1, 2, 3, 4, 5, 6, 7, 8, 12, 13, 14, 15])
      } else if (layerName.dataType === 'GeoJSON') {
        layer = await generateGeoJSONLayer(layerName, actual, layer)
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
        // const turfBbox = turf.bbox(turfConvex)
        // bounds = [
        //   [turfBbox[1] - 0.05, turfBbox[0] - 0.35],
        //   [turfBbox[3] + 0.05, turfBbox[2] + 0.15],
        // ]
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
      if (!['Photo', 'FGB'].includes(layerName.dataType)) {
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
      // const bounds = layerName.bbox
      //   ? [
      //       [layerName.bbox[1] - 0.1, layerName.bbox[0] - 0.1],
      //       [layerName.bbox[3] + 0.1, layerName.bbox[2] + 0.1],
      //     ]
      //   : defaultWMSBounds
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
      if (actualLayerUpload.bbox) {
        const bounds = [
          [
            Number(actualLayerUpload.bbox[1]) - 0.1,
            Number(actualLayerUpload.bbox[0]) - 0.1,
          ],
          [
            Number(actualLayerUpload.bbox[3]) + 0.1,
            Number(actualLayerUpload.bbox[2]) + 0.1,
          ],
        ]
        map.fitBounds(bounds)
      }
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
    if (actualLayerUpload.bbox) {
      const bounds = [
        [
          Number(actualLayerUpload.bbox[1]) - 0.1,
          Number(actualLayerUpload.bbox[0]) - 0.1,
        ],
        [
          Number(actualLayerUpload.bbox[3]) + 0.1,
          Number(actualLayerUpload.bbox[2]) + 0.1,
        ],
      ]
      map.fitBounds(bounds)
    }

    if (getCOGLayer.error) {
      setFlashMessage({
        messageType: 'error',
        content: getCOGLayer.error,
      })
    }
  }

  async function generateUploadedGeoJSONLayer(actualLayerUpload) {
    const colors =
      typeof actualLayerUpload.colors === 'string'
        ? actualLayerUpload.colors
        : actualLayerUpload.colors[0]
    const layer = L.geoJSON(actualLayerUpload.data, {
      pointToLayer: function (feature, latlng) {
        return L.marker(latlng, {
          icon: createDivIcon(colors, [25, 25]),
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
        const color = colors
        const myStyle = {
          color,
          fillColor: colors,
          weight: 3,
          opacity: defaultOpacity,
          fillOpacity: defaultOpacity,
        }
        return myStyle
      },
    })
    const bounds = layer.getBounds()
    layer.options.attribution = `uploaded_${actualLayerUpload.name}`
    layer.addTo(map)
    map.fitBounds(bounds)
  }

  async function generateSelectedUploadedLayer(type: string) {
    const layerName =
      type === 'new'
        ? actualLayerUpload
        : selectedLayersUpload[actualLayerNowUpload[0]]
    if (
      ['GeoJSON', 'Shapefile', 'CSV', 'KML', 'KMZ'].includes(layerName.dataType)
    ) {
      generateUploadedGeoJSONLayer(layerName)
    } else if (layerName.dataType === 'GeoTIFF') {
      generateUploadedGeoTIFFLayer(layerName)
    } else if (layerName.dataType === 'ASC') {
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
      if (layerName.bbox) {
        const bounds = [
          [Number(layerName.bbox[1]) - 0.1, Number(layerName.bbox[0]) - 0.1],
          [Number(layerName.bbox[3]) + 0.1, Number(layerName.bbox[2]) + 0.1],
        ]
        map.fitBounds(bounds)
      }
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
              icon: createDivIcon(color, [25, 25]),
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
        setDownloadableLayers((downloadableLayers) => {
          return {
            ...downloadableLayers,
            [actual]: data,
          }
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
    const layer = callBetterWMS(layerName.url, params, setMapPopup, actual)
    layer.setOpacity(defaultOpacity)
    return layer
  }

  function removeLayerFromMap(actual?): void {
    const layerToBeChanged = actual || actualLayer
    map.eachLayer(function (layer) {
      if (layerToBeChanged.includes(layer.options.attribution)) {
        map.removeLayer(layer)
        if (!actual) {
          setDownloadableLayers((downloadableLayers) => {
            const newDownloadableLayers = { ...downloadableLayers }
            delete newDownloadableLayers[layer.options.attribution]
            return newDownloadableLayers
          })
        }
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

  function addDownloadLimitsToMap() {
    const latlngs = [
      [downloadInputValue.region[1], downloadInputValue.region[0]],
      [downloadInputValue.region[3], downloadInputValue.region[0]],
      [downloadInputValue.region[3], downloadInputValue.region[2]],
      [downloadInputValue.region[1], downloadInputValue.region[2]],
    ]
    const layer = L.polygon(latlngs, {
      attribution: 'drawn',
      color: 'red',
      fill: true,
      fillColor: null,
      fillOpacity: 0.2,
      opacity: 0.5,
      stroke: true,
      weight: 4,
    })
    layer.options.attribution = 'drawn'
    map.addLayer(layer)
  }

  useEffect(() => {
    if (map) {
      if (selectedSidebarOption === 'Download') {
        removeNormalLayerFromMap('drawn')
        setTimeout(() => {
          addDownloadLimitsToMap()
        }, 500)
      }
    }
  }, [downloadInputValue])

  useEffect(() => {
    if (map) {
      if (selectedSidebarOption !== 'Download') {
        removeNormalLayerFromMap('drawn')
      } else {
        addDownloadLimitsToMap()
      }
      if (!['selected_layers'].includes(selectedSidebarOption)) {
        setPolylineOnMap(false)
        removeNormalLayerFromMap('drawn-polyline')
      } else if (graphLimits) {
        const layer = graphLimits
        const attribution = 'drawn-polyline'
        const coordinates = layer.getLatLngs()
        const icon = createIcon('/marker-icon_old.png', [22, 35])
        const startMarker = L.marker(coordinates[0], {
          icon,
        })
        startMarker.options.attribution = attribution
        map.addLayer(startMarker)
        const endMarker = L.marker(coordinates[1], {
          icon,
        })
        endMarker.options.attribution = attribution
        map.addLayer(endMarker)
        layer.options.attribution = attribution
        map.addLayer(layer)
        setPolylineOnMap(true)
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
          let bounds = localSelectedLayers[layer.options.attribution].bbox
            ? [
                [
                  localSelectedLayers[layer.options.attribution].bbox[1] - 0.1,
                  localSelectedLayers[layer.options.attribution].bbox[0] - 0.1,
                ],
                [
                  localSelectedLayers[layer.options.attribution].bbox[3] + 0.1,
                  localSelectedLayers[layer.options.attribution].bbox[2] + 0.1,
                ],
              ]
            : defaultWMSBounds
          if (
            ['GeoJSON', 'Shapefile', 'CSV', 'KML', 'KMZ'].includes(
              localSelectedLayers[layer.options.attribution].dataType,
            )
          ) {
            bounds = layer.getBounds()
          }
          bringLayerToFront(layer)
          map.fitBounds(bounds)
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

  async function changeMapOrder() {
    const sortedArray = Object.entries(selectedLayers)
      .sort((a: any, b: any) => a[1].order - b[1].order)
      .map((entry) => entry[0])

    sortedArray.forEach((layer) => {
      map.eachLayer(function (mapLayer: any) {
        if (layer === mapLayer.options.attribution) {
          bringLayerToFront(mapLayer)
        }
      })
    })
    setLayerAction('')
    setLoading(false)
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
      sort: changeMapOrder,
      'marker-changes': changeMapMarkerShow,
      'update-colors': changeMapColors,
    }
    if (actionMap[layerAction]) {
      setLoading(true)
      actionMap[layerAction]()
      setLayerAction('')
    }
  }, [selectedLayers])

  async function handleSetLatlngPoint(e: any) {
    setGraphLimits([e.latlng])
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

  // async function addInitialLayers() {
  //   const layerNames = [
  //     [
  //       {
  //         url: 'https://mpa-ows.jncc.gov.uk/mpa_mapper/wms',
  //         params: {
  //           layers: 'sac_mc_full',
  //         },
  //       },
  //       'Marine Protected Areas_Special Areas of Conservation',
  //     ],
  //     [
  //       {
  //         url: 'https://mpa-ows.jncc.gov.uk/mpa_mapper/wms',
  //         params: {
  //           layers: 'mcz',
  //         },
  //       },
  //       'Marine Protected Areas_Marine Conservation Zones',
  //     ],
  //   ]
  //   layerNames.forEach(async (layerName) => {
  //     const layer = await getWMSLayer(layerName[0], layerName[1])
  //     map.addLayer(layer)
  //   })
  // }

  // useEffect(() => {
  //   if (map) {
  //     addInitialLayers()
  //   }
  // }, [map])

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

        map.on(L.Draw.Event.CREATED, (e: any) => {
          let attribution = 'drawn'
          const { layer } = e
          if (e.layerType === 'polyline') {
            attribution = 'drawn-polyline'
          }
          removeNormalLayerFromMap(attribution)
          if (e.layerType === 'polyline') {
            const coordinates = layer.getLatLngs()
            setGraphLimits(layer)
            const icon = createIcon('/marker-icon_old.png', [22, 35])
            const startMarker = L.marker(coordinates[0], {
              icon,
            })
            startMarker.options.attribution = attribution
            map.addLayer(startMarker)
            const endMarker = L.marker(coordinates[1], {
              icon,
            })
            endMarker.options.attribution = attribution
            map.addLayer(endMarker)
            setPolylineOnMap(true)
          } else {
            setRectangleLimits(layer.getBounds())
          }
          layer.options.attribution = attribution
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
    prevMap.layerAction === nextMap.layerAction &&
    prevMap.polylineOnMap === nextMap.polylineOnMap &&
    prevMap.graphLimits === nextMap.graphLimits
  )
}

export const MapHome = React.memo(MapHome1, mapPropsAreEqual)
