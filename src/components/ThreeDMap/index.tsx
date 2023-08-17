import {
  ScreenSpaceEventHandler,
  Viewer,
  ImageryLayer,
  CameraFlyTo,
  ScreenSpaceEvent,
  CesiumComponentRef,
} from 'resium'

import {
  Ion,
  Rectangle,
  ScreenSpaceEventType,
  WebMapServiceImageryProvider,
  Viewer as CesiumViewer,
} from 'cesium'
import './styles.css'
import { ResiumContainer } from './styles'
import React, { useEffect, useRef, useMemo, useState } from 'react'
import { InfoBox } from '../InfoBox'
import * as Cesium from 'cesium'
import { GetGeoblazeValue3D } from '../MapHome/getGeoblazeValue'
import { Loading } from '../Loading'

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
}
function ThreeDMap1({
  selectedLayers,
  actualLayer,
  layerAction,
  setLayerAction,
}: ThreeDMapProps) {
  // const handleReady = (tileset) => {
  //   if (viewer) {
  //     viewer.zoomTo(tileset)
  //   }
  // }
  const JOSBaseUrl = process.env.VITE_JASMIN_OBJECT_STORE_URL

  const [position, setPosition] = useState(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [depth, setDepth] = useState({})
  // const [viewer, setViewer] = useState<any>(null)
  const ref = useRef<CesiumComponentRef<CesiumViewer>>(null)

  useEffect(() => {
    if (ref.current?.cesiumElement) {
      console.log(ref)
      // ref.current.cesiumElement is Cesium's Viewer
      // DO SOMETHING
    }
  }, [])
  function getGeorasterLayer() {
    const getGeoblazeValue = new GetGeoblazeValue3D(url)
    getGeoblazeValue.parseGeoraster()
    return getGeoblazeValue
  }
  const url = `${JOSBaseUrl}haig-fras/asc/bathymetry.tif`

  const batLayer = useMemo(() => getGeorasterLayer(), [url])

  const defaultWMSBounds = [
    [50.020174, -8.58279],
    [50.578429, -7.70616],
  ]
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
  async function handleHoverUpdateInfoBox(e: any) {
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

  function getWMSLayer(layerName: any, actual: any) {
    const provider = new WebMapServiceImageryProvider({
      url: layerName.url,
      parameters: layerName.params,
      layers: layerName.params.layers,
    })
    const layer = new Cesium.ImageryLayer(provider, {})
    return layer
  }
  // if (ref.current?.cesiumElement) {
  //   const layers = ref.current.cesiumElement.scene.imageryLayers
  //   console.log(layers._layers)
  // }
  async function generateSelectedLayer() {
    actualLayer.forEach(async (actual) => {
      const layerName = selectedLayers[actual]
      let layer: any
      // let bounds: any
      if (layerName.data_type === 'WMS') {
        const layers = ref.current.cesiumElement.scene.imageryLayers
        layer = getWMSLayer(layerName, actual)
        layer.attribution = actual
        layers.add(layer)
        // layer.setOpacity(0.7)
        // bounds = defaultWMSBounds
      }
      // layer.options.attribution = actual
      // map.addLayer(layer, true)
      // layer && bringLayerToFront(layer)
      // bounds = defaultWMSBounds
      // map.fitBounds(bounds)
    })
    setLoading(false)
  }

  function removeLayerFromMap(): void {
    let layers: any
    // eslint-disable-next-line prefer-const
    layers = ref.current.cesiumElement.scene.imageryLayers
    layers?._layers.forEach(function (layer: any) {
      if (actualLayer.includes(layer.attribution)) {
        layers.remove(layer)
        setLayerAction('')
      }
    })
    setLoading(false)
  }
  async function addLayerIntoMap() {
    await generateSelectedLayer()
    setLayerAction('')
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
    }
  }, [selectedLayers])

  const displayMap = useMemo(
    () => (
      <Viewer
        full
        animation={false}
        timeline={false}
        ref={ref}
        // ref={(e) => {
        //   // setViewer(e && e.cesiumElement)
        //   // console.log(e)
        //   viewer = e && e.cesiumElement
        // }}
      >
        {/* <Cesium3DTileset url={Cesium.IonImageryProvider.fromAssetId(2158702)} /> */}
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

  //   <Cesium3DTileset
  //   url={Cesium.IonImageryProvider.fromAssetId(2158702)}
  //   // onReady={handleReady}
  // />

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
    // prevMap.viewer === nextMap.viewer &&
    prevMap.actualLayer === nextMap.actualLayer
    // prevMap.position === nextMap.position
  )
}

export const ThreeDMap = React.memo(ThreeDMap1, mapPropsAreEqual)
