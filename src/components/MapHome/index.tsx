import { MapContainer, useMap, Marker, Popup, TileLayer, useMapEvent, WMSTileLayer, GeoJSON, LayersControl, Pane, FeatureGroup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css';
import { useEffect, useMemo, useState } from 'react';
import * as L from 'leaflet';
import { coastline } from '../../coastline';
import { InfoBox } from '../InfoBox';
import { GetCOGLayer, GetTifLayer, GetTileLayer } from './addGeoraster';
import { Loading } from '../Loading';
import React from 'react';
import { callBetterWMS } from './addBetterWMS';
import { GetGeoblazeValue } from './getGeoblazeValue';
import { GetMBTiles } from './addMBTiles';

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
  selectedLayers: keyable,
  actualLayer: string[],
  layerAction: String,
  setLayerAction: any,
  selectedArea: boolean,
  latLonLimits: any,
  showPhotos: any,
  setShowPhotos: any,
  activePhoto: any,
  setActivePhoto: any,
  mapBounds: any,
  setMapBounds: any,
}


function MapHome1({selectedLayers, actualLayer, layerAction, setLayerAction, selectedArea, latLonLimits, showPhotos, setShowPhotos, activePhoto, setActivePhoto, mapBounds, setMapBounds}: MapProps) {
  const MAPBOX_API_KEY = import.meta.env.VITE_MAPBOX_API_KEY;
  const MAPBOX_USERID = 'mapbox/satellite-v9';
  const MAPBOX_ATTRIBUTION = "Map data &copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>"

  const [map, setMap] = useState<any>(null)

  const [depth, setDepth] = useState(null)
  
  const defaultWMSBounds = [[48, -14],[52, -4]]

  // if (map) {
  //   console.log(map._layers)
  // }
  // console.log(selectedLayers)

  const [loading, setLoading] = useState<boolean>(false)

  function bringLayerToFront(layer: any) {
    layer.bringToFront()
    const frontLayers = ['Coastline', 'Marine Conservation Zones', 'Special Areas of Conservation']
    map.eachLayer(function(mapLayer: any){
      if (frontLayers.includes(mapLayer.options.attribution)){
        mapLayer.bringToFront()
      }
    })
  }

  useEffect(() => {
    if(map){
      map.on('moveend', function() { 
        setMapBounds(map.getBounds());
      });
    }
  }, [map])

  async function getWMSLayer (layerName: any) {
    layerName.params['attribution'] = actualLayer[0]
    const layer = callBetterWMS(layerName.url, layerName.params)
    return layer
  }

  const activeIcon = L.icon({
    iconUrl: '/marker-icon_red.png',
    shadowUrl: '/marker-shadow.png',
  });
  const inactiveIcon = L.icon({
    iconUrl: '/marker-icon.png',
    shadowUrl: '/marker-shadow.png',
  });

  async function changeIcons(photo: any) {
    map.eachLayer(function(mapLayer: any){
      if(mapLayer.options.dataType === 'marker'){
        if (mapLayer.options.url === photo.url){
          mapLayer.setIcon(activeIcon)
          if (!photo.notCenter){
            console.log(map)
            map.setView(new L.LatLng(mapLayer._latlng.lat, mapLayer._latlng.lng), map._zoom);
          }
        } else{
          mapLayer.setIcon(inactiveIcon)
        }
      }
    })
  }



  async function generateSelectedLayer () {
    const layerName = selectedLayers[actualLayer[0]]
    let layer
    let layers:any[] = []
    let bounds
    if (layerName.data_type === 'WMS'){
      layer = await getWMSLayer(layerName)
      bounds = defaultWMSBounds
    } else if (layerName.data_type === 'COG'){
      if (window.location.pathname === '/notileserver') {
        const getCOGLayer = new GetCOGLayer(layerName, actualLayer)
        await getCOGLayer.parseGeo().then( function () {
          layer = getCOGLayer.layer
          let nE = layer.getBounds().getNorthEast()
          let sW = layer.getBounds().getSouthWest()
          bounds = [[nE.lat, nE.lng],[sW.lat, sW.lng]]
        });
      } else {
        const getCOGLayer = new GetTileLayer(layerName, actualLayer, true)
        await getCOGLayer.getTile().then( function () {
          layer = getCOGLayer.layer
          bounds = [
            [getCOGLayer.bounds[3], getCOGLayer.bounds[0]],
            [getCOGLayer.bounds[1], getCOGLayer.bounds[2]]
          ]
        });
      }
    } else if (layerName.data_type === 'Photo'){
      let latValues:number[] = []
      let lonValues:number[] = []
      bounds = defaultWMSBounds
      await layerName.photos.map(async (photo: { notCenter: boolean, url: string; local_data_type: string; position: any }) => {
        if (photo.local_data_type === 'Marker-COG'){
          const getCOGLayer = new GetTileLayer(photo, actualLayer, true, 'marker')
          await getCOGLayer.getTile().then(async function () {
            console.log(getCOGLayer.layer)       
            map.addLayer(getCOGLayer.layer)
            if (getCOGLayer.layer){
              getCOGLayer.layer.on('click', async function (e) {
                const popup = L.popup()
                  .setLatLng(e.latlng)
                  .setContent(getCOGLayer.popupText)
                  .openOn(map);
                photo.notCenter = true
                // getCOGLayer.layer. zIndexOffset = 9999
                setActivePhoto(photo)
              })
            }
          });
        }
      })
    } else if (layerName.data_type === 'MBTiles'){
      bounds = defaultWMSBounds
      const getMBTilesLayer = new GetMBTiles(layerName, actualLayer)
      await getMBTilesLayer.getLayer().then(async function () {
        layer = getMBTilesLayer.layer
        if (layer){
          layer.on('click', async function (e: any) {
            let strContent: string[] = []
            Object.keys(e.layer.properties).map(c => {
              strContent.push(`<p>${c}: ${e.layer.properties[c] === ' '? '--': e.layer.properties[c]}<p>`) 
            })
            L.popup({ maxWidth: 200 })
              .setLatLng(e.latlng)
              .setContent(strContent.join(''))
              .openOn(map);
          })
        }
      });
    }
    if (layerName.data_type !== 'Photo'){
      layer.options.attribution = actualLayer[0]
      map.addLayer(layer, true)
      layer? bringLayerToFront(layer): null
    }
    map.fitBounds(bounds)
    setLoading(false)
  }


  useEffect(() => {
    if (activePhoto){
      let idx: number = 1
      let newShowPhotos = [...showPhotos]
      newShowPhotos.forEach((photo, i)=> {
          if (activePhoto.url === photo.url){
          newShowPhotos[i].active = true
          idx = i
        } else{
          newShowPhotos[i].active = false
        }
      })
      changeIcons(activePhoto)
      setShowPhotos(newShowPhotos)

    }
  }, [activePhoto])


  function removeLayerFromMap(): void {
    map.eachLayer(function(layer: any){
      if (actualLayer.includes(layer.options.attribution)){
        map.removeLayer(layer)
        if(activePhoto.layerName === actualLayer[0]){
          setActivePhoto('')
        }
        // map.setView(new L.LatLng(50.39415159013279, -7.712108868853798), 5);
        setLayerAction('')
      }
    })
    setLoading(false)
  }
  useEffect(() => {
    if (map){
      let actualLayer = 'bathymetry'
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

        const fetchData = async () => {
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
            setLoading(false)
          });
        }
        fetchData();
      }
    }
  }, [map])

  async function addLayerIntoMap() {
    await generateSelectedLayer()
    setLayerAction('')
  }

  useEffect(() => {
    if (map){
      map.eachLayer(function(layer: any){
        if (layer.options.attribution === 'polygon'){
          map.removeLayer(layer)
        }
      });
      const polygon = L.polygon(latLonLimits,
        {
          attribution: 'polygon',
          color: "#ff96bc",
          weight: 2,
          opacity: 0.7,
        },
      )
      polygon.addTo(map);
    }
  }, [latLonLimits])



  useEffect(() => {
    if (selectedArea){
      const polygon = L.polygon(latLonLimits,
        {
          attribution: 'polygon',
          color: "#ff96bc",
          weight: 2,
          opacity: 0.7,
        },
      )
      polygon.addTo(map);
    } else {
      if (map){
        map.eachLayer(function(layer: any){
          if (layer.options.attribution === 'polygon'){
            map.removeLayer(layer)
          }
        });
      }
    }
  }, [selectedArea])

  async function changeMapZoom() {
    map.eachLayer(function(layer: any){
      if (actualLayer.includes(layer.options.attribution)){
        if (selectedLayers[actualLayer[0]].data_type === 'WMS' || selectedLayers[actualLayer[0]].data_type === 'MBTiles'){
          map.fitBounds(defaultWMSBounds)
        } else if (selectedLayers[actualLayer[0]].data_type = 'COG'){
          const newBounds = [
            [layer.options.limits[3], layer.options.limits[0]],
            [layer.options.limits[1], layer.options.limits[2]]
          ]
          map.fitBounds(newBounds)
        }

        bringLayerToFront(layer)

      }
    })
    setLayerAction('')
  }

  function changeMapOpacity() {
    map.eachLayer(function(layer: any){
      if (actualLayer.includes(layer.options.attribution)){
        layer.setOpacity(selectedLayers[actualLayer[0]].opacity)
      }
    })
  }

  useEffect(() => {
    if (layerAction === 'remove') {
      setLoading(true)
      removeLayerFromMap()
      setLayerAction('')
    } else if (layerAction === 'add'){
      setLoading(true)
      addLayerIntoMap()
      setLayerAction('')
    } else if (layerAction === 'zoom'){
      changeMapZoom()
      setLayerAction('')
    } else if (layerAction === 'opacity'){
      changeMapOpacity()
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
      {/* {map ? <DisplayBathymetry map={map} /> : null} */}
      {loading ? <Loading/> : null }
    </div>
  )
}

function mapPropsAreEqual(prevMap: any, nextMap: any) {
  return prevMap.selectedLayers === nextMap.selectedLayers
    && prevMap.actualLayer === nextMap.actualLayer
    && prevMap.selectedArea === nextMap.selectedArea
    && prevMap.latLonLimits === nextMap.latLonLimits
    && prevMap.showPhotos === nextMap.showPhotos
    && prevMap.activePhoto === nextMap.activePhoto;
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
