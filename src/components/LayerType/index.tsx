import { ArrowCircleDown, ArrowCircleUp } from "phosphor-react";
import { useRef, useState } from "react";
import { LayerTypeContainer, LayerTypeOptionsContainer } from "./styles";
import { faCircleInfo, faList, faMagnifyingGlass, faSliders } from "@fortawesome/free-solid-svg-icons";
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
  layerLegend: any,
  setLayerLegend: any,
}

interface LayerTypeOptionsProps {
  subLayer: any,
}


export function LayerType({ content, childs, selectedLayers, setSelectedLayers, actualLayer, setActualLayer, layerAction, setLayerAction, layerLegend, setLayerLegend }: LayerTypeProps) {

  const [subLayers, setSubLayers] = useState<keyable>({})

  const [activeOpacity, setActiveOpacity] = useState(null)

  const [isActive, setIsActive] = useState(false);

  const defaultOpacity = 0.7
  function handleShowLayers() {
    setIsActive(isActive => !isActive)
    setSubLayers(subLayers => Object.keys(subLayers).length === 0? childs : {})
  }

  function changeMapZoom(layerInfo: any) {
    setLayerAction('zoom')
    const newSelectedLayer = selectedLayers[layerInfo.subLayer]
    setSelectedLayers((selectedLayers: any) => {
      const copy = {...selectedLayers}
      delete copy[layerInfo.subLayer]
      return {[layerInfo.subLayer]: newSelectedLayer,...copy}
    })
  }

  function changeMapOpacity(layerInfo: any, opacity: number) {
    setLayerAction('opacity')
    const newSelectedLayer = layerInfo.dataInfo
    newSelectedLayer.opacity = opacity
    newSelectedLayer.zoom = true
    setSelectedLayers((selectedLayers: any) => {
      const copy = {...selectedLayers}
      delete copy[layerInfo.subLayer]
      return {[layerInfo.subLayer]: newSelectedLayer,...copy}
    })
  }


  function addMapLayer(layerInfo: any) {
    setLayerAction('add')
    const newSelectedLayer = layerInfo.dataInfo
    newSelectedLayer.opacity = defaultOpacity
    newSelectedLayer.zoom = true
    setSelectedLayers({...selectedLayers,
      [layerInfo.subLayer]: newSelectedLayer
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

  function getPreviousOpacityValue(content: String, subLayer: string) {
    return selectedLayers[`${content}_${subLayer}`].opacity
  }


  function LayerTypeOptions({subLayer}: LayerTypeOptionsProps) {

    const [opacityIsClicked, setOpacityIsClicked] = useState(
      activeOpacity === `${content}_${subLayer}` ? true : false
    );

    function handleChangeMapLayer(e: any) {
      const layerInfo = JSON.parse(e.target.value)
      setActualLayer([layerInfo.subLayer])
      if (e.target.checked){
        addMapLayer(layerInfo)
      } else{
        setOpacityIsClicked(false)
        setActiveOpacity(null)
        removeMapLayer(layerInfo)
      }
    }

    function handleClickZoom() {
      let layerInfo = JSON.parse(JSON.stringify({subLayer: `${content}_${subLayer}`, dataInfo: subLayers[subLayer]}))
      setActiveOpacity( opacityIsClicked? layerInfo.subLayer: null)
      setActualLayer([layerInfo.subLayer])
      changeMapZoom(layerInfo)
    }

    async function handleClickLegend(){
      let newParams = subLayers[subLayer].params
      newParams.request = 'GetLegendGraphic'
      newParams.layer = newParams.layers
      console.log(subLayer)
      async function getURILegend(newParams: any) {
        const response = await fetch(subLayers[subLayer].url + new URLSearchParams(newParams))
        const url = response.url;
        setLayerLegend({layerName: subLayer, url: url})
      }
      await getURILegend(newParams)

    }

    function handleClickSlider() {
      setOpacityIsClicked((opacityIsClicked) => !opacityIsClicked)
    }

    function handleChangeOpacity(e: any) {
      let layerInfo = JSON.parse(JSON.stringify({subLayer: `${content}_${subLayer}`, dataInfo: subLayers[subLayer]}))
      setActiveOpacity(layerInfo.subLayer)
      setActualLayer([layerInfo.subLayer])
      changeMapOpacity(layerInfo, e.target.value)
    }

    return (
      <LayerTypeOptionsContainer>
        <div>
          <label key={`${content}_${subLayer}`} htmlFor={`${content}_${subLayer}`}>
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
              <FontAwesomeIcon
                icon={faList}
                title="Show Legend"
                onClick={handleClickLegend}
              />
              <FontAwesomeIcon
                icon={faMagnifyingGlass}
                title="Zoom to the layer"
                onClick={handleClickZoom}
              />
              <FontAwesomeIcon
                icon={faSliders}
                title="Change Opacity"
                onClick={handleClickSlider}
              />
            </div>
            ) : null
          }
        </div>
        { opacityIsClicked ? (
          <input type="range"
            step={0.1}
            min={0}
            max={1}
            value={getPreviousOpacityValue(content, subLayer)}
            onChange={handleChangeOpacity}
          />
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
                key={`${content}_${subLayer}`}
                subLayer={subLayer}
              />
            )
          })}
        </div>
      </LayerTypeContainer>
  )
}
