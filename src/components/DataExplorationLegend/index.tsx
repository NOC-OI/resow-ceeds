import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { LayerLegendContainer } from './styles'
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons'
import { ColorBar } from '../ColorBar'
import { useRef } from 'react'
import Draggable from 'react-draggable'

interface LayerLegendProps {
  layerLegend: any
  setLayerLegend: any
}

export function DataExplorationLegend({
  layerLegend,
  setLayerLegend,
}: LayerLegendProps) {
  function handleClose() {
    setLayerLegend('')
  }

  const nodeRef = useRef(null)

  return (
    <Draggable nodeRef={nodeRef} cancel=".clickable">
      <LayerLegendContainer ref={nodeRef} id="legend-box">
        <div className="flex justify-end pb-1">
          <FontAwesomeIcon
            contentStyleType={'regular'}
            icon={faCircleXmark}
            onClick={handleClose}
            className="clickable"
          />
        </div>
        <div>
          <h1>{layerLegend.layerName}</h1>
          <div>
            {layerLegend.url ? (
              <img src={layerLegend.url} />
            ) : layerLegend.dataType ? (
              <ColorBar layerLegend={layerLegend} />
            ) : (
              layerLegend.legend[0].map((color: any, idx: any) => {
                return (
                  <div key={color} className="flex p-1">
                    <div
                      style={{ backgroundColor: color }}
                      className="rounded w-4"
                    ></div>
                    <p>{layerLegend.legend[1][idx]}</p>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </LayerLegendContainer>
    </Draggable>
  )
}
