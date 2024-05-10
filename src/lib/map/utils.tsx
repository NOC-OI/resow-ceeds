import chroma from 'chroma-js'
import { MarkerOptions } from 'leaflet'
import proj4 from 'proj4'
import * as L from 'leaflet'
import { GetGeoblazeValue } from './getGeoblazeValue'
import { GetTifLayer } from './addGeoraster'
import * as Cesium from 'cesium'
import * as turf from '@turf/turf'

export interface keyable {
  [key: string]: unknown
}
export const colorScale = chroma
  .scale(['#f00', '#0f0', '#00f', 'gray'])
  .mode('hsl')
  .colors(100)

export const batOrder = ['Shipborne', 'EMODNET', 'GEBCO']

export function createTurfPoint(markers, coordinates, dif) {
  markers.push(turf.point([coordinates[0] + dif, coordinates[1] + dif]))
  markers.push(turf.point([coordinates[0] - dif, coordinates[1] - dif]))
  return markers
}

export const baseLayers = [
  {
    attribution: 'OpenStreetMap',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  },
  {
    attribution: 'Mapbox Satellite',
    url: `https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.VITE_MAPBOX_API_KEY}`,
  },
  {
    attribution: 'Esri Satellite',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  },
]

export const defaultBaseLayer = baseLayers[2]

export function reorderPhotos(
  photos: any,
  activePhoto: any = null,
  mapBounds: any = null,
) {
  const shuffled = photos.sort(() => 0.5 - Math.random())
  const n = shuffled.length > 700 ? 700 : shuffled.length
  const newList: any = []
  let count = 0
  let count2 = 0
  if (activePhoto) {
    count++
    newList.push(activePhoto)
  }
  let lat = null
  let lng = null
  if (mapBounds) {
    lat = [mapBounds._southWest.lat, mapBounds._northEast.lat]
    lng = [mapBounds._southWest.lng, mapBounds._northEast.lng]
  }
  shuffled.every((el: any) => {
    if (count >= n) {
      return false // "break"
    }
    if (el.filename !== activePhoto?.filename) {
      if (el.show) {
        count2++
        if (mapBounds) {
          if (
            el.coordinates[1] > lat[0] &&
            el.coordinates[1] < lat[1] &&
            el.coordinates[0] > lng[0] &&
            el.coordinates[0] < lng[1]
          ) {
            newList.push(el.filename)
            count++
          }
        } else {
          newList.push(el.filename)
          count++
        }
      }
    }
    return true
  })
  if (count2 === 0) {
    return []
  }
  return newList
}

export function reprojectGeometry(
  geometry,
  sourceProjection,
  targetProjection,
) {
  if (geometry.type === 'Point') {
    return {
      type: 'Point',
      coordinates: proj4(
        sourceProjection,
        targetProjection,
        geometry.coordinates,
      ),
    }
  } else if (geometry.type === 'LineString') {
    return {
      type: 'LineString',
      coordinates: geometry.coordinates.map((coord) =>
        proj4(sourceProjection, targetProjection, coord),
      ),
    }
  } else if (geometry.type === 'Polygon') {
    return {
      type: 'Polygon',
      coordinates: geometry.coordinates.map((ring) =>
        ring.map((coord) => proj4(sourceProjection, targetProjection, coord)),
      ),
    }
  } else if (geometry.type === 'MultiPoint') {
    return {
      type: 'MultiPoint',
      coordinates: geometry.coordinates.map((coord) =>
        proj4(sourceProjection, targetProjection, coord),
      ),
    }
  } else if (geometry.type === 'MultiLineString') {
    return {
      type: 'MultiLineString',
      coordinates: geometry.coordinates.map((line) =>
        line.map((coord) => proj4(sourceProjection, targetProjection, coord)),
      ),
    }
  } else if (geometry.type === 'MultiPolygon') {
    return {
      type: 'MultiPolygon',
      coordinates: geometry.coordinates.map((polygon) =>
        polygon.map((ring) =>
          ring.map((coord) => proj4(sourceProjection, targetProjection, coord)),
        ),
      ),
    }
  } else {
    return geometry
  }
}

export function reprojectData(geojsonData, sourceProjection, targetProjection) {
  return {
    ...geojsonData,
    features: geojsonData.features.map((feature) => ({
      ...feature,
      geometry: reprojectGeometry(
        feature.geometry,
        sourceProjection,
        targetProjection,
      ),
    })),
  }
}

export function createColor(colorScale: any, rgb: any = false, alpha: any = 1) {
  let color: any
  if (rgb) {
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
export const JOSBaseUrl: string | undefined =
  process.env.VITE_JASMIN_OBJECT_STORE_URL

export const TILE_SERVER_URL: string | undefined =
  process.env.VITE_TILE_SERVER_URL

export const defaultView: [number, number] = [54, 0]
export const defaultZoom = 6

export const defaultMaxZoom = 30
export const defaultWMSBounds = [
  [50, -4],
  [58, 4],
]

export const cesiumPitch = Cesium.Math.toRadians(-10.0)
export const cesiumRoll = Cesium.Math.toRadians(0.0)
export const cesiumHeading = Cesium.Math.toRadians(-100.0)
export const threeDCoordinates = Cesium.Rectangle.fromDegrees(
  2,
  54.1,
  2.1,
  54.2,
)

export const cesiumStartCoordinates = Cesium.Rectangle.fromDegrees(
  defaultWMSBounds[0][1],
  defaultWMSBounds[0][0],
  defaultWMSBounds[1][1],
  defaultWMSBounds[1][0],
)
export const bathymetryUrl = `${JOSBaseUrl}haig-fras/frontend/images/bathymetry.tif`

export function getUrlTileServer(layerName: keyable, url: string) {
  const newUrl = layerName.signed_url ? layerName.signed_url : url
  const isUrlEncoded = !!layerName.signed_url
  return [newUrl, isUrlEncoded]
}

export function createIcon(url: string, size: [number, number]) {
  return L.icon({
    iconUrl: url,
    iconSize: size,
  })
}

export function createDivIcon(color: string, size: [number, number]) {
  const lighterColor = chroma(color).brighten(1).hex()
  const darkerColor = chroma(color).darken(2).hex()
  return L.divIcon({
    className: 'bg-transparent',
    html:
      "<div style='background: radial-gradient(circle, " +
      lighterColor +
      ' 10%, ' +
      color +
      ' 60%); box-shadow: 0 4px 8px 0 ' +
      darkerColor +
      ", 0 6px 20px 0 rgba(0, 0, 0, 0.19); width: 24px; height: 24px; border-radius: 50%; background-color: transparent;'></div>",
    iconSize: size,
  })
}

export function convertProjection(
  source: string,
  dest: string,
  point: [number, number],
) {
  return proj4(source, dest).forward([point[0], point[1]])
}

export function parseCapabilities(xml) {
  const parser = new DOMParser()
  const xmlDoc = parser.parseFromString(xml, 'text/xml')
  const layers = {}
  const layerNodes = xmlDoc.getElementsByTagName('Layer')
  for (let i = 0; i < layerNodes.length; i++) {
    const styles = []
    const legends = []
    const layerNode = layerNodes[i]
    const layerName = layerNode.getElementsByTagName('Name')[0].textContent
    const styleNodes = layerNode.getElementsByTagName('Style')
    for (let j = 0; j < styleNodes.length; j++) {
      const styleNode = styleNodes[j]
      const styleName = styleNode.getElementsByTagName('Name')[0].textContent
      const legendName = styleNode.getElementsByTagName('LegendURL')[0]
      const onlineResource = legendName
        .getElementsByTagName('OnlineResource')[0]
        .getAttribute('xlink:href')
      legends.push(onlineResource)
      styles.push(styleName)
    }
    layers[layerName] = [styles, legends]
  }
  return layers
}

export async function getLegendCapabilities(url: string, layer: string) {
  try {
    const newUrl = `${url}?service=WMS&request=GetCapabilities`
    const response = await fetch(newUrl)
    const text = await response.text()

    const layers = parseCapabilities(text)
    const legendUrl = layers[layer][1][0].replace('amp;', '')
    return legendUrl
  } catch (error) {
    return ''
  }
}

export function createMarker(
  position: [number, number],
  options: MarkerOptions,
) {
  return L.marker([position[0], position[1]], options)
}

export function createSvgIcon(color: string) {
  const lighterColor = chroma(color).brighten(1).hex()
  const darkerColor = chroma(color).darken(2).hex()
  return (
    <svg width="24px" height="24px" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="grad1" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
          <stop
            offset="10%"
            style={{ stopColor: darkerColor, stopOpacity: 1 }}
          />
          <stop
            offset="10%"
            style={{ stopColor: lighterColor, stopOpacity: 1 }}
          />
        </radialGradient>
        <filter id="f1" x="-50%" y="-50%" width="200%" height="200%">
          <feOffset result="offOut" in="SourceGraphic" dx="0" dy="2" />
          <feGaussianBlur result="blurOut" in="offOut" stdDeviation="2" />
          <feBlend in="SourceGraphic" in2="blurOut" mode="normal" />
        </filter>
      </defs>
      <circle cx="12" cy="12" r="10" fill="url(#grad1)" filter="url(#f1)" />
    </svg>
  )
}

export const activeIcon = L.icon({
  iconUrl: '/marker-icon_red.png',
  iconSize: [25, 25],
})

export const icon = L.icon({
  iconUrl: '/marker-icon.png',
  iconSize: [27, 45],
})

export const smallIcon = L.icon({
  iconUrl: '/marker-icon.png',
  iconSize: [0.1, 0.1],
})

export const defaultOpacity = 0.7

export function getGeorasterLayer(url: string, actualLayer?: string) {
  const getTifLayer = new GetTifLayer(url, [actualLayer])
  return getTifLayer.loadGeo().then(function () {
    return getTifLayer.layer
  })
}
export async function defineNewDepthValue(
  actual,
  layerName,
  latlng,
  coords,
  layer,
  setDepth,
) {
  const getGeoblazeValue = new GetGeoblazeValue(
    layerName,
    latlng,
    coords,
    layer,
  )
  async function getDepthValue() {
    return getGeoblazeValue.getGeoblaze().then(function () {
      return getGeoblazeValue.dep
    })
  }

  const dep = await getDepthValue()
  const depthName = actual.split('_')[1]
  if (dep) {
    setDepth((depth: any) => {
      const copy = { ...depth }
      copy[depthName] = dep.toFixed(2)
      return {
        ...copy,
      }
    })
  } else {
    setDepth((depth: any) => {
      const copy = { ...depth }
      delete copy[depthName]
      return {
        ...copy,
      }
    })
  }
}
