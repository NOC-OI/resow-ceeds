import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CardDiscription, CardImage, CardPhoto, CardPhotoActive, PhotoListContainer } from "./styles";
import { faImage } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";



interface ShowPhotoProps {
  id: number,
  url: string,
  low_res_url: string,
  title: string,
  description: string,
  active: boolean,
}


interface PhotoListProps {
  showPhotos: any,
  setShowPhotos: any,
  activePhoto: any,
  setActivePhoto: any,
  actualLayer: any,
}

export function PhotoList({showPhotos, setShowPhotos, activePhoto, setActivePhoto, actualLayer}: PhotoListProps) {

  const navigate = useNavigate();

  function handleClickImage(showPhoto: ShowPhotoProps) {
    let newActualLayer = actualLayer[0].replace(' ', '-')
    navigate(`/photos/${newActualLayer}_${showPhoto.id}`)
  }

  function handleClickCard(showPhoto: ShowPhotoProps) {
    setActivePhoto(showPhoto)
  }


  return (
    <PhotoListContainer>
      {showPhotos.map((showPhoto: ShowPhotoProps) => {
        if (showPhoto.active) {
          return (
            <CardPhotoActive key={showPhoto.id} onClick={() => handleClickCard(showPhoto)}>
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
            <CardPhoto key={showPhoto.id} onClick={() => handleClickCard(showPhoto)}>
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
