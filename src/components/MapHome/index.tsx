import {
  MapContainer,
  TileLayer,
  WMSTileLayer,
  GeoJSON,
  LayersControl,
  Pane,
  ScaleControl,
} from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import React, { useEffect, useMemo, useState } from 'react'
import * as L from 'leaflet'
import { coastline } from '../../coastline'
import { InfoBox } from '../InfoBox'
import { GetCOGLayer, GetTifLayer, GetTileLayer } from './addGeoraster'
import { Loading } from '../Loading'
import { callBetterWMS } from './addBetterWMS'
import { GetGeoblazeValue } from './getGeoblazeValue'
import { GetMBTiles } from './addMBTiles'
import { GetPhotoMarker } from './addPhotoMarker'
import * as turf from '@turf/turf'
import chroma from 'chroma-js'
import LeafletRuler from '../LeafletRuler'

const colorScale = chroma
  .scale(['#f00', '#0f0', '#00f', 'gray'])
  .mode('hsl')
  .colors(30)

interface DisplayPositionProps {
  map: any
  depth: any
}

interface keyable {
  [key: string]: any
}

function DisplayPosition({ map, depth }: DisplayPositionProps) {
  const [position, setPosition] = useState(null)

  useEffect(() => {
    map.on('mousemove', (e: any) => {
      setPosition(e.latlng)
    })
  }, [map])
  return <InfoBox position={position} depth={depth} />
}

interface MapProps {
  selectedLayers: keyable
  actualLayer: string[]
  layerAction: String
  setLayerAction: any
  selectedArea: boolean
  latLonLimits: any
  showPhotos: any
  setShowPhotos: any
  activePhoto: any
  setActivePhoto: any
  mapBounds: any
  setMapBounds: any
  selectedSidebarOption: any
  getPolyline: any
  setGetPolyline: any
  setGraphData: any
}

function MapHome1({
  selectedLayers,
  actualLayer,
  layerAction,
  setLayerAction,
  selectedArea,
  latLonLimits,
  showPhotos,
  setShowPhotos,
  activePhoto,
  setActivePhoto,
  mapBounds,
  setMapBounds,
  selectedSidebarOption,
  getPolyline,
  setGetPolyline,
  setGraphData,
}: MapProps) {
  // const MAPBOX_API_KEY = import.meta.env.VITE_MAPBOX_API_KEY
  // const MAPBOX_USERID = 'mapbox/satellite-v9'
  // const MAPBOX_ATTRIBUTION =
  //   "Map data &copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>"
  const [map, setMap] = useState<any>(null)

  const [depth, setDepth] = useState({})

  const defaultView = [50.3, -8.1421]

  const defaultWMSBounds = [
    [50.020174, -8.58279],
    [50.578429, -7.70616],
  ]

  // if (map) {
  //   // console.log(Object.keys(map._layers).length)
  //   // console.log(map._layers)
  // }

  const [loading, setLoading] = useState<boolean>(false)

  const activeIcon = L.icon({
    iconUrl: '/marker-icon_red.png',
    // shadowUrl: '/marker-shadow.png',
    iconSize: [25, 25],
  })
  // const inactiveIcon = L.icon({
  //   iconUrl: '/marker-icon.png',
  //   // shadowUrl: '/marker-shadow.png',
  //   iconSize: [20, 20],
  // })
  const smallIcon = L.icon({
    iconUrl: '/marker-icon.png',
    // shadowUrl: '/marker-shadow.png',
    iconSize: [0.1, 0.1],
  })

  function bringLayerToFront(layer: any) {
    layer.bringToFront()
    const frontLayers = [
      'Coastline',
      'Marine Conservation Zones',
      'Special Areas of Conservation',
    ]
    map.eachLayer(function (mapLayer: any) {
      if (frontLayers.includes(mapLayer.options.attribution)) {
        mapLayer.bringToFront()
      }
    })
  }

  useEffect(() => {
    if (map) {
      if (selectedSidebarOption !== 'Data Exploration') {
        map.setView(new L.LatLng(defaultView[0], defaultView[1]), 10.5)
        map.options.minZoom = 10
      } else {
        // map.setView(new L.LatLng(50.3, -7.712108868853798), 10.5)
        map.options.minZoom = 3
      }
    }
  }, [selectedSidebarOption])

  useEffect(() => {
    if (map) {
      map.on('moveend', function () {
        setMapBounds(map.getBounds())
      })
    }
  }, [map])

  async function getWMSLayer(layerName: any, actual: any) {
    layerName.params.attribution = actual
    const layer = callBetterWMS(layerName.url, layerName.params)
    return layer
  }

  async function changeIcons(photo: any) {
    map.eachLayer(function (mapLayer: any) {
      if (mapLayer.options.dataType === 'marker') {
        if (mapLayer.options.filename === photo.filename) {
          mapLayer.setIcon(activeIcon)
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
  async function generateSelectedLayer() {
    actualLayer.forEach(async (actual) => {
      const layerName = selectedLayers[actual]
      let layer: any
      let bounds
      if (layerName.data_type === 'WMS') {
        layer = await getWMSLayer(layerName, actual)
        bounds = defaultWMSBounds
      } else if (layerName.data_type === 'COG') {
        if (window.location.pathname === '/notileserver') {
          const getCOGLayer = new GetCOGLayer(layerName, actual)
          await getCOGLayer.parseGeo().then(function () {
            layer = getCOGLayer.layer
            // const nE = layer.getBounds().getNorthEast()
            // const sW = layer.getBounds().getSouthWest()
            // bounds = [
            //   [nE.lat, nE.lng],
            //   [sW.lat, sW.lng],
            // ]
            bounds = defaultWMSBounds
          })
        } else {
          const getCOGLayer = new GetTileLayer(layerName, actual, true)
          await getCOGLayer.getTile().then(function () {
            layer = getCOGLayer.layer
            // bounds = [
            //   [getCOGLayer.bounds[3], getCOGLayer.bounds[0]],
            //   [getCOGLayer.bounds[1], getCOGLayer.bounds[2]],
            // ]
            bounds = defaultWMSBounds
          })
        }
      } else if (layerName.data_type === 'Photo') {
        // bounds = defaultWMSBounds
        const markers: any = [] // L.layerGroup().addTo(map)
        const color = colorScale[Math.floor(Math.random() * 30)]
        const color1 = colorScale[Math.floor(Math.random() * 30)]
        await layerName.photos.map(async (photo: any) => {
          markers.push(
            turf.point([photo.longitude + 0.003, photo.latitude + 0.003]),
          )
          markers.push(
            turf.point([photo.longitude - 0.003, photo.latitude - 0.003]),
          )
          const getPhotoMarker = new GetPhotoMarker(photo, actual, color)
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
                // getPhotoMarker.layer.setIcon(inactiveIcon)
                getPhotoMarker.layer.setZIndexOffset(9999)
              } else {
                getPhotoMarker.layer.setOpacity(0)
                getPhotoMarker.layer.setIcon(smallIcon)
                getPhotoMarker.layer.setZIndexOffset(-9999)
              }
            }
          })
        })
        const turfConvex = turf.convex(turf.featureCollection(markers))
        const turfBbox = turf.bbox(turfConvex)
        bounds = [
          [turfBbox[1] - 0.05, turfBbox[0] - 0.35],
          [turfBbox[3] + 0.05, turfBbox[2] + 0.15],
        ]
        if (layerName.plotLimits) {
          const myStyle = {
            color1,
            fillColor: color1,
            weight: 3,
            opacity: 0.6,
          }
          if (turfConvex) {
            const turflayer = L.geoJson(turfConvex, {
              style: myStyle,
            })
            turflayer.options.attribution = actual
            turflayer.addTo(map)
          }
        }
      } else if (layerName.data_type === 'Photo-Limits') {
        const markers: any = [] // L.layerGroup().addTo(map)
        layerName.photos.map(async (photo: any) => {
          markers.push(
            turf.point([photo.longitude + 0.003, photo.latitude + 0.003]),
          )
          markers.push(
            turf.point([photo.longitude - 0.003, photo.latitude - 0.003]),
          )
        })
        const color = colorScale[Math.floor(Math.random() * 30)]
        const myStyle = {
          color,
          fillColor: color,
          weight: 3,
          opacity: 0.6,
        }

        const turfConvex = turf.convex(turf.featureCollection(markers))

        if (turfConvex) {
          layer = L.geoJson(turfConvex, {
            style: myStyle,
          })
        }
        // console.log(layer)
      } else if (layerName.data_type === 'MBTiles') {
        // bounds = defaultWMSBounds
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
      }
      if (layerName.data_type !== 'Photo') {
        layer.options.attribution = actual
        map.addLayer(layer, true)
        // console.log(map._layers)

        if (layerName.data_type === 'COG' && layerName.get_value) {
          map.on('mousemove', function (evt: { originalEvent: any }) {
            if (selectedLayers[actual]) {
              const latlng = map.mouseEventToLatLng(evt.originalEvent)
              const tileSize = { x: 256, y: 256 }
              const pixelPoint = map
                .project(latlng, Math.floor(map.getZoom()))
                .floor()
              const coords = pixelPoint.unscaleBy(tileSize).floor()
              coords.z = Math.floor(map.getZoom()) // { x: 212, y: 387, z: 10 }

              const getGeoblazeValue = new GetGeoblazeValue(
                layer,
                latlng,
                coords,
              )
              getGeoblazeValue.getGeoblaze().then(function () {
                const dep = getGeoblazeValue.dep
                const depthName = actual.split('_')[1]
                if (dep) {
                  if (dep > 0.0) {
                    setDepth((depth: any) => {
                      const copy = { ...depth }
                      copy[depthName] = dep.toFixed(2)
                      return {
                        ...copy,
                      }
                    })
                  }
                } else {
                  setDepth((depth: any) => {
                    const copy = { ...depth }
                    delete copy[depthName]
                    return {
                      ...copy,
                    }
                  })
                }
              })
            }
            // x.split('_')[1]
          })
        }

        layer && bringLayerToFront(layer)
      }
      if (layerName.data_type !== 'Photo') {
        bounds = defaultWMSBounds
      }
      map.fitBounds(bounds)
    })
    setLoading(false)
  }

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
      // setShowPhotos(newShowPhotos)
    }
  }, [activePhoto])

  function removeLayerFromMap(): void {
    map.eachLayer(function (layer: any) {
      if (actualLayer.includes(layer.options.attribution)) {
        map.removeLayer(layer)
        if (activePhoto.layerName === layer.options.attribution) {
          setActivePhoto('')
        }
        // map.setView(new L.LatLng(50.39415159013279, -7.712108868853798), 5);
        setLayerAction('')
      }
    })
    setLoading(false)
  }
  useEffect(() => {
    if (map) {
      const actualLayer = 'bathymetry'
      let layerExist = false
      map.eachLayer(function (layer: any) {
        if (actualLayer.includes(layer.options.attribution)) {
          layerExist = true
          return false
        }
      })
      if (!layerExist) {
        setLoading(true)
        const url =
          'https://pilot-imfe-o.s3-ext.jc.rl.ac.uk/haig-fras/asc/bathymetry.tif'

        const fetchData = async () => {
          const getTifLayer = new GetTifLayer(url, [actualLayer])
          await getTifLayer.parseGeo().then(function () {
            map.addLayer(getTifLayer.layer)
            map.on('mousemove', function (evt: { originalEvent: any }) {
              const latlng = map.mouseEventToLatLng(evt.originalEvent)
              const getGeoblazeValue = new GetGeoblazeValue(
                getTifLayer.georaster,
                latlng,
              )
              getGeoblazeValue.getGeoblaze().then(function () {
                const dep = getGeoblazeValue.dep
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
            })
            setLoading(false)
          })
        }
        fetchData()
      }
    }
  }, [map])

  async function addLayerIntoMap() {
    await generateSelectedLayer()
    setLayerAction('')
  }

  useEffect(() => {
    if (map) {
      map.eachLayer(function (layer: any) {
        if (layer.options.attribution === 'polygon') {
          map.removeLayer(layer)
        }
      })
      const polygon = L.polygon(latLonLimits, {
        attribution: 'polygon',
        color: '#ff96bc',
        weight: 2,
        opacity: 0.7,
      })
      polygon.addTo(map)
    }
  }, [latLonLimits])

  useEffect(() => {
    if (selectedArea) {
      const polygon = L.polygon(latLonLimits, {
        attribution: 'polygon',
        color: '#ff96bc',
        weight: 2,
        opacity: 0.7,
      })
      polygon.addTo(map)
    } else {
      if (map) {
        map.eachLayer(function (layer: any) {
          if (layer.options.attribution === 'polygon') {
            map.removeLayer(layer)
          }
        })
      }
    }
  }, [selectedArea])

  async function changeMapZoom() {
    map.eachLayer(function (layer: any) {
      if (actualLayer.includes(layer.options.attribution)) {
        if (selectedLayers[layer.options.attribution].data_type === 'COG') {
          // const newBounds = [
          //   [layer.options.limits[3], layer.options.limits[0]],
          //   [layer.options.limits[1], layer.options.limits[2]],
          // ]
          map.fitBounds(defaultWMSBounds)
          // map.fitBounds(newBounds)
        } else {
          map.fitBounds(defaultWMSBounds)
        }
        if (selectedLayers[layer.options.attribution].data_type !== 'Photo') {
          bringLayerToFront(layer)
        }
        setLayerAction('')
        return false
      }
    })
  }

  function changeMapOpacity() {
    map.eachLayer(function (layer: any) {
      if (actualLayer.includes(layer.options.attribution)) {
        layer.setOpacity(selectedLayers[layer.options.attribution].opacity)
      }
    })
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
    const markersAll: any = []
    actualLayer.forEach(async (actual) => {
      const color = colorScale[Math.floor(Math.random() * 30)]
      const markers: any = []
      await selectedLayers[actual].photos.map(async (photo: any) => {
        markersAll.push(turf.point([photo.longitude, photo.latitude]))
        markers.push(
          turf.point([photo.longitude + 0.003, photo.latitude + 0.003]),
        )
        markers.push(
          turf.point([photo.longitude - 0.003, photo.latitude - 0.003]),
        )
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
        const color1 = colorScale[Math.floor(Math.random() * 30)]
        const myStyle = {
          color1,
          fillColor: color1,
          weight: 3,
          opacity: 0.6,
        }
        if (turfConvex) {
          const turflayer = L.geoJson(turfConvex, {
            style: myStyle,
          })
          turflayer.options.attribution = actual
          turflayer.addTo(map)
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
    } else if (layerAction === 'marker-changes') {
      changeMapMarkerShow()
      setLayerAction('')
    }
  }, [selectedLayers])

  function handleSetLatlng(e: any) {
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
      })
        .addTo(map)
        .bindPopup('Point <br/>' + e.latlng)
      lineLayer.push(markerLayer.getLatLng())
    } else if (counter === 1) {
      const markerLayer = L.marker(e.latlng, {
        attribution: 'draw-polyline2',
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
        window.alert('Select two points in the map to make a graph')
        map.dragging.disable()
        map.touchZoom.disable()
        map.doubleClickZoom.disable()
        map.scrollWheelZoom.disable()
        map.boxZoom.disable()
        map.keyboard.disable()
        map.on('click', handleSetLatlng)
      } else {
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

  const displayMap = useMemo(
    () => (
      <MapContainer
        style={{ height: '100vh', width: '100vw' }}
        center={new L.LatLng(defaultView[0], defaultView[1])}
        zoom={10.5}
        zoomSnap={0.1}
        maxZoom={30}
        minZoom={10}
        scrollWheelZoom={true}
        zoomControl={false}
        ref={setMap}
      >
        <LayersControl>
          <LayersControl.BaseLayer checked name="OSM">
            <Pane name="OSM" style={{ zIndex: -1 }}>
              <TileLayer
                attribution={'© OpenStreetMap'}
                maxZoom={30}
                url={'https://tile.openstreetmap.org/{z}/{x}/{y}.png'}
              />
            </Pane>
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="NASA Blue Marble">
            <Pane name="NASA" style={{ zIndex: -1 }}>
              <TileLayer
                url="https://gibs-{s}.earthdata.nasa.gov/wmts/epsg3857/best/BlueMarble_ShadedRelief_Bathymetry/default//EPSG3857_500m/{z}/{y}/{x}.jpeg"
                attribution="&copy; NASA Blue Marble, image service by OpenGeo"
              />
            </Pane>
          </LayersControl.BaseLayer>
          <LayersControl.Overlay checked name="Special Areas of Conservation">
            <WMSTileLayer
              attribution="Special Areas of Conservation"
              url="https://mpa-ows.jncc.gov.uk/mpa_mapper/wms?"
              params={{
                service: 'WMS',
                request: 'GetMap',
                version: '1.3.0',
                layers: 'sac_mc_full',
                format: 'image/png',
                transparent: true,
                width: 256,
                height: 256,
              }}
              opacity={1}
              zIndex={9999}
            />
          </LayersControl.Overlay>
          <LayersControl.Overlay checked name="Marine Conservation Zones">
            <WMSTileLayer
              attribution="Marine Conservation Zones"
              url="https://mpa-ows.jncc.gov.uk/mpa_mapper/wms?"
              params={{
                service: 'WMS',
                request: 'GetMap',
                version: '1.3.0',
                layers: 'mcz',
                format: 'image/png',
                transparent: true,
                width: 256,
                height: 256,
              }}
              opacity={1}
              zIndex={9998}
            />
          </LayersControl.Overlay>
          <LayersControl.Overlay name="Coastline">
            <GeoJSON
              attribution="Coastlines"
              data={coastline}
              style={{
                color: '#5a5c5a',
                weight: 2,
                opacity: 0.4,
                fillOpacity: 0,
              }}
            />
          </LayersControl.Overlay>
        </LayersControl>
        <ScaleControl position="topright" />
        <LeafletRuler />
      </MapContainer>
    ),
    [map],
  )

  return (
    <div>
      {displayMap}
      {map ? <DisplayPosition map={map} depth={depth} /> : null}
      {/* {map ? <DisplayBathymetry map={map} /> : null} */}
      {loading ? <Loading /> : null}
    </div>
  )
}

function mapPropsAreEqual(prevMap: any, nextMap: any) {
  return (
    prevMap.selectedLayers === nextMap.selectedLayers &&
    prevMap.actualLayer === nextMap.actualLayer &&
    prevMap.selectedArea === nextMap.selectedArea &&
    prevMap.latLonLimits === nextMap.latLonLimits &&
    prevMap.showPhotos === nextMap.showPhotos &&
    prevMap.activePhoto === nextMap.activePhoto &&
    prevMap.getPolyline === nextMap.getPolyline
  )
}

export const MapHome = React.memo(MapHome1, mapPropsAreEqual)

// async function getCOGLayer (layerName: any) {
//   parseGeoraster(layerName.url).then(async (georaster: any) => {

//     const layer = new GeoRasterLayer({
//       georaster: georaster,
//       resolution: 128,
//       opacity: 1,
//       keepBuffer: 25,
//       debugLevel: 0,
//       // mask: continent,
//       // mask_strategy: "inside"
//       // pixelValuesToColorFn: values => {
//       //   console.log(values)
//       //   return values[0] ? '#00000000' : values[0]
//       // }
//     });
//     map.addLayer(layer)

//     let nE = layer.getBounds().getNorthEast()
//     let sW = layer.getBounds().getSouthWest()

//     const newBounds = [[nE.lat, nE.lng],[sW.lat, sW.lng]]
//     console.log(newBounds)
//     map.fitBounds(newBounds)
//   });
// };

// async function showFeatureInfo () {
//   // layerName.params['atribution'] = actualLayer
//   // const layer = L.tileLayer.wms( layerName.url, layerName.params)
//   const featureOptions = {
//     service: 'WMS',
//     request: 'GetFeatureInfo',
//     version: '1.3.0',
//     QUERY_LAYERS: 'eusm2021_eunis2019_group',
//     layers: 'eusm2021_eunis2019_group',
//     info_format: 'text/html',
//     transparent: true,
//     feature_count: 25,
//     I: 175,
//     J: 39,
//     width: '256',
//     height: '256',
//     viewParams: 'null;undefined',
//   }

//   await axios.get(
//     'https://emodnet.ec.europa.eu/geoviewer/proxy//https://ows.emodnet-seabedhabitats.eu/geoserver/emodnet_view/wms?', {
//       params: featureOptions,
//     }
//   ).then(r => console.log(r.data))
// }

// async function getWTMSLayer (layerName: Object) {
//   // layerName.params['atribution'] = actualLayer
//   // const layer = L.tileLayer.wms( layerName.url, layerName.params)
//   const WMSOptions = {
//     service: 'WMS',
//     attribution: actualLayer[0],
//     request: 'GetMap',
//     version: '1.3.0',
//     layers: 'eusm2021_eunis2019_group',
//     format: 'image/png',
//     transparent: true,
//     info_format: 'text/html',
//     tiled: 'true',
//     width: '150',
//     height: '125',
//     bounds: L.latLngBounds([[50, -11],[53, -8]])
//   }
//   const layer = L.tileLayer.wms( 'https://ows.emodnet-seabedhabitats.eu/geoserver/emodnet_view/wms?', WMSOptions)

//   map ? map.addLayer(layer) : null
//   // let nE = layer.getBounds().getNorthEast()
//   // let sW = layer.getBounds().getSouthWest()

//   // const newBounds = [[nE.lat, nE.lng],[sW.lat, sW.lng]]
//   // console.log(newBounds)
//   map.fitBounds([[46, -10],[52, 2]])
// }

// async function getWMSLayer2() {
//   const params = {
//     service: 'WMS',
//     attribution: actualLayer[0],
//     version: '1.3.0',
//     format: 'image/png',
//     transparent: true,
//     info_format: 'text/html',
//     width: '256',
//     height: '256',
//     viewParams: 'null;undefined',
//   }
//   const url = 'https://emodnet.ec.europa.eu/geoviewer/proxy//https://ows.emodnet-seabedhabitats.eu/geoserver/emodnet_view/wms?'

//   let layer = 'eusm2021_eunis2019_group'

//   const getBathymetry = new GetBathymetryLayer(url, params, layer)
//   await getBathymetry.getLayer().then( function () {
//     map.addLayer(getBathymetry.layer)
//   })
// }

// {/* <LayersControl.Overlay name="Background Bathymetry">
// { customWMSLayer }
// </LayersControl.Overlay> */}

// async function customWMSLayer2() {
//   const getBathymetry = new GetBathymetryLayer()
//   await getBathymetry.getLayer().then( function () {
//     map.addLayer(getBathymetry.layer)
//   })
// }

// {/* <TileLayer
//   attribution={'WMTS'}
//   // url={'https://tile.openstreetmap.org/{z}/{x}/{y}.png'}
//   url={'https://ows.emodnet-seabedhabitats.eu/geoserver/emodnet_view/gwc/service/wmts/rest/eusm2021_bio_full/emodnet_view:eusm2019_bio_full/EPSG:4326/EPSG:4326:{z}/{x}/{y}?format=image/png8'}
//   tms={true}
// /> */}

// async function generateCanvasLayer() {
//   setLoading(true)
//   let url = "https://ihcantabria.github.io/Leaflet.CanvasLayer.Field/data/Bay_Speed.asc"

//   let text = await d3.text(url).then(async function (text) {

//     // const getCanvasLayer = new GetCanvasLayer(text)
//     // await getCanvasLayer.getLayer().then( function () {
//     //   map.addLayer(getCanvasLayer.layer)
//     //   setLoading(false)
//     // });

//     const s = ScalarField.fromASCIIGrid(text)
//     console.log(s)
//     const layer = LayerScalarField(s)

//     map.addLayer(layer)
//     setLoading(false)

//   });

//   // const getCanvasLayer = new GetCanvasLayer(url)
//   // await getCanvasLayer.getLayer().then( function () {

//   //   map.addLayer(getCanvasLayer.layer)
//   //   setLoading(false)
//   // });
// }

// async function getGeojson() {
//   await axios.get('https://pilot-imfe-o.s3-ext.jc.rl.ac.uk/haig-fras/asc/bathymetry.geojson').then(r => {
//     return (
//       r.data.json
//     )
//   })
// }

// , "crs": {"type": "name", "properties": {"name": "urn:ogc:def:crs:EPSG::4326"}}

// useEffect(() => {
//   if (map){
//     customWMSLayer()
//   }
// }, [selectedLayers])

// useEffect(() => {
//   if (map){
//     generateCanvasLayer()
//   }
// }, [selectedLayers])
// function pointToLayer() {
//   return null
//   // return L.marker(latlng, { icon: {}}); // Change the icon to a custom icon
// }

// function onEachFeaturePoint(feature, layer) {
//   layer.on('mousemove', function (event) {
//     console.log(event);
//   });
// }

// import { DrawPolygon } from './addLeafletDraw';
// import 'leaflet-path-drag';
// import FreeDraw from 'leaflet-freedraw';
// import 'leaflet-draw'
// import 'leaflet-path-transform';

// import axios from 'axios';
// import { GetCanvasLayer } from './addCanvasLayer';
// import { GetBathymetryLayer } from './addBathymetry';
// import { bathymetry } from '../../bathymetry';

// newShowPhotos = changePhotosOrder(idx, 0, newShowPhotos)
// function changePhotosOrder(fromIndex: number, toIndex: number, arr: any[]) {
//   var element = arr[fromIndex];
//   arr.splice(fromIndex, 1);
//   arr.splice(toIndex, 0, element);
//   return arr
// }

// useEffect(() => {
//   if (latLonLimits){
//     polygon.addTo(map);
//   } else {
//     if (map){
//       map.eachLayer(function(layer: any){
//         if (layer.options.attribution === 'polygon'){
//           map.removeLayer(layer)
//         }
//       });
//     }
//   }
// }, [selectedArea])

// const freeDraw = new FreeDraw({
//   mode: FreeDraw.ALL,
//   leaveModeAfterCreate:true,
//   maximumPolygons: 1,
//   smoothFactor: 0.3,
//   simplifyFactor: 2,
//   strokeWidth: 3
// });

// useEffect(() => {
//   if (selectedArea){
//     map.addLayer(freeDraw);

//     freeDraw.on("markers",function(event){
//       if(event.eventType=='create' && event.latLngs.length > 0){

//         //capture the current polygon bounds (store in 1st position)
//         var latLngs = event.latLngs[0];
//         freeDraw.clear(); //clear freedraw markers
//         //create polygon from lat lng bounds retrieved
//         var polygon = L.polygon(
//             latLngs.map(function(latLng){
//                 return [latLng.lat,latLng.lng];
//             }), {
//                 color: 'red',
//             }).addTo(map);
//       }
//     })
//   }
// }, [selectedArea])
