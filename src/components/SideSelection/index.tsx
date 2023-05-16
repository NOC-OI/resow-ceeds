import { ContrastSelectorContainer, SideSelectionContainer, SideSelectionLink, SideSelectionLinkFinal } from "./styles";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalculator, faCamera, faLayerGroup, faTrash, faUser, faUserShield } from "@fortawesome/free-solid-svg-icons";
import { Icon } from '@iconify/react';
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { GetPhotos } from "./loadPhotos";
import { Loading } from "../Loading";

interface keyable {
  [key: string]: any
}

interface SideSelectionProps{
  layer?: boolean,
  setLayer?: any,
  calc?: boolean,
  setCalc?: any,
  selectedLayers?: any,
  setSelectedLayers?: any,
  actualLayer?: string[],
  setActualLayer?: any,
  setLayerAction?: any,
  setSelectedArea?: any,
  photo?: boolean,
  setPhoto?: any,
  setShowPhotos?: any,
  photoId?: string,
  photoPage?: boolean,
  contrast?: boolean,
  setContrast?: any,
  listPhotos?: any,
  setListPhotos?: any,
}

interface ContrastSelectorProps{
  contrast: any,
  setContrast: any,
}

function ContrastSelector({ contrast, setContrast }: ContrastSelectorProps) {
  function handleChangeContrast() {
    setContrast((contrast: boolean) => !contrast)
  }

  return (
    <ContrastSelectorContainer>
      {/* <div>
        <FontAwesomeIcon contentStyleType={'regular'} icon={faCircleXmark} onClick={handleClose} />
      </div> */}
      <h1>CONTRAST</h1>
      <label>
        <input type="checkbox" onChange={handleChangeContrast}/>
        <span></span>
      </label>
    </ContrastSelectorContainer>
  )
}

export function SideSelection({layer, setLayer, calc, setCalc, selectedLayers, setSelectedLayers, actualLayer, setActualLayer, setLayerAction, setSelectedArea, photo, setPhoto, setShowPhotos, photoId, photoPage, contrast, setContrast, listPhotos, setListPhotos}: SideSelectionProps ) {

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false)

  function handleShowLayerSelection() {
    if (window.location.pathname === '/3d' || window.location.pathname.slice(0,7) === '/photos') {
      navigate('/')
      setPhoto(false)
      setLayer(false)
      setCalc(false)
    } else{
      setLayer((layer: any) => !layer)
      setPhoto(false)
      setSelectedArea(false)
      setCalc(false)
    }
  }

  function handleShowCalcSelection() {
    if (window.location.pathname === '/3d' || window.location.pathname.slice(0,7) === '/photos') {
      navigate('/')
      setPhoto(false)
      setLayer(false)
      setCalc(true)
    } else{
      setCalc((calc: any) => !calc)
      setPhoto(false)
      setLayer(false)
    }
  }

  async function handleShowPhotoSelection() {
    if (window.location.pathname === '/3d' || window.location.pathname.slice(0,7) === '/photos') {
      navigate('/')
      setLayer(false)
      setCalc(false)
      setPhoto(true)
    } else{
      setPhoto((photo: any) => !photo)
      setLayer(false)
      setCalc(false)

    }
  }

  const fetchData = async () => {
    const getPhotos = new GetPhotos()
    await getPhotos.loadCSV().then(async function() {
      setListPhotos(getPhotos.data)
      setLoading(false)
    })
  }

  useEffect(() => {
    if (!photoId){
      setLoading(true)
      fetchData()
    }
  }, [])

  useEffect(() => {
    if (window.location.pathname !== '/3d' ) {
      if (photo){
        const photoList: any[] = []
        Object.keys(selectedLayers).forEach((layer: string) => {
          if(selectedLayers[layer].data_type === 'Photo'){
            selectedLayers[layer].photos.forEach((photo: any) => {
              photoList.push(photo)
            })
          }
        })
        setShowPhotos(photoList)
      } else{
        setShowPhotos([])
      }
    }
  }, [photo])

  function handleEraseLayers() {
    setActualLayer(Object.keys(selectedLayers))
    setLayer(false)
    setCalc(false)
    setPhoto(false)
    setSelectedLayers({})
    setLayerAction('remove')
  }

  function handleGoToBathymetry() {
    if (window.location.pathname !== '/3d') {
      navigate('/3d')
    }
  }

  return (
    <div>
        <SideSelectionContainer>
          <SideSelectionLink onClick={handleShowLayerSelection}>
            <FontAwesomeIcon title={"Select Layers"} icon={faLayerGroup} />
          </SideSelectionLink>
          <SideSelectionLink onClick={handleShowPhotoSelection}>
            <FontAwesomeIcon title={"Select Pictures"} icon={faCamera} />
          </SideSelectionLink>
          <SideSelectionLink  onClick={handleShowCalcSelection} >
            <FontAwesomeIcon title={"Use Cases Calculations"} icon={faCalculator} />
          </SideSelectionLink>
          <SideSelectionLink onClick={handleGoToBathymetry}>
            <Icon icon="bi:badge-3d-fill" />
          </SideSelectionLink>
          <SideSelectionLink onClick={handleEraseLayers}>
            <FontAwesomeIcon title={"Clean map"} icon={faTrash} />
          </SideSelectionLink>
          <SideSelectionLinkFinal>
            <SideSelectionLink>
              <FontAwesomeIcon title={"Login"} icon={faUser}/>
            </SideSelectionLink>
          </SideSelectionLinkFinal>
          {photoPage ? <ContrastSelector contrast={contrast} setContrast={setContrast} /> : null}
        </SideSelectionContainer>
        {loading ? <Loading/> : null }
    </div>
  )
}

