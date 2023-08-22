import {
  ScreenSpaceEventHandler,
  Viewer,
  ImageryLayer,
  CameraFlyTo,
  ScreenSpaceEvent,
  CesiumComponentRef,
} from 'resium'
import chroma from 'chroma-js'
import * as turf from '@turf/turf'

import {
  Ion,
  Rectangle,
  ScreenSpaceEventType,
  WebMapServiceImageryProvider,
  Viewer as CesiumViewer,
  createWorldTerrainAsync,
} from 'cesium'
import './styles.css'
import { ResiumContainer } from './styles'
import React, { useEffect, useRef, useMemo, useState } from 'react'
import { InfoBox } from '../InfoBox'
import * as Cesium from 'cesium'
import { GetGeoblazeValue3D } from '../MapHome/getGeoblazeValue'
import { Loading } from '../Loading'
import { GetPhotoMarker } from '../MapHome/addPhotoMarker'
import { GetTileLayer } from '../MapHome/addGeoraster'

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
  layerAction: String
  setLayerAction: any
  activePhoto: any
  setActivePhoto: any
  listLayers: any
  threeD: any
  setThreeD: any
}
function ThreeDMap1({
  selectedLayers,
  actualLayer,
  layerAction,
  setLayerAction,
  activePhoto,
  setActivePhoto,
  listLayers,
  threeD,
  setThreeD,
}: ThreeDMapProps) {
  const colorScale = chroma
    .scale(['#f00', '#0f0', '#00f', 'gray'])
    .mode('hsl')
    .colors(30)

  const JOSBaseUrl = process.env.VITE_JASMIN_OBJECT_STORE_URL
  const rout = window.location.pathname

  const [position, setPosition] = useState(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [depth, setDepth] = useState({})
  // const [viewer, setViewer] = useState<any>(null)
  const ref = useRef<CesiumComponentRef<CesiumViewer>>(null)

  const defaultOpacity = 0.7
  const defaultWMSBounds = [
    [50.020174, -8.58279],
    [50.578429, -7.70616],
  ]

  const url = `${JOSBaseUrl}haig-fras/asc/bathymetry.tif`

  const batLayer = useMemo(() => getGeorasterLayer(), [url])

  const startCoordinates = Rectangle.fromDegrees(
    defaultWMSBounds[0][1],
    defaultWMSBounds[0][0],
    defaultWMSBounds[1][1],
    defaultWMSBounds[1][0],
  )

  const jnccSpecial = new WebMapServiceImageryProvider({
    url: 'https://mpa-ows.jncc.gov.uk/mpa_mapper/wms?',
    parameters: {
      service: 'WMS',
      request: 'GetMap',
      version: '1.3.0',
      format: 'image/png',
      transparent: 'true',
      width: 256,
      height: 256,
    },
    layers: 'sac_mc_full',
  })
  const jnccMCZ = new WebMapServiceImageryProvider({
    url: 'https://mpa-ows.jncc.gov.uk/mpa_mapper/wms?',
    parameters: {
      service: 'WMS',
      request: 'GetMap',
      version: '1.3.0',
      format: 'image/png',
      transparent: 'true',
      width: 256,
      height: 256,
    },
    layers: 'mcz',
  })

  const terrainProvider = createWorldTerrainAsync()

  // function handleReady(tileset) {
  //   if (ref.current?.cesiumElement) {
  //     ref.current?.cesiumElement.zoomTo(tileset)
  //   }
  // }

  function getGeorasterLayer() {
    const getGeoblazeValue = new GetGeoblazeValue3D(url)
    getGeoblazeValue.parseGeoraster()
    return getGeoblazeValue
  }

  function reorderPhotos(photos: any) {
    const shuffled = photos.sort(() => 0.5 - Math.random())
    const n = shuffled.length > 700 ? 700 : shuffled.length
    const newList: any = []
    let count: number = 0
    let count2: number = 0
    if (activePhoto) {
      count++
      newList.push(activePhoto)
    }
    // const lat = [mapBounds._southWest.lat, mapBounds._northEast.lat]
    // const lng = [mapBounds._southWest.lng, mapBounds._northEast.lng]
    shuffled.every((el: any) => {
      if (count >= n) {
        return false // "break"
      }
      if (el.filename !== activePhoto.filename) {
        if (el.show) {
          count2++
          // if (
          //   el.latitude > lat[0] &&
          //   el.latitude < lat[1] &&
          //   el.longitude > lng[0] &&
          //   el.longitude < lng[1]
          // ) {
          newList.push(el.filename)
          count++
          // }
        }
      }
      return true
    })
    if (count2 === 0) {
      return []
    }
    return newList
  }

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

      await batLayer
        .getGeoblaze({
          lat: latitudeDegrees,
          lng: longitudeDegrees,
        })
        .then(async function () {
          const dep = batLayer.dep
          if (dep) {
            setDepth((depth: any) => {
              const copy = { ...depth }
              copy.Depth = dep.toFixed(2)
              return {
                ...copy,
              }
            })
          } else {
            setDepth((depth: any) => {
              const copy = { ...depth }
              copy.Depth = null
              return {
                ...copy,
              }
            })
          }
        })
    }
  }

  function getWMSLayer(layerName: any, actual: any) {
    layerName.params.width = 128
    layerName.params.height = 128
    const provider = new WebMapServiceImageryProvider({
      url: layerName.url,
      parameters: layerName.params,
      layers: layerName.params.layers,
    })
    const layer = new Cesium.ImageryLayer(provider, {})
    return layer
  }

  async function generateAddCOGLayer(layer, layers, layerName, actual, alpha) {
    const getCOGLayer = new GetTileLayer(layerName, actual, true)
    await getCOGLayer.getTile(rout).then(function () {
      layer = getCOGLayer.layer
      layer.alpha = alpha
      layers.add(layer)
      correctBaseWMSOrder(layers)
    })
  }
  if (ref.current?.cesiumElement) {
    // const layers = ref.current.cesiumElement.scene.imageryLayers
    // console.log(layers._layers)
    const layers = ref.current.cesiumElement.dataSources
    console.log(layers)
  }

  function createColor(colorScale: any, rgb: any, alpha: any = 1) {
    let color: any
    if (rgb) {
      if (!alpha) {
        alpha = 1
      }
      const colorRgb = chroma(colorScale[Math.floor(Math.random() * 30)]).rgb()
      color = new Cesium.Color(
        colorRgb[0] / 255,
        colorRgb[1] / 255,
        colorRgb[2] / 255,
        alpha,
      )
    } else {
      color = colorScale[Math.floor(Math.random() * 30)]
    }
    return color
  }

  async function correctBaseWMSOrder(layers: any) {
    layers?._layers.forEach(function (imageryLayers: any) {
      if (imageryLayers._imageryProvider._layers === 'mcz') {
        layers.remove(imageryLayers)
        const layer = new Cesium.ImageryLayer(jnccMCZ, {})
        layers.add(layer)
      } else if (imageryLayers._imageryProvider._layers === 'sac_mc_full') {
        layers.remove(imageryLayers)
        const layer = new Cesium.ImageryLayer(jnccSpecial, {})
        layers.add(layer)
      }
    })
  }

  async function generateSelectedLayer() {
    actualLayer.forEach(async (actual) => {
      const layerName = selectedLayers[actual]
      let layer: any
      let layers
      let dataSource
      if (layerName.data_type === 'WMS') {
        layers = ref.current.cesiumElement.scene.imageryLayers
        layer = getWMSLayer(layerName, actual)
        layer.attribution = actual
        layer.alpha = defaultOpacity
        layers.add(layer)
        correctBaseWMSOrder(layers)
      } else if (layerName.data_type === 'COG') {
        layers = ref.current.cesiumElement.scene.imageryLayers
        await generateAddCOGLayer(
          layer,
          layers,
          layerName,
          actual,
          defaultOpacity,
        )
      } else if (layerName.data_type === '3D') {
        const terrainUrl = await Cesium.CesiumTerrainProvider.fromIonAssetId(
          parseInt(layerName.url),
        )
        ref.current.cesiumElement.terrainProvider = terrainUrl
      } else if (layerName.data_type === 'Photo') {
        ref.current.cesiumElement.infoBox.frame.removeAttribute('sandbox')
        ref.current.cesiumElement.infoBox.frame.src = 'about:blank'
        dataSource = new Cesium.CustomDataSource(actual)
        layers = ref.current.cesiumElement.dataSources
        const markers: any = []
        const color = createColor(colorScale, true)

        const shuffledPhotos = reorderPhotos(layerName.photos)
        // const shuffledPhotos = layerName.photos

        await layerName.photos.map(async (photo: any) => {
          markers.push(
            turf.point([photo.longitude + 0.003, photo.latitude + 0.003]),
          )
          markers.push(
            turf.point([photo.longitude - 0.003, photo.latitude - 0.003]),
          )
          if (shuffledPhotos.includes(photo.filename)) {
            const getPhotoMarker = new GetPhotoMarker(photo, actual, color)

            await getPhotoMarker.getMarker3D().then(async function () {
              dataSource.entities.add(getPhotoMarker.layer)
            })
          }
        })
        dataSource.attribution = actual
        layers.add(dataSource)
        const turfConvex = turf.convex(turf.featureCollection(markers))
        // const turfBbox = turf.bbox(turfConvex)
        // bounds = [
        //   [turfBbox[1] - 0.05, turfBbox[0] - 0.35],
        //   [turfBbox[3] + 0.05, turfBbox[2] + 0.15],
        // ]
        if (layerName.plotLimits) {
          const color1 = createColor(colorScale, true, 0.3)
          const myStyle = {
            stroke: color1,
            fill: color1,
            strokeWidth: 3,
          }
          let turfLayer: any
          if (turfConvex) {
            turfLayer = await Cesium.GeoJsonDataSource.load(turfConvex, myStyle)
            turfLayer.attribution = actual
            layers.add(turfLayer)
          }
        }
      } else if (layerName.data_type === 'Photo-Limits') {
        const markers: any = []
        layerName.photos.map(async (photo: any) => {
          markers.push(
            turf.point([photo.longitude + 0.003, photo.latitude + 0.003]),
          )
          markers.push(
            turf.point([photo.longitude - 0.003, photo.latitude - 0.003]),
          )
        })
        const color = createColor(colorScale, false)
        const myStyle = {
          stroke: color,
          fill: color,
          strokeWidth: 3,
        }
        const turfConvex = turf.convex(turf.featureCollection(markers))

        if (turfConvex) {
          let turfLayer: any
          // eslint-disable-next-line prefer-const
          turfLayer = Cesium.GeoJsonDataSource.load(turfConvex, myStyle)
          turfLayer.attribution = actual
          ref.current.cesiumElement.dataSources.add(turfLayer)
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
      if (layerName.data_type === 'WMS' || layerName.data_type === 'COG') {
        // eslint-disable-next-line prefer-const
        layers = ref.current.cesiumElement.scene.imageryLayers
        layers?._layers.forEach(function (layer: any) {
          if ([actual].includes(layer.attribution)) {
            layers.remove(layer)
            setLayerAction('')
          }
        })
      } else if (layerName.data_type === '3D') {
        layers = ref.current.cesiumElement
        layers.terrainProvider = await terrainProvider
      } else if (layerName.data_type === 'Photo') {
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

  async function handleTerrainLayer() {
    if (threeD) {
      const terrainUrl = await Cesium.CesiumTerrainProvider.fromIonAssetId(
        parseInt(threeD.dataInfo.assetId),
      )
      ref.current.cesiumElement.terrainProvider = terrainUrl
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
      if (layerName.data_type === 'WMS' || layerName.data_type === 'COG') {
        layers = ref.current.cesiumElement.scene.imageryLayers
        layers?._layers.forEach(function (layer: any) {
          if ([actual].includes(layer.attribution)) {
            layers.remove(layer)
            if (layerName.data_type === 'WMS') {
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
      }
      setLayerAction('')
    })
  }

  async function changeMapZoom() {
    let layers: any
    actualLayer.forEach(async (actual) => {
      const splitActual = actual.split('_')
      const layerName = listLayers[splitActual[0]].layerNames[splitActual[1]]
      if (layerName.data_type === 'WMS' || layerName.data_type === 'COG') {
        layers = ref.current.cesiumElement.scene.imageryLayers
        layers?._layers.forEach(function (layer: any) {
          if ([actual].includes(layer.attribution)) {
            layers.remove(layer)
            if (layerName.data_type === 'WMS') {
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
              destination: startCoordinates,
            })
            setLayerAction('')
          }
        })
      }
    })
  }

  useEffect(() => {
    if (layerAction === 'remove') {
      setLoading(true)
      removeLayerFromMap()
      setLayerAction('')
    } else if (layerAction === 'add') {
      setLoading(true)
      addLayerIntoMap()
      setLayerAction('')
    } else if (layerAction === 'zoom') {
      changeMapZoom()
      setLayerAction('')
    } else if (layerAction === 'opacity') {
      changeMapOpacity()
      setLayerAction('')
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
        {/* <Cesium3DTileset
          url={CesiumTerrainProvider.fromIonAssetId(2182075)}
          onReady={handleReady}
        /> */}
        <ImageryLayer imageryProvider={jnccMCZ} />
        <ImageryLayer imageryProvider={jnccSpecial} />
        <CameraFlyTo destination={startCoordinates} duration={3} />
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
    // prevMap.selectedLayers === nextMap.selectedLayers &&
    prevMap.selectedLayers === nextMap.selectedLayers &&
    prevMap.threeD === nextMap.threeD &&
    // prevMap.viewer === nextMap.viewer &&
    prevMap.actualLayer === nextMap.actualLayer
    // prevMap.position === nextMap.position
  )
}

export const ThreeDMap = React.memo(ThreeDMap1, mapPropsAreEqual)

// <Cesium3DTileset
// url={Cesium.IonImageryProvider.fromAssetId(2158702)}
// onReady={handleReady}
// />

// function handleReady(tileset) {
//   if (ref.current?.cesiumElement) {
//     ref.current?.cesiumElement.zoomTo(tileset)
//   }
// }
// ref={(e) => {
//   // setViewer(e && e.cesiumElement)
//   // console.log(e)
//   viewer = e && e.cesiumElement
// }}

// <Cesium3DTileset url={Cesium.IonImageryProvider.fromAssetId(2158702)} /> //
