import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CardDiscription, CardImage, CardPhoto, CardPhotoActive, PhotoListContainer } from "./styles";
import { faImage } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";



interface ShowPhotoProps {
  id: number,
  url: string,
  low_res_url: string,
  title: string,
  description: string,
  active: boolean,
  layerName: string,
}


interface PhotoListProps {
  showPhotos: any,
  setShowPhotos: any,
  activePhoto: any,
  setActivePhoto: any,
  mapBounds: any,
}

export function PhotoList({showPhotos, setShowPhotos, activePhoto, setActivePhoto, mapBounds }: PhotoListProps) {

  const navigate = useNavigate();

  function handleClickImage(showPhoto: ShowPhotoProps) {
    let newActualLayer = showPhoto.layerName.replace(' ', '-')
    navigate(`/photos/${newActualLayer}_${showPhoto.id}`)
  }

  function handleClickCard(showPhoto: ShowPhotoProps, idx: number) {
    setActivePhoto(showPhoto)
  }
  const [localPhotoList, setLocalPhotoList] = useState(showPhotos)

  function reorderPhotos() {
    const shuffled = showPhotos.sort(() => 0.5 - Math.random());
    const n = shuffled.length > 10? 10: shuffled.length
    const newList: any = []
    let count: number = 0
    if (activePhoto){
      count++
      newList.push(activePhoto)        
    }
    let lat = [mapBounds._southWest.lat, mapBounds._northEast.lat]
    let lng = [mapBounds._southWest.lng, mapBounds._northEast.lng]
    shuffled.every((el: any) => {

      if (count >= n) {
        return false // "break"
      }
      if (el.description !== activePhoto.description){
        if (el.position){
          if (el.position[0] > lat[0] && el.position[0] < lat[1] && el.position[1] > lng[0] && el.position[1] < lng[1]){
            newList.push(el)
            count++
          }
        } else {
          newList.push(el)
          count++
        }
      }
      return true
    });
    return newList
  }



  useEffect(() => {
    if (showPhotos){
      const newList = reorderPhotos()
      setLocalPhotoList(newList)
    }
  }, [mapBounds])

  useEffect(() => {
    if (activePhoto){
      const newList = reorderPhotos()
      setLocalPhotoList(newList)
    }
  }, [showPhotos])

  return (
    <PhotoListContainer>
      {localPhotoList.map((showPhoto: ShowPhotoProps, idx: number) => {
      // {shuffled.slice(0, n).map((showPhoto: ShowPhotoProps) => {
        showPhoto.low_res_url = `${showPhoto.url.slice(0,-4)}.png`
        if (showPhoto.active) {
          return (
            <CardPhotoActive key={showPhoto.id} onClick={() => handleClickCard(showPhoto, idx)}>
              <CardImage>
                <img src={showPhoto.low_res_url} />
              </CardImage>
              <div>
                <CardDiscription>
                  <h2>{showPhoto.title}</h2>
                  <p>{showPhoto.description}</p>
                  <p title={'Show Image on Map'}>
                    <FontAwesomeIcon
                      icon={faImage}
                      onClick={() => handleClickImage(showPhoto)}
                    />
                  </p>
                </CardDiscription>
              </div>
            </CardPhotoActive>
          )
        } else {
          return (
            <CardPhoto key={showPhoto.id} onClick={() => handleClickCard(showPhoto, idx)}>
              <CardImage>
                <img src={showPhoto.low_res_url} />
              </CardImage>
              <div>
                <CardDiscription>
                  <h2>{showPhoto.title}</h2>
                  <p>{showPhoto.description}</p>
                  <p title={'Show Image on Map'}>
                    <FontAwesomeIcon
                      onClick={() => handleClickImage(showPhoto)}
                      icon={faImage}
                    />
                  </p>
                </CardDiscription>
              </div>
            </CardPhoto>
          )
        }
      })}
    </PhotoListContainer>
  )
}
