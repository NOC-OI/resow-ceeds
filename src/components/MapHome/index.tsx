import { MapContainer, useMap, Marker, Popup, TileLayer, useMapEvent, WMSTileLayer, GeoJSON, LayersControl, Pane } from 'react-leaflet'
import 'leaflet/dist/leaflet.css';
import { useCallback, useEffect, useMemo, useState } from 'react';
import * as L from 'leaflet';
// import { continent } from '../../countries-land-1km.geo';
import { InfoBox } from '../InfoBox';
// import GeoRasterLayer from 'georaster-layer-for-leaflet';
import { GetCOGLayer, GetTileLayer } from './addGeoraster';
import { GetBathymetryLayer } from './addBathymetry';
import { Loading } from '../Loading';
import React from 'react';


interface DisplayPositionProps{
  map: any,
}

function DisplayPosition({ map }: DisplayPositionProps) {

  const [position, setPosition] = useState(null)

  useEffect(() => {
    map.on('mousemove', (e: any) => {
      setPosition(e.latlng)
    })
  }, [map])
  return (
    <InfoBox
      position={position}
    />
  )
}

interface keyable {
  [key: string]: any
}

interface MapProps{
  selectedLayers: keyable,
  actualLayer: string[],
  layerAction: String,
  setLayerAction: any
}

function MapHome1({selectedLayers, actualLayer, layerAction, setLayerAction}: MapProps) {
  const MAPBOX_API_KEY = import.meta.env.VITE_MAPBOX_API_KEY;
  const MAPBOX_USERID = 'mapbox/satellite-v9';
  const MAPBOX_ATTRIBUTION = "Map data &copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>"

  console.log('render...')
  const [map, setMap] = useState<any>(null)


  const [loading, setLoading] = useState<boolean>(false)

  async function getWMSLayer (layerName: Object) {
    // layerName.params['atribution'] = actualLayer
    // const layer = L.tileLayer.wms( layerName.url, layerName.params)
    const WMSOptions = {
      service: 'WMS',
      attribution: actualLayer[0],
      request: 'GetMap',
      version: '1.3.0',
      layers: 'eusm2021_eunis2019_group',
      format: 'image/png',
      transparent: true,
      info_format: 'text/html',
      tiled: 'false',
      width: '150',
      height: '125',
      bounds: L.latLngBounds([[46, -10],[50, 2]])
    }
    const layer = L.tileLayer.wms( 'https://ows.emodnet-seabedhabitats.eu/geoserver/emodnet_view/wms?', WMSOptions)

    map ? map.addLayer(layer) : null
    // let nE = layer.getBounds().getNorthEast()
    // let sW = layer.getBounds().getSouthWest()

    // const newBounds = [[nE.lat, nE.lng],[sW.lat, sW.lng]]
    // console.log(newBounds)
    map.fitBounds([[46, -10],[52, 2]])
  }


  async function customWMSLayer() {
    const getBathymetry = new GetBathymetryLayer()
    await getBathymetry.getLayer().then( function () {
      map.addLayer(getBathymetry.layer)
    })
  }


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

  async function generateSelectedLayer () {
    const layerName = selectedLayers[actualLayer[0]]
    if (layerName.data_type === 'WMS'){
      await getWMSLayer(layerName)
      setLoading(false)
    } else if (layerName.data_type === 'COG'){

      if (window.location.pathname === '/') {
        const getCOGLayer = new GetCOGLayer(layerName, actualLayer)
        await getCOGLayer.parseGeo().then( function () {
          map.addLayer(getCOGLayer.layer)
          let nE = getCOGLayer.layer.getBounds().getNorthEast()
          let sW = getCOGLayer.layer.getBounds().getSouthWest()

          const newBounds = [[nE.lat, nE.lng],[sW.lat, sW.lng]]
          map.fitBounds(newBounds)
          setLoading(false)
        });
      } else {

        const getCOGLayer = new GetTileLayer(layerName, actualLayer)

        await getCOGLayer.getTile().then( function () {
          map.addLayer(getCOGLayer.layer, true)
          const newBounds = [
            [getCOGLayer.bounds[3], getCOGLayer.bounds[0]],
            [getCOGLayer.bounds[1], getCOGLayer.bounds[2]]
          ]
          map.fitBounds(newBounds)
          setLoading(false)
        });
      }
    }
  }

  function removeLayerFromMap(): void {

    map.eachLayer(function(layer: any){
      if (actualLayer.includes(layer.options.attribution)){
        map.removeLayer(layer)
        map.setView(new L.LatLng(50.39415159013279, -7.712108868853798), 5);
        setLayerAction('')
      }
    })
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
      setLoading(false)
    } else if (layerAction === 'add'){
      setLoading(true)
      addLayerIntoMap()
      setLayerAction('')
    }
  }, [selectedLayers])

  const displayMap = useMemo(
    () => (
      <MapContainer
        style={{ height: '100vh', width: '100vw' }}
        center={[50.39415159013279, -7.712108868853798]}
        zoom={5}
        maxZoom={30}
        scrollWheelZoom={true}
        zoomControl={false}
        ref={setMap}
      >
        <LayersControl>
          <LayersControl.BaseLayer checked name="OSM">
            <Pane name="OSM" style={{ zIndex: -1 }} >
              <TileLayer
                attribution={'© OpenStreetMap'}
                maxZoom={30}
                url={'https://tile.openstreetmap.org/{z}/{x}/{y}.png'}
              />
            </Pane>
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="NASA Blue Marble">
            <Pane name="NASA" style={{ zIndex: -1 }} >
              <TileLayer
                url="https://gibs-{s}.earthdata.nasa.gov/wmts/epsg3857/best/BlueMarble_ShadedRelief_Bathymetry/default//EPSG3857_500m/{z}/{y}/{x}.jpeg"
                attribution="&copy; NASA Blue Marble, image service by OpenGeo"
              />
            </Pane>
          </LayersControl.BaseLayer>
        </LayersControl>
          {/* <LayersControl.Overlay name="Coastline">
            <GeoJSON
              attribution="Coastlines"
              data={continent}
              style={{
                color: "#5a5c5a",
                weight: 2,
                opacity: 0.4,
                fillOpacity: 0,
              }}
            />
          </LayersControl.Overlay> */}
          {/* <LayersControl.Overlay name="Background Bathymetry">
            { customWMSLayer }
          </LayersControl.Overlay> */}
      </MapContainer>
    ),
    [map],
  )

  return (
    <div>
      {displayMap}
      {map ? <DisplayPosition map={map} /> : null}
      {loading ? <Loading/> : null }
    </div>
  )
}


function mapPropsAreEqual(prevMap: any, nextMap: any) {
  return prevMap.selectedLayers === nextMap.selectedLayers
    && prevMap.actualLayer === nextMap.actualLayer;
}

export const MapHome = React.memo(MapHome1, mapPropsAreEqual)
