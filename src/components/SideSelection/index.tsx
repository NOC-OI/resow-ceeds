import {
  SideSelectionContainer,
  SideSelectionLink,
  SideSelectionLinkFinal,
} from './styles'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCircleQuestion,
  faCircleUser,
  faFishFins,
  faLayerGroup,
  faTrash,
} from '@fortawesome/free-solid-svg-icons'
import { Icon } from '@iconify/react'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { GetLayers } from './loadLayers'
import { Loading } from '../Loading'
// import { ReactSVG } from 'react-svg'

// import { SpeciesInterest } from '../../assets/species-interest'
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
}: SideSelectionProps) {
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
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

  const fetchData = async () => {
    const getLayers = new GetLayers()
    await getLayers.loadCSV().then(async function () {
      setListLayers((listLayers: any) =>
        listLayers.lenght > 0 ? listLayers : getLayers.data,
      )
      setLoading(false)
    })
  }
  useEffect(() => {
    if (!photoId && window.location.pathname !== '/3d') {
      setLoading(true)
      fetchData()
    }
  }, [])

  useEffect(() => {
    if (window.location.pathname !== '/3d') {
      if (setSelectedSidebarOption === 'Data Exploration') {
        const photoList: any[] = []
        Object.keys(selectedLayers).forEach((layer: string) => {
          if (selectedLayers[layer].data_type === 'Photo') {
            selectedLayers[layer].photos.forEach((photo: any) => {
              photoList.push(photo)
            })
          }
        })
        setShowPhotos(photoList)
      } else {
        setShowPhotos([])
      }
    }
  }, [selectedSidebarOption])

  function handleEraseLayers() {
    setActualLayer(Object.keys(selectedLayers))
    setSelectedSidebarOption('')
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
        <SideSelectionLink
          title={'Indicator Species'}
          onClick={handleShowSelection}
          id={'Indicator Species'}
          className={
            selectedSidebarOption === 'Indicator Species' ? 'active' : ''
          }
        >
          <FontAwesomeIcon icon={faFishFins} />
        </SideSelectionLink>
        <SideSelectionLink
          title={'Habitats'}
          onClick={handleShowSelection}
          id={'Habitats'}
          className={selectedSidebarOption === 'Habitats' ? 'active' : ''}
        >
          <Species />
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
          title={'3D Visualization'}
          onClick={handleGoToBathymetry}
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
            <FontAwesomeIcon icon={faCircleQuestion} />
          </SideSelectionLink>
          <SideSelectionLink title={'Login'}>
            <FontAwesomeIcon icon={faCircleUser} />{' '}
          </SideSelectionLink>
        </SideSelectionLinkFinal>
        {/* {photoPage ? (
            <ContrastSelector contrast={contrast} setContrast={setContrast} />
          ) : null} */}
      </SideSelectionContainer>
      {loading ? <Loading /> : null}
    </div>
  )
}
