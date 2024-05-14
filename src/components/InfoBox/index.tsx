import { InfoBoxContainer } from './styles'
import { DimensionsToogle } from '../DimensionsToogle'
import { defineNewDepthValue } from '../../lib/map/utils'
import { useEffect } from 'react'

interface keyable {
  [key: string]: any
}

interface InfoBoxProps {
  position: null | keyable
  depth: keyable
  batLayer?: any
  setDepth?: any
}

export function InfoBox({
  position = null,
  depth = {},
  batLayer,
  setDepth,
}: InfoBoxProps) {
  let lat
  let lng
  if (position === null) {
    lat = '---'
    lng = '---'
  } else {
    let tempLat = position.lat.toFixed(6)
    let latSignal
    if (tempLat >= 0) {
      latSignal = 'N'
    } else {
      latSignal = 'S'
      tempLat = tempLat * -1
    }
    const latDegrees = String(Math.floor(tempLat)).padStart(2, '0')
    const latMinutes = String(Math.floor((tempLat % 1) * 60)).padStart(2, '0')
    const latSeconds = String(
      Math.floor((((tempLat % 1) * 60) % 1) * 60),
    ).padStart(2, '0')
    lat = `${latDegrees}°${latMinutes}'${latSeconds}${latSignal}`

    let tempLng = position.lng.toFixed(6)
    let lngSignal
    if (tempLng >= 0) {
      lngSignal = 'W'
    } else {
      lngSignal = 'E'
      tempLng = tempLng * -1
    }
    const lngDegrees = String(Math.floor(tempLng)).padStart(2, '0')
    const lngMinutes = String(Math.floor((tempLng % 1) * 60)).padStart(2, '0')
    const lngSeconds = String(
      Math.floor((((tempLng % 1) * 60) % 1) * 60),
    ).padStart(2, '0')
    lng = `${lngDegrees}°${lngMinutes}'${lngSeconds}${lngSignal}`
  }

  useEffect(() => {
    if (batLayer && position) {
      defineNewDepthValue('_Depth', {}, position, null, batLayer, setDepth)
    }
  }, [position, batLayer])

  return (
    <InfoBoxContainer id="infobox-container">
      <h1 className="text-[1.5rem] leading-6 text-center pb-2">CEEDS</h1>
      <div className="flex justify-between items-center gap-2">
        <a href="https://resow.uk/" target="_blank" className="pl-1 sm:pl-0">
          <img src="favicon.png" className="h-20" />
        </a>
        <div className="w-32 hidden sm:flex sm:flex-col gap-1">
          <div className="flex align-middle justify-between text-[1rem] leading-6">
            <p>Lat:</p>
            <span>{lat}</span>
          </div>
          <div className="flex align-middle justify-between text-[1rem] leading-6">
            <p>Lon:</p>
            <span>{lng}</span>
          </div>
          <div className="flex align-middle justify-between text-[1rem] leading-6">
            <p>Depth:</p>
            {depth.Shipborne ? (
              <span>{`${depth.Shipborne} m`}</span>
            ) : depth.Emodnet ? (
              <span>{`${depth.Emodnet} m`}</span>
            ) : depth.Gebco ? (
              <span>{`${depth.Gebco} m`}</span>
            ) : depth.Depth ? (
              <span>{`${depth.Depth} m`}</span>
            ) : (
              <span>-- m</span>
            )}
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center sm:hidden">
        <DimensionsToogle />
      </div>
    </InfoBoxContainer>
  )
}
