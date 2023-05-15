import { ArrowCircleDown, ArrowCircleUp } from "phosphor-react";
import { useEffect, useRef, useState } from "react";
import { faCircleInfo, faList, faMagnifyingGlass, faSliders } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AnnotationsContainer, PhotoTypeContainer, PhotoTypeOptionsContainer } from "./styles";
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

  const organisms = ['antedon', 'anthozoa', 'anthozoa_01', 'anthozoa_03', 'anthozoa_05',
    'anthozoa_06', 'anthozoa_07', 'anthozoa_08', 'anthozoa_11', 'anthozoa_16',
    'anthozoa_19', 'anthozoa_24', 'anthozoa_34', 'anthozoa_39', 'asterias_rubens',
    'asteroid_01', 'asteroid_07', 'asteroidea', 'astropecten_irregularis',
    'axinellidae', 'bolocera', 'bryozoa_01', 'callionymus', 'caryophyllia_smithii',
    'cerianthid_01', 'cerianthid_03', 'echinoid_01', 'echinoidea', 'echinus_esculentus',
    'eledone_02', 'eledone_cirrhosa', 'fish', 'fish_10', 'flatfish', 'gadidae',
    'gadiforme_09', 'gaidropsarus_vulgaris', 'galeus', 'hippoglossoides_platessoides',
    'hydroid_01', 'inachidae_01', 'inachidae_02', 'INDETERMINATE', 'indeterminate_29',
    'indeterminate_36', 'lepidorhombus_whiffiagonis', 'leucoraja_naevus', 'liocarcinus',
    'lithodes_maja', 'luidia_ciliaris', 'luidia_sarsii', 'marthasterias_glacialis',
    'microchirus_variegatus', 'munida', 'ophiuroid_01', 'ophiuroid_02', 'paguridae_01',
    'paguridae_02', 'parazoanthus', 'pentapora_foliacea', 'porania_pulvillus',
    'porcellanidae', 'porella', 'porifera_02', 'porifera_03', 'porifera_20',
    'porifera_22', 'porifera_23', 'porifera_24', 'porifera_25', 'rajidae_01',
    'reteporella', 'salmacina_dysteri', 'scyliorhinus_canicula', 'squid',
    'stichastrella_rosea', 'urticina'
  ]

  const [annotations, setAnnotations] = useState<string[]>([])
  const [annotationsAll, setAnnotationsAll] = useState<boolean>(true)

  const [showAnnotations, setShowAnnotations] = useState<boolean>(false)

  const defaultOpacity = 0.7
  function handleShowLayers() {
    setIsActive(isActive => !isActive)
    setSubLayers(subLayers => Object.keys(subLayers).length === 0? childs : {})
  }

  // useEffect(() => {
  //   if (layerAction){
  //     if (annotationsAll){
  //       set
        
  //     }
  //     // const photoList: any[] = []
  //     // Object.keys(selectedLayers).forEach(layer => {
  //     //   if(selectedLayers[layer].data_type === 'Photo'){
  //     //     selectedLayers[layer].photos.forEach((photo: any) => {
  //     //       photo.layerName = actualLayer[0]
  //     //       photoList.push(photo)
  //     //     })
  //     //   }
  //     // })
  //     // setShowPhotos(photoList)
  //   }
  // }, [annotationsAll])


  function Annotations(layerInfo: any){

    function changeMapMarkers() {
      setLayerAction('marker-changes')
      const newSelectedLayer = selectedLayers[`${layerInfo.content}_${layerInfo.subLayer}`]
      newSelectedLayer.show = []
      newSelectedLayer.photos.map((photo: any) => {
        if (annotationsAll){
          photo.show=true
          newSelectedLayer.show.push(photo.FileName)
        }else{
          photo.show=false
        }
      })
      setSelectedLayers((selectedLayers: any) => {
        const copy = {...selectedLayers}
        delete copy[layerInfo.subLayer]
        return {[layerInfo.subLayer]: newSelectedLayer,...copy}
      })
    }
    
    function handleChangeAllPhotos(){
      setAnnotations((annotations:any) => annotations.length > 0? [] : organisms)
      setAnnotationsAll((annotationsAll) => !annotationsAll)
      setActualLayer([subLayers.sublayer])

      changeMapMarkers()
    }
    console.log(layerInfo)

    let c = 1
    return (
      <AnnotationsContainer>
        <div key={`${layerInfo.content}_${layerInfo.subLayer}_ALL`}>
          <input
            onChange={handleChangeAllPhotos}
            value={'SELECT ALL'}
            type="checkbox"
            checked={annotationsAll? true: false}
          />
          <p >{'ALL'}</p>
        </div>
        {organisms.map(organism => {
          return (
            <div key={`${layerInfo.content}_${layerInfo.subLayer}_${organism}_${c++}`} >
              <input
                onChange={handleChangeAllPhotos}
                value={organism}
                type="checkbox"
                checked={annotations.includes(organism)? true: false}
              />
              <p>{organism}</p>
            </div>
          )
        })}
      </AnnotationsContainer>
    )
  }


  async function addMapLayer(layerInfo: any) {
    setLayerAction('add')
    const newSelectedLayer = layerInfo.dataInfo
    newSelectedLayer.opacity = defaultOpacity
    newSelectedLayer.zoom = true
    setSelectedLayers({...selectedLayers,
      [layerInfo.subLayer]: newSelectedLayer
    })
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
        setAnnotations(organisms)
        await addMapLayer(layerInfo)
      } else{
        setAnnotations([])
        setShowAnnotations(false)
        removeMapLayer(layerInfo)
      }
    }

    function handleClickAnnotations() {
      setShowAnnotations((showAnnotations) => !showAnnotations)
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
                icon={faSliders}
                title="Select by Annotations"
                onClick={handleClickAnnotations}
              />
            </div>
            ) : null
          }
        </div>
        { showAnnotations ? (
          <Annotations
            key={`${content}_${subLayer}`}
            subLayer={subLayer}
            content={content}
          />
        ): null}
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
