import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { LayerLegendContainer } from "./styles";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";

interface LayerLegendProps {
  layerLegend: any,
  setLayerLegend: any,
}

export function LayerLegend({layerLegend, setLayerLegend}: LayerLegendProps) {

  function handleClose(){
    setLayerLegend('')
  }
  console.log(layerLegend)

  return (
    <LayerLegendContainer>
      <div>
        <FontAwesomeIcon contentStyleType={'regular'} icon={faCircleXmark} onClick={handleClose} />
      </div>
      <h1>{layerLegend.layerName}</h1>
      <div>
        <img src={layerLegend.url} />
      </div>
    </LayerLegendContainer>
  )
}
