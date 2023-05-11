import { MapContainer, useMap, Marker, Popup, TileLayer, useMapEvent, WMSTileLayer, GeoJSON, LayersControl, Pane, FeatureGroup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css';
import { useEffect, useMemo, useState } from 'react';
import * as L from 'leaflet';
import { coastline } from '../../coastline';
import { InfoBox } from '../InfoBox';
import { GetCOGLayer, GetTifLayer, GetTileLayer } from '../MapHome/addGeoraster';
import { Loading } from '../Loading';
import React from 'react';
import { GetGeoblazeValue } from '../MapHome/getGeoblazeValue';
import { listPhotos } from '../PhotoSelection/listPhotos';
import { useNavigate } from 'react-router-dom';
import { GetMBTiles } from '../MapHome/addMBTiles';
import {} from 'leaflet.vectorgrid'
import { protobuf } from '../MapHome/addVectorGridL';

interface DisplayPositionProps{
  map: any,
  depth: any,
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
  return (
    <InfoBox
      position={position}
      depth={depth}
    />
  )
}

interface MapProps{
  photoId: any,
  contrast: any,
  setContrast: any,
  actualLayer: any,
  setActualLayer: any,
}


function MapHome1({photoId, contrast, setContrast, actualLayer, setActualLayer}: MapProps) {
  const MAPBOX_API_KEY = import.meta.env.VITE_MAPBOX_API_KEY;
  const MAPBOX_USERID = 'mapbox/satellite-v9';
  const MAPBOX_ATTRIBUTION = "Map data &copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>"

  const [errorMessage, setErrorMessage] = useState(false)

  const [map, setMap] = useState<any>(null)

  const [depth, setDepth] = useState(null)

  const [loading, setLoading] = useState<boolean>(false)

  const navigate = useNavigate();

  if (errorMessage) {
    navigate('/')
  }

  function bringLayerToFront(layer: any) {
    layer.bringToFront()
    const frontLayers = ['Coastline', 'Marine Conservation Zones', 'Special Areas of Conservation']
    map.eachLayer(function(mapLayer: any){
      if (frontLayers.includes(mapLayer.options.attribution)){
        mapLayer.bringToFront()
      }
    })
  }

  async function getPhotoInfo() {
    let returnedPhoto: any
    const photoArray = photoId.split('_')
    const photoNumber = photoArray[photoArray.length - 1]
    photoArray.pop(photoArray.length - 1)
    const photoName = photoArray[photoArray.length - 1]
    photoArray.pop(photoArray.length - 1)
    let photoClass = (photoArray.length > 1)?
      photoArray[photoArray.length - 1].join('_')
      : photoArray.join('_')
    photoClass = photoClass.replace('-', ' ')
    listPhotos.forEach(photos => {
      if (photos.layerClass === photoClass) {
        photos.layerNames[photoName].photos.forEach((photo: { id: any; }) => {
          if (photo.id.toString() === photoNumber) {
            returnedPhoto = photo
          }
        });
      }
    });
    return returnedPhoto
  }

  const generateSelectedLayer = async (fitBounds: boolean) => {
    let layer: any
    let layers:any[] = []
    let bounds
    await getPhotoInfo().then(async (photo) => {
      if (photo.local_data_type === 'Marker-COG'){
        const getCOGLayer = new GetTileLayer(photo, [photo.url], contrast)
        getCOGLayer.getTile().then( async function () {
          layer = getCOGLayer.layer
          bounds = [
            [getCOGLayer.bounds[3], getCOGLayer.bounds[0]],
            [getCOGLayer.bounds[1], getCOGLayer.bounds[2]]
          ]
          map.addLayer(layer, true)
          layer? bringLayerToFront(layer): null
          console.log(layer)
          if(fitBounds){
            map.fitBounds(bounds)
          }
          setLoading(false)
          setActualLayer([photo.url])
        });

      }
    })
  }

  const fetchData = async (url: string, actualLayer: string) => {
    const getTifLayer = new GetTifLayer(url, [actualLayer])
    await getTifLayer.parseGeo().then(function () {
      map.addLayer(getTifLayer.layer)
      map.on('mousemove', function(evt: { originalEvent: any; }) {
        var latlng = map.mouseEventToLatLng(evt.originalEvent);
        const getGeoblazeValue = new GetGeoblazeValue(getTifLayer.georaster, latlng)
        getGeoblazeValue.getGeoblaze().then(function () {
          let dep = getGeoblazeValue.dep
          if (dep){
            setDepth(dep[0].toFixed(0))
          } else{
            setDepth(null)
          }
        })
      });
    });
  }

  useEffect(() => {
    let actualLayer: string = 'bathymetry'
    if (map){
      let layerExist = false
      map.eachLayer(function(layer: any){
        if (actualLayer.includes(layer.options.attribution)){
          layerExist = true
          return false
        }
      });
      if (!layerExist) {
        setLoading(true)
        let url = 'https://pilot-imfe-o.s3-ext.jc.rl.ac.uk/haig-fras/asc/bathymetry.tif'

        fetchData(url, actualLayer);
        generateSelectedLayer(true);

      }
    }
  }, [map])

  function removeLayerFromMap(): void {
    map.eachLayer(function(layer: any){
      if (actualLayer.includes(layer.options.attribution)){
        map.removeLayer(layer)
      }
    })
  }

  useEffect(() => {
    if(map) {
      setLoading(true)

      removeLayerFromMap();

      generateSelectedLayer(false);
    }
  }, [contrast])


  const displayMap = useMemo(
    () => (
      <MapContainer
        style={{ height: '100vh', width: '100vw' }}
        center={[50.39415159013279, -7.712108868853798]}
        zoom={5}
        maxZoom={30}
        minZoom={2}
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
          <LayersControl.Overlay checked name="Special Areas of Conservation">
            <WMSTileLayer
              attribution="Special Areas of Conservation"
              url='https://mpa-ows.jncc.gov.uk/mpa_mapper/wms?'
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
              url='https://mpa-ows.jncc.gov.uk/mpa_mapper/wms?'
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
                color: "#5a5c5a",
                weight: 2,
                opacity: 0.4,
                fillOpacity: 0,
              }}
            />
          </LayersControl.Overlay>
        </LayersControl>
      </MapContainer>
    ),
    [map],
  )

  return (
    <div>
      {displayMap}
      {map ? <DisplayPosition map={map} depth={depth} /> : null}
      {loading ? <Loading/> : null }
    </div>
  )
}

function mapPropsAreEqual(prevMap: any, nextMap: any) {
  return prevMap.photoId === nextMap.photoId &&
  prevMap.contrast === nextMap.contrast;
}

export const MapHomeSimple = React.memo(MapHome1, mapPropsAreEqual)
