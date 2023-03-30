import { MapContainer, withLeaflet, useMap, Marker, Popup, TileLayer, useMapEvent, WMSTileLayer, GeoJSON } from 'react-leaflet'
import 'leaflet/dist/leaflet.css';
import { useCallback, useEffect, useMemo, useState } from 'react';
import * as WMS from "leaflet.wms";

import continent from '../../countries-land-1km.geo.json';
import { InfoBox } from '../InfoBox';

const MySource =  WMS.Source.extend ({
  'getEvents': function() {
    if (this.options.identify) {
        return {'click': this.identify};
    } else {
        return {};
    }
  }
});

interface DisplayPositionProps{
  map: any,
}

function DisplayPosition({ map }: DisplayPositionProps) {

  const [position, setPosition] = useState(null)

  useEffect(() => {
    map.on('mousemove', (e) => {
      setPosition(e.latlng)
    })
  }, [map])
  return (
    <InfoBox
      position={position}
      setPosition={setPosition}
    />
  )
}

interface CustomWMSProps {
  map: any,
  layer: String[],
  options: Object,
  url: String,
}

interface MapProps{
  setPosition: any,
  selectedLayers: Object,
  actualLayer: any,
  layerAction: String,
  setLayerAction: any
}

export function MapHome({selectedLayers, actualLayer, layerAction, setLayerAction}: MapProps) {
  // console.log(selectedLayers)
  const MAPBOX_API_KEY = import.meta.env.VITE_MAPBOX_API_KEY;
  const MAPBOX_USERID = 'mapbox/satellite-v9';
  const MAPBOX_ATTRIBUTION = "Map data &copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>"

  const [map, setMap] = useState(null)
  map? console.log(map._layers): console.log('')

  async function getWMSLayer (layerName: Object) {
    // layerName.params['atribution'] = actualLayer
    // const layer = L.tileLayer.wms( layerName.url, layerName.params)
    const layer = L.tileLayer.wms( 'https://ows.emodnet-seabedhabitats.eu/geoserver/emodnet_view/wms?',
      {
        service: 'WMS',
        attribution: actualLayer,
        request: 'GetMap',
        version: '1.3.0',
        layers: 'eusm2021_eunis2019_group',
        format: 'image/png',
        transparent: 'true',
        info_format: 'text/html',
        tiled: 'false',
        width: '150',
        height: '125',
        bounds: L.latLngBounds([[46, -10],[50, 2]])
      })
    map.addLayer(layer)
    console.log(layer)
    // let nE = layer.getBounds().getNorthEast()
    // let sW = layer.getBounds().getSouthWest()

    // const newBounds = [[nE.lat, nE.lng],[sW.lat, sW.lng]]
    // console.log(newBounds)
    map.fitBounds([[46, -10],[52, 2]])
  }

  async function getCOGLayer (layerName) {
    parseGeoraster(layerName.url).then(async georaster => {

      const layer = new GeoRasterLayer({
        attribution: actualLayer,
        georaster: georaster,
        resolution: 128,
        opacity: 1,
        keepBuffer: 25,
        debugLevel: 2,
        // mask: continent,
        // mask_strategy: "inside"
        pixelValuesToColorFn: values => {
          console.log(values)
          return values[0] ? '#00000000' : values[0]
        }
      });
      map.addLayer(layer)

      let nE = layer.getBounds().getNorthEast()
      let sW = layer.getBounds().getSouthWest()

      const newBounds = [[nE.lat, nE.lng],[sW.lat, sW.lng]]
      console.log(newBounds)
      map.fitBounds(newBounds)
    });
  };

  async function generateSelectedLayer () {
    const layerName = selectedLayers[actualLayer]
    if (layerName.data_type === 'WMS'){
      await getWMSLayer(layerName)
    } else if (layerName.data_type === 'COG'){
      await getCOGLayer(layerName)
    }
  }


  function removeLayerFromMap(): void {
    map.eachLayer(function(layer){
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
      removeLayerFromMap()
      setLayerAction('')
    } else if (layerAction === 'add'){
      addLayerIntoMap()
      setLayerAction('')
    }
  }, [selectedLayers])


  const bathymetry = useMemo(() => {
    const source = new MySource(
      "https://ows.terrestris.de/osm/service",
      {
        "format": "image/png",
        "transparent": "true",
        "opacity": '0',
        "info_format": "text/html"
      }
    );
    return source.getLayer('TOPO-WMS')
    },[],
  )

  function CustomWMSLayer({layer}:  CustomWMSProps) {
    if(!map.hasLayer(layer)){
      map.addLayer(layer)
    }
  }

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
        <TileLayer
          attribution={MAPBOX_ATTRIBUTION}
          url={`https://api.mapbox.com/styles/v1/${MAPBOX_USERID}/tiles/256/{z}/{x}/{y}@2x?access_token=${MAPBOX_API_KEY}`}
        />
        {/* {map?
          <GeoJSON
            attribution="Coastlines"
            data={continent}
            style={{
              color: "#5a5c5a",
              weight: 2,
              opacity: 0.4,
              fillOpacity: 0,
              zIndex: 9999,
            }} />
          : null
        } */}
      </MapContainer>
    ),
    [map],
  )

  return (
    <div>
      {map ? <DisplayPosition map={map} /> : null}
      {map ? <CustomWMSLayer layer={bathymetry} /> : null }
      {displayMap}
    </div>
  )
}
