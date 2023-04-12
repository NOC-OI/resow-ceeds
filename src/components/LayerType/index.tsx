import { ArrowCircleDown, ArrowCircleUp } from "phosphor-react";
import { useRef, useState } from "react";
import { LayerTypeContainer, LayerTypeOptionsContainer } from "./styles";
import { faCircleInfo, faMagnifyingGlass, faSliders } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface keyable {
  [key: string]: any
}


interface LayerTypeProps {
  content: String
  childs: Object
  selectedLayers: keyable
  setSelectedLayers: any
  actualLayer: string[],
  setActualLayer: any,
  layerAction: String,
  setLayerAction: any,
}

interface LayerTypeOptionsProps {
  subLayer: any,
}

export function LayerType({ content, childs, selectedLayers, setSelectedLayers, actualLayer, setActualLayer, layerAction, setLayerAction }: LayerTypeProps) {

  const [subLayers, setSubLayers] = useState<keyable>({})

  const [isActive, setIsActive] = useState(false);

  function handleShowLayers() {
    setIsActive(isActive => !isActive)
    setSubLayers(subLayers => Object.keys(subLayers).length === 0? childs : {})
  }

  function addMapLayer(layerInfo: any) {
    setLayerAction('add')
    setSelectedLayers({...selectedLayers,
      [layerInfo.subLayer]: layerInfo.dataInfo
    })
  }


  function removeMapLayer(layerInfo: any) {
    setLayerAction('remove')
    setSelectedLayers((selectedLayers: any) => {
      const copy = {...selectedLayers}
      delete copy[layerInfo.subLayer]
      return copy
    })
  }

  function verifyIfWasSelectedBefore(content: String, subLayer: string) {
    return selectedLayers[`${content}_${subLayer}`]? true : false
  }

  function LayerTypeOptions({subLayer}: LayerTypeOptionsProps) {

    function handleChangeMapLayer(e: any) {
      const layerInfo = JSON.parse(e.target.value)
      setActualLayer([layerInfo.subLayer])
      if (e.target.checked){
        addMapLayer(layerInfo)
      } else{
        removeMapLayer(layerInfo)
      }
    }

    return (
      <LayerTypeOptionsContainer>
        <label key={subLayers[subLayer]['url']} htmlFor={`${content}_${subLayer}`}>
          <input
            onChange={handleChangeMapLayer}
            value={JSON.stringify({subLayer: `${content}_${subLayer}`, dataInfo: subLayers[subLayer]})}
            type="checkbox"
            checked={verifyIfWasSelectedBefore(content, subLayer)}
            id={`${content}_${subLayer}`}/>
          <p >{subLayer}</p>
        </label>
        { verifyIfWasSelectedBefore(content, subLayer)? (
          <div>
            <FontAwesomeIcon icon={faCircleInfo} />
            <FontAwesomeIcon icon={faMagnifyingGlass} />
            <FontAwesomeIcon name="1" icon={faSliders} />
          </div>
          ) : null
        }
      </LayerTypeOptionsContainer>
    )
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
                key={subLayers[subLayer]['url']}
                subLayer={subLayer}
              />
            )
          })}
        </div>
      </LayerTypeContainer>
  )
}

// https://mpa-ows.jncc.gov.uk/geoserver/mpa_mapper/wms?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image%2Fpng8&TRANSPARENT=true&LAYERS=prot_annexi_reef_full&TILED=TRUE&WIDTH=256&HEIGHT=256&CRS=EPSG%3A4327&STYLES=&BBOX=40%2C-10%2C50%2C2
