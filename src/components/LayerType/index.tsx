import { ArrowCircleDown, ArrowCircleUp } from "phosphor-react";
import { useRef, useState } from "react";
import { LayerTypeContainer, LayerTypeOptions } from "./styles";



interface LayerTypeProps {
  content: String
  childs: Object
  selectedLayers: Object
  setSelectedLayers: any
  actualLayer: any,
  setActualLayer: any,
  layerAction: String,
  setLayerAction: any,
}


export function LayerType({ content, childs, selectedLayers, setSelectedLayers, actualLayer, setActualLayer, layerAction, setLayerAction }: LayerTypeProps) {

  const [subLayers, setSubLayers] = useState({})

  const [isActive, setIsActive] = useState(false);

  function handleShowLayers() {
    setIsActive(isActive => !isActive)
    setSubLayers(subLayers => Object.keys(subLayers).length === 0? childs : {})
  }


  function addMapLayer(layerInfo) {
    setLayerAction('add')
    setSelectedLayers({...selectedLayers,
      [layerInfo.subLayer]: layerInfo.dataInfo
    })
  }


  function removeMapLayer(layerInfo) {
    setLayerAction('remove')
    setSelectedLayers(selectedLayers => {
      const copy = {...selectedLayers}
      delete copy[layerInfo.subLayer]
      return copy
    })
  }


  function handleChangeMapLayer(e: any) {
    const layerInfo = JSON.parse(e.target.value)
    setActualLayer(layerInfo.subLayer)
    if (e.target.checked){
      addMapLayer(layerInfo)
    } else{
      removeMapLayer(layerInfo)
    }
  }

  function verifyIfWasSelectedBefore(content, subLayer) {
    return selectedLayers[`${content}_${subLayer}`]? true : false
  }

  return (
      <LayerTypeContainer>
        <div>
          <header onClick={handleShowLayers}>
            <p>{content}</p>
            <span>
              {isActive? <ArrowCircleUp size={24} /> : <ArrowCircleDown size={24} />}
            </span>
          </header>
        </div>
        <div>
          {Object.keys(subLayers).map(subLayer => {
            return (
              <LayerTypeOptions
                key={subLayers[subLayer]['url']}>
                <label key={subLayers[subLayer]['url']}>
                  <input
                    onChange={handleChangeMapLayer}
                    value={JSON.stringify({subLayer: `${content}_${subLayer}`, dataInfo: subLayers[subLayer]})}
                    type="checkbox"
                    checked={verifyIfWasSelectedBefore(content, subLayer)}
                    id={`${content}_${subLayer}`}/>
                  <p htmlFor={`${content}_${subLayer}`}>{subLayer}</p>
                </label>
              </ LayerTypeOptions>
            )
          })}
        </div>
      </LayerTypeContainer>
  )
}
