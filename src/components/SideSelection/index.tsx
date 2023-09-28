import {
  SideSelectionContainer,
  SideSelectionLink,
  SideSelectionLinkFinal,
} from './styles'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCircleQuestion,
  faCircleUser,
  faCompassDrafting,
  faFishFins,
  faLayerGroup,
  faTrash,
} from '@fortawesome/free-solid-svg-icons'
import { Icon } from '@iconify/react'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { Biodiversity } from '../../assets/biodiversity'
import { Species } from '../../assets/species'

interface SideSelectionProps {
  selectedSidebarOption?: string
  setSelectedSidebarOption?: any
  selectedLayers?: any
  setSelectedLayers?: any
  actualLayer?: string[]
  setActualLayer?: any
  setLayerAction?: any
  setSelectedArea?: any
  setShowPhotos?: any
  photoId?: string
  photoPage?: boolean
  contrast?: boolean
  setContrast?: any
  listLayers?: any
  setListLayers?: any
  showPopup?: any
  setShowPopup?: any
  showLogin?: any
  setShowLogin?: any
  isLogged?: any
  loading?: any
}

// interface ContrastSelectorProps {
//   contrast: any
//   setContrast: any
// }

// function ContrastSelector({ contrast, setContrast }: ContrastSelectorProps) {
//   function handleChangeContrast() {
//     setContrast((contrast: boolean) => !contrast)
//   }

//   return (
//     <ContrastSelectorContainer>
//       <h1>CONTRAST</h1>
//       <label>
//         <input type="checkbox" onChange={handleChangeContrast} />
//         <span></span>
//       </label>
//     </ContrastSelectorContainer>
//   )
// }

export function SideSelection({
  selectedSidebarOption,
  setSelectedSidebarOption,
  selectedLayers,
  setSelectedLayers,
  actualLayer,
  setActualLayer,
  setLayerAction,
  setSelectedArea,
  setShowPhotos,
  photoId,
  photoPage,
  contrast,
  setContrast,
  listLayers,
  setListLayers,
  showPopup,
  setShowPopup,
  showLogin,
  setShowLogin,
  isLogged,
  loading,
}: SideSelectionProps) {
  const navigate = useNavigate()

  async function handleShowSelection(e: any) {
    if (
      window.location.pathname === '/3d' ||
      window.location.pathname.slice(0, 7) === '/photos'
    ) {
      navigate('/')
      // setSelectedSidebarOption(e.currentTarget.id)
    } else {
      const oldSelectedSidebarOption = selectedSidebarOption
      if (oldSelectedSidebarOption === e.currentTarget.id) {
        setSelectedSidebarOption('')
      } else {
        setSelectedSidebarOption(e.currentTarget.id)
      }
    }
  }

  useEffect(() => {
    if (window.location.pathname !== '/3d') {
      if (selectedSidebarOption === 'Data Exploration') {
        const photoList: any[] = []
        Object.keys(selectedLayers).forEach((layer: string) => {
          if (selectedLayers[layer].data_type === 'Photo') {
            selectedLayers[layer].photos.forEach((photo: any) => {
              photoList.push(photo)
            })
          }
        })
        setShowPhotos([])
        // setShowPhotos(photoList)
      } else {
        setShowPhotos([])
      }
    }
  }, [selectedSidebarOption])

  function handleEraseLayers() {
    setActualLayer(Object.keys(selectedLayers))
    setSelectedLayers({})
    setLayerAction('remove')
  }

  function handleGoToBathymetry() {
    if (window.location.pathname !== '/3d') {
      navigate('/3d')
    } else {
      setSelectedSidebarOption((selectedSidebarOption: string) =>
        selectedSidebarOption ? '' : '3D',
      )
    }
  }

  function handleToogleFullPagePopup() {
    setShowPopup((showPopup: any) => !showPopup)
  }

  function handleToogleLoginPopup() {
    setShowLogin((showLogin: any) => !showLogin)
  }
  return (
    <div>
      <SideSelectionContainer className={loading ? 'pointer-events-none' : ''}>
        <SideSelectionLink
          title={'Seabed Types'}
          onClick={handleShowSelection}
          id={'Seabed Types'}
          className={selectedSidebarOption === 'Seabed Types' ? 'active' : ''}
        >
          <Species />
        </SideSelectionLink>
        <SideSelectionLink
          title={'Species of Interest'}
          onClick={handleShowSelection}
          id={'Species of Interest'}
          className={
            selectedSidebarOption === 'Species of Interest' ? 'active' : ''
          }
        >
          <FontAwesomeIcon icon={faFishFins} />
        </SideSelectionLink>
        <SideSelectionLink
          title={'Biodiversity'}
          onClick={handleShowSelection}
          id={'Biodiversity'}
          className={selectedSidebarOption === 'Biodiversity' ? 'active' : ''}
        >
          <Biodiversity />
        </SideSelectionLink>
        <SideSelectionLink
          title={'Survey Design'}
          onClick={handleShowSelection}
          id={'Survey Design'}
          className={selectedSidebarOption === 'Survey Design' ? 'active' : ''}
        >
          <FontAwesomeIcon icon={faCompassDrafting} />
        </SideSelectionLink>
        <SideSelectionLink
          title={'Data Exploration'}
          onClick={handleShowSelection}
          id={'Data Exploration'}
          className={
            selectedSidebarOption === 'Data Exploration' ? 'active' : ''
          }
        >
          <FontAwesomeIcon icon={faLayerGroup} />
        </SideSelectionLink>
        <SideSelectionLink
          title={'3D Data Exploration'}
          onClick={handleGoToBathymetry}
          id={'3D Data Exploration'}
          className={selectedSidebarOption === '3D' ? 'active' : ''}
        >
          <Icon icon="bi:badge-3d-fill" />
        </SideSelectionLink>
        <SideSelectionLink title={'Clean map'} onClick={handleEraseLayers}>
          <FontAwesomeIcon icon={faTrash} />
        </SideSelectionLink>
        <SideSelectionLinkFinal>
          {/* <SideSelectionLink
            title={'Select Pictures'}
            onClick={handleShowSelection}
            id={'Select Pictures'}
            className={
              selectedSidebarOption === 'Select Pictures' ? 'active' : ''
            }
          >
            <FontAwesomeIcon icon={faCamera} />
          </SideSelectionLink>
          <SideSelectionLink
            title={'Use Cases Calculations'}
            onClick={handleShowSelection}
            id={'Use Cases Calculations'}
            className={
              selectedSidebarOption === 'Use Cases Calculations' ? 'active' : ''
            }
          >
            <FontAwesomeIcon icon={faCalculator} />
          </SideSelectionLink> */}
          <SideSelectionLink title={'Information about the application'}>
            <FontAwesomeIcon
              icon={faCircleQuestion}
              onClick={handleToogleFullPagePopup}
            />
          </SideSelectionLink>
          <SideSelectionLink title={isLogged ? 'Logout' : 'Login'}>
            <FontAwesomeIcon
              icon={faCircleUser}
              onClick={handleToogleLoginPopup}
            />
          </SideSelectionLink>
        </SideSelectionLinkFinal>
        {/* {photoPage ? (
            <ContrastSelector contrast={contrast} setContrast={setContrast} />
          ) : null} */}
      </SideSelectionContainer>
    </div>
  )
}
