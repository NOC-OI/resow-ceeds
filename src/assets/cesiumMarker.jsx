import chroma from 'chroma-js'

export const cesiumMarker = (color) => {
  const lighterColor = chroma(color).brighten(1).hex()
  const darkerColor = chroma(color).darken(1).hex()
  return `data:image/svg+xml;base64,${btoa(`<svg width="24px" height="24px" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="grad1" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
      <stop offset="0%" style="stop-color:${darkerColor}; stop-opacity:1" />
      <stop offset="60%" style="stop-color:${lighterColor}; stop-opacity:1" />
    </radialGradient>
    <filter id="f1" x="-50%" y="-50%" width="200%" height="200%">
      <feOffset result="offOut" in="SourceGraphic" dx="0" dy="2" />
      <feGaussianBlur result="blurOut" in="offOut" stdDeviation="2" />
      <feBlend in="SourceGraphic" in2="blurOut" mode="normal" />
    </filter>
  </defs>
  <circle cx="12" cy="12" r="10" fill="url(#grad1)" filter="url(#f1)" />
  <ellipse cx="100" cy="150" rx="80" ry="20" fill="rgba(0, 0, 0, 0.2)" />
</svg>`)}`
}
