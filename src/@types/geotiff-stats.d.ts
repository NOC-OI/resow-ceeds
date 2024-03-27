// types/geotiff-stats.d.ts
// declare module 'geotiff-stats' {
//   import getStats = require('geotiff-stats')
//   export = getStats

//   // Type definitions here
// }
declare module 'geotiff-stats' {
  export function calculateStats(buffer: ArrayBuffer)
}
