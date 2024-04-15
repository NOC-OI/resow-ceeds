import {
  ScreenSpaceEventHandler,
  Viewer,
  ImageryLayer,
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
import { Loading } from '../Loading'
import { GetPhotoMarker } from '../../lib/map/addPhotoMarker'
import { GetCOGLayer } from '../../lib/map/addGeoraster'
import {
  batOrder,
  bathymetryUrl,
  cesiumHeading,
  cesiumPitch,
  cesiumRoll,
  cesiumStartCoordinates,
  colorScale,
  createColor,
  createTurfPoint,
  defaultOpacity,
  defineNewDepthValue,
  getGeorasterLayer,
  reorderPhotos,
  threeDCoordinates,
} from '../../lib/map/utils'
import { InfoBox } from '../InfoBox'
import { yearMonths } from '../../data/yearMonths'

Ion.defaultAccessToken = process.env.VITE_CESIUM_TOKEN

interface DisplayPositionProps {
  position: any
  depth: any
}

function DisplayPosition({ position, depth }: DisplayPositionProps) {
  return <InfoBox position={position} depth={depth} />
}
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
}
function ThreeDMap1({
  selectedLayers,
  actualLayer,
  layerAction,
  setLayerAction,
  listLayers,
  threeD,
  actualDate,
}: ThreeDMapProps) {
  const [position, setPosition] = useState(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [depth, setDepth] = useState({})
  const ref = useRef<CesiumComponentRef<CesiumViewer>>(null)

  const [cogLayer, setCogLayer] = useState('')

  const [batLayer, setBatLayer] = useState(null)

  useEffect(() => {
    async function fetchLayer() {
      const layer = await getGeorasterLayer(bathymetryUrl)
      setBatLayer(layer)
    }
    fetchLayer()
  }, [bathymetryUrl])

  Cesium.Camera.DEFAULT_VIEW_RECTANGLE = cesiumStartCoordinates

  const jnccMCZ = new WebMapServiceImageryProvider({
    url: 'https://webgeo2.hidrografico.pt/geoserver/ows?',
    parameters: {
      service: 'wms',
      request: 'GetMap',
      version: '1.1.1',
      format: 'image/png',
      transparent: 'true',
      width: 256,
      height: 256,
    },
    layers: 'isobat:isobatimetria_8_16_30',
  })

  const terrainProvider = createWorldTerrainAsync()

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
      const latlng = {
        lat: latitudeDegrees,
        lng: longitudeDegrees,
      }
      defineNewDepthValue('_Depth', {}, latlng, null, batLayer, setDepth)
    }
  }

  async function createGeoJSONLayer(actual, turfConvex, layerName = 'limits') {
    const colorLimits = createColor(colorScale, true, 0.3)

    const myStyle = {
      stroke: colorLimits,
      fill: colorLimits,
      strokeWidth: 3,
    }
    let turfLayer: any
    if (turfConvex) {
      turfLayer = await Cesium.GeoJsonDataSource.load(turfConvex, myStyle)
      turfLayer.attribution = actual
      turfLayer.originalColor = colorLimits
      turfLayer.name = layerName
      return turfLayer
    }
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

  const wmsLayers = { mcz: jnccMCZ }
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

  async function generateAddCOGLayer(layer, layers, layerName, actual, alpha) {
    const getCOGLayer = new GetCOGLayer(layerName, actual, 3)
    layer = await getCOGLayer.getTile()
    layer.alpha = alpha
    layers.add(layer)
    correctBaseWMSOrder(layers)

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
        await generateAddCOGLayer(
          layer,
          layers,
          layerName,
          actual,
          defaultOpacity,
        )
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
        )
        layers.add(geoJsonLayer)
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
          const turfLayer = createGeoJSONLayer(actual, turfConvex)
          layers.add(turfLayer)
        }
      }
    })
    setLoading(false)
  }

  function removeLayerFromMap() {
    actualLayer.forEach(async (actual) => {
      const splitActual = actual.split('_')
      const layerName = listLayers[splitActual[0]].layerNames[splitActual[1]]
      let layers: any
      if (layerName.dataType === 'WMS' || layerName.dataType === 'COG') {
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
      } else if (layerName.dataType === 'GeoJSON') {
        layers = ref.current.cesiumElement.dataSources
        layers._dataSources.forEach(function (layer: any) {
          if (actualLayer.includes(layer.attribution)) {
            layers.remove(layer)
          }
        })
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

  function changeMapOpacity() {
    let layers: any
    actualLayer.forEach(async (actual) => {
      const splitActual = actual.split('_')
      const layerName = listLayers[splitActual[0]].layerNames[splitActual[1]]
      if (layerName.dataType === 'WMS' || layerName.dataType === 'COG') {
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
      }

      setLayerAction('')
    })
  }

  async function changeMapZoom() {
    let layers: any
    actualLayer.forEach(async (actual) => {
      const splitActual = actual.split('_')
      const layerName = listLayers[splitActual[0]].layerNames[splitActual[1]]
      if (layerName.dataType === 'WMS' || layerName.dataType === 'COG') {
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
            ref.current.cesiumElement.camera.flyTo({
              destination: cesiumStartCoordinates,
            })
            setLayerAction('')
          }
        })
      }
    })
  }

  useEffect(() => {
    if (layerAction) {
      const actionMap = {
        remove: removeLayerFromMap,
        add: addLayerIntoMap,
        zoom: changeMapZoom,
        opacity: changeMapOpacity,
      }
      if (actionMap[layerAction]) {
        setLoading(true)
        actionMap[layerAction]()
        setLayerAction('')
      }
    }
  }, [selectedLayers])

  const displayMap = useMemo(
    () => (
      <Viewer
        full
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
        <ImageryLayer imageryProvider={jnccMCZ} />
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

  return (
    <ResiumContainer>
      {displayMap}
      {position ? <DisplayPosition position={position} depth={depth} /> : null}
      {loading ? <Loading /> : null}
    </ResiumContainer>
  )
}

function mapPropsAreEqual(prevMap: any, nextMap: any) {
  return (
    prevMap.selectedLayers === nextMap.selectedLayers &&
    prevMap.threeD === nextMap.threeD &&
    prevMap.cogLayer === nextMap.cogLayer &&
    prevMap.actualLayer === nextMap.actualLayer
  )
}

export const ThreeDMap = React.memo(ThreeDMap1, mapPropsAreEqual)
