import { ArrowCircleDown, ArrowCircleUp } from "phosphor-react";
import { useEffect, useRef, useState } from "react";
import { faCircleInfo, faList, faMagnifyingGlass, faSliders } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { PhotoTypeContainer, PhotoTypeOptionsContainer } from "./styles";
import axios from 'axios';

interface keyable {
  [key: string]: any
}


interface PhotoTypeProps {
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
  setShowPhotos: any,
}

interface PhotoTypeOptionsProps {
  subLayer: any,
}


export function PhotoType({ content, childs, selectedLayers, setSelectedLayers, actualLayer, setActualLayer, layerAction, setLayerAction, layerLegend, setLayerLegend, setShowPhotos }: PhotoTypeProps) {

  const [subLayers, setSubLayers] = useState<keyable>({})

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

  // async function getPhotoLayer(newSelectedLayer: any) {
  //   await newSelectedLayer.photos.forEach(async (photo: any, idx: any) => {
  //     if (photo.local_data_type === 'Marker-COG'){
  //       const TITILER_URL = import.meta.env.VITE_TITILER_URL;
  //       await axios.get(`${TITILER_URL}/cog/info?url=${encodeURIComponent(photo.url)}`).then(r =>{
  //         const position = [(r.data.bounds[3] + r.data.bounds[1])/2, (r.data.bounds[2] + r.data.bounds[0])/2]
  //         newSelectedLayer.photos[idx].position = position
  //       })
  //     }
  //   });
  //   return newSelectedLayer
  // }

  async function addMapLayer(layerInfo: any) {
    setLayerAction('add')
    const newSelectedLayer = layerInfo.dataInfo
    newSelectedLayer.opacity = defaultOpacity
    newSelectedLayer.zoom = true
    setSelectedLayers({...selectedLayers,
      [layerInfo.subLayer]: newSelectedLayer
    })
    // if (newSelectedLayer.data_type === 'Photo'){
    //   await getPhotoLayer(newSelectedLayer).then(layer => {
    //     setSelectedLayers({...selectedLayers,
    //       [layerInfo.subLayer]: layer
    //     })
    //   })
    // } else{
    //   setSelectedLayers({...selectedLayers,
    //     [layerInfo.subLayer]: newSelectedLayer
    //   })
    // }
  }

  useEffect(() => {
    if (layerAction){
      const photoList: any[] = []
      Object.keys(selectedLayers).forEach(layer => {
        if(selectedLayers[layer].data_type === 'Photo'){
          selectedLayers[layer].photos.forEach((photo: any) => {
            photo.layerName = actualLayer[0]
            photoList.push(photo)
          })
        }
      })
      setShowPhotos(photoList)
    }
  }, [selectedLayers])



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

  function PhotoTypeOptions({subLayer}: PhotoTypeOptionsProps) {

    async function handleChangeMapLayer(e: any) {
      const layerInfo = JSON.parse(e.target.value)
      setActualLayer([layerInfo.subLayer])
      if (e.target.checked){
        await addMapLayer(layerInfo)
      } else{
        removeMapLayer(layerInfo)
      }
    }

    function handleClickZoom() {
      let layerInfo = JSON.parse(JSON.stringify({subLayer: `${content}_${subLayer}`, dataInfo: subLayers[subLayer]}))
      setActualLayer([layerInfo.subLayer])
      changeMapZoom(layerInfo)
    }

    return (
      <PhotoTypeOptionsContainer>
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
                icon={faMagnifyingGlass}
                title="Zoom to the layer"
                onClick={handleClickZoom}
              />
            </div>
            ) : null
          }
        </div>
      </PhotoTypeOptionsContainer>
    )
  }

  return (
      <PhotoTypeContainer>
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
              <PhotoTypeOptions
                key={`${content}_${subLayer}`}
                subLayer={subLayer}
              />
            )
          })}
        </div>
      </PhotoTypeContainer>
  )
}
