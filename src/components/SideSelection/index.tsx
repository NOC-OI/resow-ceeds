import { ContrastSelectorContainer, SideSelectionContainer, SideSelectionLink } from "./styles";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalculator, faCamera, faLayerGroup, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Icon } from '@iconify/react';
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

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
}

interface ContrastSelectorProps{
  contrast: any,
  setContrast: any,
}

function ContrastSelector({ contrast, setContrast }: ContrastSelectorProps) {

  // const [position, setPosition] = useState(null)

  // useEffect(() => {
  //   map.on('mousemove', (e: any) => {
  //     setPosition(e.latlng)
  //   })
  // }, [map])
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


export function SideSelection({layer, setLayer, calc, setCalc, selectedLayers, setSelectedLayers, actualLayer, setActualLayer, setLayerAction, setSelectedArea, photo, setPhoto, setShowPhotos, photoId, photoPage, contrast, setContrast}: SideSelectionProps ) {

  const navigate = useNavigate();

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
  function handleShowPhotoSelection() {
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

  useEffect(() => {
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
  }, [photo])

  useEffect(() => {
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
    <>
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
        {photoPage ? <ContrastSelector contrast={contrast} setContrast={setContrast} /> : null}
      </SideSelectionContainer>
    </>
  )
}
