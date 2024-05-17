import {
  ScreenSpaceEventHandler,
  Viewer,
  CameraFlyTo,
  ScreenSpaceEvent,
  CesiumComponentRef,
} from 'resium'
import * as turf from '@turf/turf'
import {
  Ion,
  ScreenSpaceEventType,
  WebMapServiceImageryProvider,
  Viewer as CesiumViewer,
  createWorldTerrainAsync,
} from 'cesium'
import './styles.css'
import { ResiumContainer } from './styles'
import React, { useEffect, useRef, useMemo, useState } from 'react'
import * as Cesium from 'cesium'
import { GetPhotoMarker } from '../../lib/map/addPhotoMarker'
import { GetCOGLayer, GetTifLayer } from '../../lib/map/addGeoraster'
import {
  batOrder,
  cesiumHeading,
  cesiumPitch,
  cesiumRoll,
  cesiumStartCoordinates,
  colorScale,
  createColor,
  createTurfPoint,
  defaultOpacity,
  reorderPhotos,
  threeDCoordinates,
} from '../../lib/map/utils'
import { yearMonths } from '../../data/yearMonths'
import { useContextHandle } from '../../lib/contextHandle'
import * as flatgeobuf from 'flatgeobuf'
import { cesiumMarker } from '../../assets/cesiumMarker'
import chroma from 'chroma-js'
import { useDownloadManagementHandle } from '../../lib/data/downloadManagement'

Ion.defaultAccessToken = process.env.VITE_CESIUM_TOKEN

interface keyable {
  [key: string]: any
}

interface ThreeDMapProps {
  selectedLayers: keyable
  actualLayer: string[]
  layerAction: string
  setLayerAction: any
  listLayers: any
  threeD: any
  actualDate: any
  setDepth: any
  setPosition: any
  position: any
  selectedSidebarOption: any
}
function ThreeDMap1({
  selectedLayers,
  actualLayer,
  layerAction,
  setLayerAction,
  listLayers,
  threeD,
  actualDate,
  setDepth,
  setPosition,
  position,
  selectedSidebarOption,
}: ThreeDMapProps) {
  const ref = useRef<CesiumComponentRef<CesiumViewer>>(null)

  const { setFlashMessage, setLoading } = useContextHandle()

  const [cogLayer, setCogLayer] = useState('')

  const { downloadableLayers, setDownloadableLayers, downloadInputValue } =
    useDownloadManagementHandle()

  Cesium.Camera.DEFAULT_VIEW_RECTANGLE = cesiumStartCoordinates

  // const jnccMCZ = new WebMapServiceImageryProvider({
  //   url: 'https://webgeo2.hidrografico.pt/geoserver/ows?',
  //   parameters: {
  //     service: 'wms',
  //     request: 'GetMap',
  //     version: '1.1.1',
  //     format: 'image/png',
  //     transparent: 'true',
  //     width: 256,
  //     height: 256,
  //   },
  //   layers: 'isobat:isobatimetria_8_16_30',
  // })

  // const terrainProvider = createWorldTerrainAsync()
  const terrainProvider = new Cesium.EllipsoidTerrainProvider({})

  async function handleHoverUpdateInfoBox(e: any) {
    if (ref.current?.cesiumElement) {
      const ellipsoid = ref.current.cesiumElement.scene.globe.ellipsoid
      const cartesian = ref.current.cesiumElement.camera.pickEllipsoid(
        new Cesium.Cartesian3(e.endPosition.x, e.endPosition.y),
        ellipsoid,
      )
      const cartographic = ellipsoid.cartesianToCartographic(cartesian)
      const latitudeDegrees = Cesium.Math.toDegrees(cartographic.latitude)
      const longitudeDegrees = Cesium.Math.toDegrees(cartographic.longitude)

      setPosition((position: any) => {
        const newPosition = { ...position }
        newPosition.lat = latitudeDegrees
        newPosition.lng = longitudeDegrees
        return newPosition
      })
    }
  }

  // useEffect(() => {
  //   console.log(position)
  //   if (position) {
  //   }
  // }, [position])

  async function createGeoJSONLayer(
    actual,
    turfConvex,
    layerNameType,
    layerName?: any,
  ) {
    const randomScale = Math.floor(Math.random() * 100)
    const colorLimits = layerName?.color
      ? layerName.color
      : colorScale[randomScale]
    const colorRgb = chroma(colorLimits).rgb()
    const colorCesium = new Cesium.Color(
      colorRgb[0] / 255,
      colorRgb[1] / 255,
      colorRgb[2] / 255,
      0.3,
    )
    const myStyle = {
      stroke: colorCesium,
      fill: colorCesium,
      strokeWidth: 3,
    }
    let turfLayer: any
    if (turfConvex) {
      turfLayer = await Cesium.GeoJsonDataSource.load(turfConvex, myStyle)
      // const color = createColor(colorScale)

      const icon = cesiumMarker(colorLimits)
      //  createSvgIcon(color)
      turfLayer.entities.values.forEach((entity) => {
        if (entity.position) {
          entity.billboard = {
            image: icon,
          }
        }
      })
      turfLayer.attribution = actual
      turfLayer.originalColor = colorCesium
      turfLayer.name = layerNameType
      await fetch(turfConvex)
        .then((response) => response.json())
        .then((data) => {
          setDownloadableLayers((downloadableLayers) => {
            return {
              ...downloadableLayers,
              [actual]: data,
            }
          })
        })

      return turfLayer
    }
  }

  async function createFGBLayer(actual, layerName, layers) {
    const randomScale = Math.floor(Math.random() * 100)
    const colorLimits = layerName?.color
      ? layerName.color
      : colorScale[randomScale]
    const colorRgb = chroma(colorLimits).rgb()
    const colorCesium = new Cesium.Color(
      colorRgb[0] / 255,
      colorRgb[1] / 255,
      colorRgb[2] / 255,
      0.3,
    )
    const myStyle = {
      stroke: colorCesium,
      fill: colorCesium,
      strokeWidth: 3,
    }

    const response = await fetch(layerName.url)
    const features = []
    for await (const data of flatgeobuf.geojson.deserialize(
      response.body,
      undefined,
    )) {
      features.push(data)
      const dataSource: any = await Cesium.GeoJsonDataSource.load(data, myStyle)
      dataSource.attribution = actual
      dataSource.originalColor = colorCesium
      dataSource.name = actual
      layers.add(dataSource)
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
  }

  function getWMSLayer(layerName: any, actual: any) {
    const params: keyable = {
      service: 'wms',
      request: 'GetMap',
      version: '1.3.0',
      format: 'image/png',
      transparent: true,
      width: 128,
      height: 128,
      layers: layerName.params.layers,
      attribution: actual,
    }
    if (layerName.params.style) {
      params.style = layerName.params.style
    }
    const provider = new WebMapServiceImageryProvider({
      url: layerName.url,
      parameters: params,
      layers: params.layers,
    })
    const layer = new Cesium.ImageryLayer(provider, {})
    return layer
  }

  // const wmsLayers = { mcz: jnccMCZ }
  const wmsLayers = {}

  async function correctBaseWMSOrder(layers: any) {
    layers?._layers.forEach(function (imageryLayers: any) {
      if (
        Object.keys(wmsLayers).includes(imageryLayers._imageryProvider._layers)
      ) {
        layers.remove(imageryLayers)
        const layer = new Cesium.ImageryLayer(
          wmsLayers[imageryLayers._imageryProvider._layers],
          {},
        )
        layers.add(layer)
      }
    })
  }
  function removeNormalLayerFromMap(name: string, layers?: any) {
    if (!layers) {
      layers = ref.current.cesiumElement.dataSources
    }
    layers._dataSources.forEach(function (layer: any) {
      if (layer._name === name) {
        layers.remove(layer)
      }
    })
    layers._dataSources.forEach(function (layer: any) {
      if (layer._name === name) {
        layers.remove(layer)
      }
    })
  }

  useEffect(() => {
    if (ref.current?.cesiumElement) {
      if (selectedSidebarOption === 'Download') {
        removeNormalLayerFromMap('drawn')
        setTimeout(() => {
          addDownloadLimitsToMap()
        }, 500)
      }
    }
  }, [downloadInputValue])

  function addDownloadLimitsToMap() {
    const dataSource = new Cesium.CustomDataSource('drawn')
    const layers = ref.current.cesiumElement.dataSources
    const latlngs = [
      Number(downloadInputValue.region[0]),
      Number(downloadInputValue.region[1]),
      Number(downloadInputValue.region[0]),
      Number(downloadInputValue.region[3]),
      Number(downloadInputValue.region[2]),
      Number(downloadInputValue.region[3]),
      Number(downloadInputValue.region[2]),
      Number(downloadInputValue.region[1]),
      Number(downloadInputValue.region[0]),
      Number(downloadInputValue.region[1]),
    ]
    const color = new Cesium.Color(1, 0.2, 0.2, 0.5)
    const polygon = {
      hierarchy: Cesium.Cartesian3.fromDegreesArray(latlngs),
      material: color,
    }
    const polylineEntity = new Cesium.Entity({
      polygon,
      name: 'drawn',
    })
    dataSource.entities.add(polylineEntity)
    layers.add(dataSource)
  }

  async function generateAddCOGLayer(
    layer,
    layers,
    layerName,
    actual,
    alpha,
    stats?: any,
  ) {
    const getCOGLayer = new GetCOGLayer(layerName, actual, 3)
    layer = await getCOGLayer.getTile(stats)
    if (getCOGLayer.error) {
      setFlashMessage({
        messageType: 'error',
        content: getCOGLayer.error,
      })
      return
    }
    layer.alpha = alpha
    layers.add(layer)
    correctBaseWMSOrder(layers)

    const getTifLayer = new GetTifLayer(
      layerName.url,
      actual,
      undefined,
      undefined,
      layerName,
    )
    await getTifLayer.loadGeo().then(function () {
      setDownloadableLayers((downloadableLayers) => {
        return {
          ...downloadableLayers,
          [actual]: getTifLayer.georaster,
        }
      })
    })
    if (actual.split('_')[0] === 'Bathymetry') {
      if (cogLayer) {
        if (
          batOrder.indexOf(actual.split('_')[1]) < batOrder.indexOf(cogLayer)
        ) {
          setCogLayer(actual.split('_')[1])
        }
      } else {
        setCogLayer(actual.split('_')[1])
      }
    }
  }

  useEffect(() => {
    if (ref.current?.cesiumElement) {
      if (selectedSidebarOption !== 'Download') {
        removeNormalLayerFromMap('drawn')
      } else {
        addDownloadLimitsToMap()
      }
    }
  }, [selectedSidebarOption])

  // if (ref.current) {
  //   console.log(ref.current.cesiumElement)
  // }
  async function generateSelectedLayer() {
    actualLayer.forEach(async (actual) => {
      const layerName = selectedLayers[actual]
      let layer: any
      let layers: any
      let dataSource
      if (layerName.dataType === 'WMS') {
        layers = ref.current.cesiumElement.scene.imageryLayers
        layer = getWMSLayer(layerName, actual)
        layer.attribution = actual
        layer.alpha = defaultOpacity
        layers.add(layer)
        correctBaseWMSOrder(layers)
      } else if (layerName.dataType === 'COG') {
        layers = ref.current.cesiumElement.scene.imageryLayers
        if (typeof layerName.url === 'string') {
          await generateAddCOGLayer(
            layer,
            layers,
            layerName,
            actual,
            defaultOpacity,
          )
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
              await generateAddCOGLayer(
                layer,
                layers,
                newLayerName,
                actual,
                defaultOpacity,
                stats,
              )
            }),
          )
        }
      } else if (layerName.dataType === 'GeoTIFF') {
        layers = ref.current.cesiumElement.scene.imageryLayers
        layerName.url = layerName.url.replace(
          'actualDate',
          yearMonths[actualDate],
        )
        await generateAddCOGLayer(
          layer,
          layers,
          layerName,
          actual,
          defaultOpacity,
        )
      } else if (layerName.dataType === 'GeoJSON') {
        layers = ref.current.cesiumElement.dataSources
        const geoJsonLayer = createGeoJSONLayer(
          actual,
          layerName.url,
          'geojson_layer',
          layerName,
        )
        layers.add(geoJsonLayer)
      } else if (layerName.dataType === 'FGB') {
        layers = ref.current.cesiumElement.dataSources
        createFGBLayer(actual, layerName, layers)
      } else if (layerName.dataType === 'Photo') {
        ref.current.cesiumElement.infoBox.frame.removeAttribute('sandbox')
        ref.current.cesiumElement.infoBox.frame.src = 'about:blank'
        dataSource = new Cesium.CustomDataSource(actual)
        layers = ref.current.cesiumElement.dataSources
        let markers: any = []
        const colorMarker = createColor(colorScale, true)
        const shuffledPhotos = reorderPhotos(layerName.photos)
        await layerName.photos.map(async (photo: any) => {
          markers = createTurfPoint(markers, photo.coordinates, 0.003)
          if (shuffledPhotos.includes(photo.filename)) {
            const getPhotoMarker = new GetPhotoMarker(
              photo,
              actual,
              colorMarker,
            )
            await getPhotoMarker.getMarker3D().then(async function () {
              dataSource.entities.add(getPhotoMarker.layer)
            })
          }
        })
        dataSource.attribution = actual
        layers.add(dataSource)
        const turfConvex = turf.convex(turf.featureCollection(markers))
        if (layerName.plotLimits) {
          const turfLayer = createGeoJSONLayer(actual, turfConvex, 'limits')
          layers.add(turfLayer)
        }
      }
      if (layerName.bbox) {
        ref.current.cesiumElement.camera.flyTo({
          destination: Cesium.Rectangle.fromDegrees(
            layerName.bbox[0],
            layerName.bbox[1],
            layerName.bbox[2],
            layerName.bbox[3],
          ),
        })
      } else {
        ref.current.cesiumElement.camera.flyTo({
          destination: cesiumStartCoordinates,
        })
      }
    })
    setLoading(false)
  }

  function removeLayerFromMap() {
    actualLayer.forEach(async (actual) => {
      const splitActual = actual.split('_')
      const layerName = listLayers[splitActual[0]].layerNames[splitActual[1]]
      let layers: any
      if (['WMS', 'COG', 'GeoTIFF'].includes(layerName.dataType)) {
        layers = ref.current.cesiumElement.scene.imageryLayers
        layers?._layers.forEach(function (layer: any) {
          if ([actual].includes(layer.attribution)) {
            layers.remove(layer)
            setLayerAction('')
          }
        })
        if (splitActual[0] === cogLayer) {
          let newCogLayer = ''
          Object.keys(selectedLayers).forEach((layer) => {
            if (layer.split('_')[0] === 'Bathymetry') {
              if (newCogLayer) {
                if (
                  batOrder.indexOf(newCogLayer) <
                  batOrder.indexOf(layer.split('_')[1])
                ) {
                  newCogLayer = layer.split('_')[1]
                }
              } else {
                newCogLayer = layer.split('_')[1]
              }
            }
          })
          if (newCogLayer) {
            setCogLayer(newCogLayer)
          }
        }
      } else if (['GeoJSON', 'FGB'].includes(layerName.dataType)) {
        while (removeMatchingLayersDataSources(layers)) {
          /* empty */
        }
        setLayerAction('')
      } else if (layerName.dataType === 'Photo') {
        layers = ref.current.cesiumElement.dataSources
        layers._dataSources.forEach(function (layer: any) {
          if (actualLayer.includes(layer.attribution)) {
            layers.remove(layer)
          }
        })
        setLayerAction('')
        layers._dataSources.forEach(function (layer: any) {
          if (actualLayer.includes(layer.attribution)) {
            layers.remove(layer)
          }
        })
      }
    })
    setLoading(false)
  }

  async function addLayerIntoMap() {
    await generateSelectedLayer()
    setLayerAction('')
  }

  // if (ref.current?.cesiumElement) {
  //   // const layers = ref.current.cesiumElement.scene.imageryLayers
  //   const layers = ref.current.cesiumElement.dataSources
  // }

  async function handleTerrainLayer() {
    if (threeD) {
      const terrainUrl = await Cesium.CesiumTerrainProvider.fromIonAssetId(
        parseInt(threeD.dataInfo.assetId),
      )

      ref.current.cesiumElement.terrainProvider = terrainUrl
      ref.current.cesiumElement.camera.flyTo({
        destination: threeDCoordinates,
        orientation: {
          heading: cesiumHeading,
          pitch: cesiumPitch,
          roll: cesiumRoll,
        },
      })
    } else {
      ref.current.cesiumElement.terrainProvider = await terrainProvider
    }
  }

  useEffect(() => {
    if (ref.current?.cesiumElement) {
      handleTerrainLayer()
    }
  }, [threeD])

  function removeMatchingLayersDataSources(layers) {
    layers = ref.current.cesiumElement.dataSources
    let found = false
    layers._dataSources.slice().forEach(function (layer: any) {
      if (actualLayer.includes(layer.attribution)) {
        layers.remove(layer)
        found = true
      }
    })
    return found
  }

  function changeMapOpacity() {
    let layers: any
    actualLayer.forEach(async (actual) => {
      const splitActual = actual.split('_')
      const layerName = listLayers[splitActual[0]].layerNames[splitActual[1]]
      if (['WMS', 'COG', 'GeoTIFF'].includes(layerName.dataType)) {
        layers = ref.current.cesiumElement.scene.imageryLayers
        layers?._layers.forEach(function (layer: any) {
          if ([actual].includes(layer.attribution)) {
            layers.remove(layer)
            if (layerName.dataType === 'WMS') {
              layer = getWMSLayer(layerName, actual)
              layer.attribution = actual
              layer.alpha = selectedLayers[layer.attribution].opacity
              layers.add(layer)
              correctBaseWMSOrder(layers)
            } else {
              generateAddCOGLayer(
                layer,
                layers,
                layerName,
                actual,
                selectedLayers[layer.attribution].opacity,
              )
            }
          }
        })
      } else if (layerName.dataType === 'Photo') {
        layers = ref.current.cesiumElement.dataSources
        layers._dataSources.forEach(function (layer: any) {
          if (actualLayer.includes(layer.attribution)) {
            if (layer._name === 'limits') {
              const color = layer.originalColor
              color.alpha = Number(selectedLayers[layer.attribution].opacity)
              if (color.alpha > 0.99) {
                color.alpha = 0.99
              }
              layer.entities._entities._array[0]._polygon.material = color
            }
          }
        })
      } else if (['GeoJSON', 'FGB'].includes(layerName.dataType)) {
        layers = ref.current.cesiumElement.dataSources
        layers._dataSources.slice().forEach(function (layer: any) {
          if ([actual].includes(layer.attribution)) {
            const color = layer.originalColor
            color.alpha = Number(selectedLayers[layer.attribution].opacity)
            if (color.alpha > 0.99) {
              color.alpha = 0.99
            }
            layer.entities.values.forEach((entity) => {
              entity.polygon.material = new Cesium.ColorMaterialProperty(color)
            })
            layer.originalColor = color
          }
        })
      }
      setLayerAction('')
    })
    setLoading(false)
  }

  async function changeMapZoom() {
    let layers: any
    actualLayer.forEach(async (actual) => {
      const splitActual = actual.split('_')
      const layerName = listLayers[splitActual[0]].layerNames[splitActual[1]]
      if (['WMS', 'COG', 'GeoTIFF'].includes(layerName.dataType)) {
        layers = ref.current.cesiumElement.scene.imageryLayers
        layers?._layers.forEach(function (layer: any) {
          if ([actual].includes(layer.attribution)) {
            layers.remove(layer)
            if (layerName.dataType === 'WMS') {
              const layerNew = getWMSLayer(layerName, actualLayer[0])
              layerNew.alpha = layer.alpha
              layers.add(layerNew)
              correctBaseWMSOrder(layers)
            } else {
              generateAddCOGLayer(
                layer,
                layers,
                layerName,
                actual,
                selectedLayers[layer.attribution].opacity,
              )
            }
            if (layerName.bbox) {
              ref.current.cesiumElement.camera.flyTo({
                destination: Cesium.Rectangle.fromDegrees(
                  layerName.bbox[0],
                  layerName.bbox[1],
                  layerName.bbox[2],
                  layerName.bbox[3],
                ),
              })
            } else {
              ref.current.cesiumElement.camera.flyTo({
                destination: cesiumStartCoordinates,
              })
            }
            setLayerAction('')
          }
        })
      } else if (['GeoJSON', 'FGB'].includes(layerName.dataType)) {
        layers = ref.current.cesiumElement.dataSources
        let originalColor: any
        layers._dataSources.slice().forEach(function (layer: any) {
          if (actualLayer.includes(layer.attribution)) {
            originalColor = layer.originalColor
          }
        })
        while (removeMatchingLayersDataSources(layers)) {
          /* empty */
        }
        const myStyle = {
          stroke: originalColor,
          fill: originalColor,
          strokeWidth: 3,
        }
        if (layerName.dataType === 'GeoJSON') {
          const dataSource: any = await Cesium.GeoJsonDataSource.load(
            layerName.url,
            myStyle,
          )
          dataSource.attribution = actual
          dataSource.originalColor = originalColor
          dataSource.name = actual
          layers.add(dataSource)
        } else {
          if (downloadableLayers[actual]) {
            downloadableLayers[actual].features.forEach(async (data) => {
              const dataSource: any = await Cesium.GeoJsonDataSource.load(
                data,
                myStyle,
              )
              dataSource.attribution = actual
              dataSource.originalColor = originalColor
              dataSource.name = actual
              layers.add(dataSource)
            })
          }
        }
        if (layerName.bbox) {
          ref.current.cesiumElement.camera.flyTo({
            destination: Cesium.Rectangle.fromDegrees(
              layerName.bbox[0],
              layerName.bbox[1],
              layerName.bbox[2],
              layerName.bbox[3],
            ),
          })
        } else {
          ref.current.cesiumElement.camera.flyTo({
            destination: cesiumStartCoordinates,
          })
        }
        setLayerAction('')
      }
    })
    setLoading(false)
  }

  async function changeMapColors(actual?) {
    setFlashMessage({
      messageType: 'info',
      content: 'Changing layer colors. This may take a while.',
    })
    const layerToBeChanged = actual || actualLayer
    layerToBeChanged.forEach(async (actual) => {
      const splitActual = actual.split('_')
      const layerName = listLayers[splitActual[0]].layerNames[splitActual[1]]
      let layers: any
      if (['WMS', 'COG', 'GeoTIFF'].includes(layerName.dataType)) {
        layers = ref.current.cesiumElement.scene.imageryLayers
        layers?._layers.forEach(function (layer: any) {
          if ([actual].includes(layer.attribution)) {
            layers.remove(layer)
          }
        })
        await generateSelectedLayer()
      } else if (['GeoJSON', 'FGB'].includes(layerName.dataType)) {
        layers = ref.current.cesiumElement.dataSources
        layers._dataSources.slice().forEach(function (layer: any) {
          if ([actual].includes(layer.attribution)) {
            const color = layer.originalColor
            color.alpha = Number(selectedLayers[layer.attribution].opacity)
            if (color.alpha > 0.99) {
              color.alpha = 0.99
            }
            const colorRgb = chroma(
              selectedLayers[layer.attribution].colors,
            ).rgb()
            const colorCesium = new Cesium.Color(
              colorRgb[0] / 255,
              colorRgb[1] / 255,
              colorRgb[2] / 255,
              color.alpha,
            )
            const colorCesiumStroke = new Cesium.Color(
              colorRgb[0] / 255,
              colorRgb[1] / 255,
              colorRgb[2] / 255,
              0.99,
            )
            layer.entities.values.forEach((entity) => {
              entity.polygon.material = new Cesium.ColorMaterialProperty(
                colorCesium,
              )
              entity.polygon.outline = true
              entity.polygon.outlineColor = new Cesium.ColorMaterialProperty(
                colorCesiumStroke,
              )
              entity.polygon.outlineWidth = 3
              // entity.billboard.color = colorCesium
            })
            layer.originalColor = colorCesium
          }
        })
      }
      // } else if (['GeoJSON', 'FGB'].includes(layerName.dataType)) {
      //   function removeMatchingLayers() {
      //     layers = ref.current.cesiumElement.dataSources
      //     let found = false
      //     layers._dataSources.slice().forEach(function (layer: any) {
      //       // Use slice to copy the array to avoid modification issues
      //       if (actualLayer.includes(layer.attribution)) {
      //         layers.remove(layer)
      //         found = true // Set found to true if at least one layer is removed
      //       }
      //     })
      //     return found
      //   }
      //   while (removeMatchingLayers()) {
      //     /* empty */
      //   }
      // } else if (layerName.dataType === 'Photo') {
      //   layers = ref.current.cesiumElement.dataSources
      //   layers._dataSources.forEach(function (layer: any) {
      //     if (actualLayer.includes(layer.attribution)) {
      //       layers.remove(layer)
      //     }
      //   })
      //   layers._dataSources.forEach(function (layer: any) {
      //     if (actualLayer.includes(layer.attribution)) {
      //       layers.remove(layer)
      //     }
      //   })
    })
    // if (actual) {
    //   await generateSelectedUploadedLayer('old')
    // } else {
    //   await generateSelectedLayer()
    // }
    setLayerAction('')
    setLoading(false)
  }

  useEffect(() => {
    if (layerAction) {
      const actionMap = {
        remove: removeLayerFromMap,
        add: addLayerIntoMap,
        zoom: changeMapZoom,
        opacity: changeMapOpacity,
        'update-colors': changeMapColors,
      }
      if (actionMap[layerAction]) {
        setLoading(true)
        actionMap[layerAction]()
        setLayerAction('')
      }
    }
  }, [selectedLayers])

  const isDevelopment = process.env.VITE_ENV === 'development'

  const displayMap = useMemo(
    () => (
      <Viewer
        full={!isDevelopment}
        animation={false}
        timeline={false}
        ref={ref}
        infoBox={true}
        terrainProvider={terrainProvider}
        navigationHelpButton={false}
        scene3DOnly={true}
      >
        {/* <CesiumZoomControl /> */}
        {/* <Cesium3DTileset
          url={CesiumTerrainProvider.fromIonAssetId(2182075)}
          onReady={handleReady}
        /> */}
        {/* <ImageryLayer imageryProvider={jnccMCZ} /> */}
        <CameraFlyTo destination={cesiumStartCoordinates} duration={3} />
        <ScreenSpaceEventHandler>
          <ScreenSpaceEvent
            action={(e) => handleHoverUpdateInfoBox(e)}
            type={ScreenSpaceEventType.MOUSE_MOVE}
          />
        </ScreenSpaceEventHandler>
      </Viewer>
    ),
    [],
  )

  return <ResiumContainer>{displayMap}</ResiumContainer>
}

function mapPropsAreEqual(prevMap: any, nextMap: any) {
  return (
    prevMap.selectedLayers === nextMap.selectedLayers &&
    prevMap.threeD === nextMap.threeD &&
    prevMap.cogLayer === nextMap.cogLayer &&
    prevMap.actualLayer === nextMap.actualLayer &&
    prevMap.selectedSidebarOption === nextMap.selectedSidebarOption
  )
}

export const ThreeDMap = React.memo(ThreeDMap1, mapPropsAreEqual)
