import { MapContainer, useMap, Marker, Popup, TileLayer, useMapEvent, WMSTileLayer, GeoJSON, LayersControl } from 'react-leaflet'
import 'leaflet/dist/leaflet.css';
import { useCallback, useEffect, useMemo, useState } from 'react';
import * as L from 'leaflet';
// import { continent } from '../../countries-land-1km.geo';
import { InfoBox } from '../InfoBox';
import GeoRasterLayer from 'georaster-layer-for-leaflet';
import { GetCOGLayer } from './addGeoraster';
import { GetBathymetryLayer } from './addBathymetry';
import { Loading } from '../Loading';


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
  actualLayer: string,
  layerAction: String,
  setLayerAction: any
}

export function MapHome({selectedLayers, actualLayer, layerAction, setLayerAction}: MapProps) {
  // console.log(selectedLayers)
  const MAPBOX_API_KEY = import.meta.env.VITE_MAPBOX_API_KEY;
  const MAPBOX_USERID = 'mapbox/satellite-v9';
  const MAPBOX_ATTRIBUTION = "Map data &copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>"

  const [map, setMap] = useState<any>(null)

  const [loading, setLoading] = useState<boolean>(false)

  async function getWMSLayer (layerName: Object) {
    // layerName.params['atribution'] = actualLayer
    // const layer = L.tileLayer.wms( layerName.url, layerName.params)
    const WMSOptions = {
      service: 'WMS',
      attribution: actualLayer,
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
    console.log(layer)
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
    const layerName = selectedLayers[actualLayer]
    if (layerName.data_type === 'WMS'){
      await getWMSLayer(layerName)
      setLoading(false)
    } else if (layerName.data_type === 'COG'){
      const getCOGLayer = new GetCOGLayer(layerName, actualLayer)

      await getCOGLayer.parseGeo().then( function () {
        map.addLayer(getCOGLayer.layer)
        let nE = getCOGLayer.layer.getBounds().getNorthEast()
        let sW = getCOGLayer.layer.getBounds().getSouthWest()

        const newBounds = [[nE.lat, nE.lng],[sW.lat, sW.lng]]
        console.log(newBounds)
        map.fitBounds(newBounds)
        setLoading(false)

      })
    }
  }

  function removeLayerFromMap(): void {
    map.eachLayer(function(layer: any){
      if (layer.options.attribution === actualLayer ){
        map.removeLayer(layer)
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
    console.log(selectedLayers)
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
            <TileLayer
              attribution={'© OpenStreetMap'}
              maxZoom={30}
              url={'https://tile.openstreetmap.org/{z}/{x}/{y}.png'}
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="NASA Blue Marble">
            <TileLayer
              url="https://gibs-{s}.earthdata.nasa.gov/wmts/epsg3857/best/BlueMarble_ShadedRelief_Bathymetry/default//EPSG3857_500m/{z}/{y}/{x}.jpeg"
              attribution="&copy; NASA Blue Marble, image service by OpenGeo"
            />
          </LayersControl.BaseLayer>
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
        </LayersControl>
      </MapContainer>
    ),
    [map],
  )
  return (
    <div>
      {map ? <DisplayPosition map={map} /> : null}
      {displayMap}
      {loading ? <Loading/> : null }
    </div>
  )
}
