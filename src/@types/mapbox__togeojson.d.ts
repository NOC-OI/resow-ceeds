// src/mapbox__togeojson.d.ts
declare module '@mapbox/togeojson' {
  export function kml(doc: Document): GeoJSON.FeatureCollection

  // Add other exports if necessary, e.g., gpx, tcx
  export function gpx(doc: Document): GeoJSON.FeatureCollection
}
