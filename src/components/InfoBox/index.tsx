import internal from "stream";
import { InfoBoxContainer } from "./styles";

interface keyable {
  [key: string]: any
}

interface InfoBoxProps {
  position: null | keyable,
  depth: null | number,
}


export function InfoBox({position = null, depth = null }: InfoBoxProps) {
  let lat
  let lng

  if (position === null){
    lat = '---'
    lng = '---'
  } else{
    let tempLat = position.lat.toFixed(6)
    let latSignal
    tempLat >= 0 ? latSignal = 'N' : (latSignal = 'S', tempLat = tempLat *(-1))
    let latDegrees = String(Math.floor(tempLat)).padStart(2, '0')
    let latMinutes = String(Math.floor((tempLat % 1) * 60)).padStart(2, '0')
    let latSeconds = String(Math.floor((((tempLat % 1) * 60)  % 1)*60)).padStart(2, '0')
    lat = `${latDegrees}°${latMinutes}'${latSeconds}${latSignal}`

    let tempLng = position.lng.toFixed(6)
    let lngSignal
    tempLng >= 0 ? lngSignal = 'W' : (lngSignal = 'E', tempLng = tempLng *(-1))
    let lngDegrees = String(Math.floor(tempLng)).padStart(2, '0')
    let lngMinutes = String(Math.floor((tempLng % 1) * 60)).padStart(2, '0')
    let lngSeconds = String(Math.floor((((tempLng % 1) * 60)  % 1)*60)).padStart(2, '0')
    lng = `${lngDegrees}°${lngMinutes}'${lngSeconds}${lngSignal}`
  }


  return (
    <InfoBoxContainer>
      <h1>Haig Fras</h1>
      <div>
        <p>Lat:</p>
        <span>{lat}</span>
      </div>
      <div>
        <p>Lon:</p>
        <span>{lng}</span>
      </div>
      <div>
        <p>Depth:</p>
        <span>{depth? `${depth} m` : `-- m` }</span>
      </div>
    </InfoBoxContainer>
  )
}
