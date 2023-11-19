import { SideSelectionContainer, SideSelectionLink } from './styles'
import styles from './SideSelection.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCircleQuestion,
  faCompassDrafting,
  faLayerGroup,
  faTrash,
} from '@fortawesome/free-solid-svg-icons'
import { Icon } from '@iconify/react'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { DataExplorationSelection } from '../DataExplorationSelection'
import { ThreeDDataExplorationSelection } from '../ThreeDDataExplorationSelection'

interface SideSelectionProps {
  selectedSidebarOption: any
  setSelectedSidebarOption: any
  selectedLayers: any
  setSelectedLayers: any
  setActualLayer: any
  setLayerAction: any
  setShowPhotos?: any
  setShowPopup: any
  loading: any
  actualLayer: any
  layerAction: any
  setLayerLegend: any
  setInfoButtonBox: any
  listLayers: any
  getPolyline?: any
  setGetPolyline?: any
  setShowRange?: any
  setClickPoint?: any
  threeD?: any
  setThreeD?: any
}

export function SideSelection({
  selectedSidebarOption,
  setSelectedSidebarOption,
  selectedLayers,
  setSelectedLayers,
  setActualLayer,
  setLayerAction,
  setShowPhotos,
  setShowPopup,
  loading,
  actualLayer,
  layerAction,
  setLayerLegend,
  setInfoButtonBox,
  listLayers,
  getPolyline,
  setGetPolyline,
  setShowRange,
  setClickPoint,
  threeD,
  setThreeD,
}: SideSelectionProps) {
  const navigate = useNavigate()

  async function handleShowSelection(e: any) {
    if (
      window.location.pathname === '/3d' ||
      window.location.pathname.slice(0, 7) === '/photos'
    ) {
      navigate('/')
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
      } else {
        setShowPhotos([])
      }
    }
  }, [selectedSidebarOption])

  useEffect(() => {
    let futureShowRange = false
    Object.keys(selectedLayers).forEach((layer: string) => {
      if (selectedLayers[layer].date_range) {
        futureShowRange = true
      }
    })
    setShowRange(futureShowRange)
  }, [selectedLayers])

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
  // const rout = window.location.pathname

  return (
    <div>
      <SideSelectionContainer className={loading ? 'pointer-events-none' : ''}>
        <div className="flex">
          {/* <SideSelectionLink
            title={'Biodiversity'}
            onClick={handleShowSelection}
            id={'Biodiversity'}
            className={
              selectedSidebarOption === 'Biodiversity' ? styles.active : ''
            }
          >
            <Biodiversity />
          </SideSelectionLink> */}
          <SideSelectionLink
            title={'Suitability'}
            onClick={handleShowSelection}
            id={'Suitability'}
            className={
              selectedSidebarOption === 'Suitability' ? styles.active : ''
            }
          >
            <FontAwesomeIcon icon={faCompassDrafting} />
          </SideSelectionLink>
          <SideSelectionLink
            title={'Data Exploration'}
            onClick={handleShowSelection}
            id={'Data Exploration'}
            className={
              selectedSidebarOption === 'Data Exploration' ? styles.active : ''
            }
          >
            <FontAwesomeIcon icon={faLayerGroup} />
          </SideSelectionLink>
          <SideSelectionLink
            title={'3D Data Exploration'}
            onClick={handleGoToBathymetry}
            id={'3D Data Exploration'}
            className={selectedSidebarOption === '3D' ? styles.active : ''}
          >
            <Icon icon="bi:badge-3d-fill" />
          </SideSelectionLink>
          <SideSelectionLink title={'Clean map'} onClick={handleEraseLayers}>
            <FontAwesomeIcon icon={faTrash} />
          </SideSelectionLink>
          <SideSelectionLink title={'Information about the application'}>
            <FontAwesomeIcon
              icon={faCircleQuestion}
              onClick={handleToogleFullPagePopup}
            />
          </SideSelectionLink>
        </div>
        <div>
          {selectedSidebarOption === 'Data Exploration' && (
            <DataExplorationSelection
              selectedLayers={selectedLayers}
              setSelectedLayers={setSelectedLayers}
              actualLayer={actualLayer}
              setActualLayer={setActualLayer}
              layerAction={layerAction}
              setLayerAction={setLayerAction}
              setLayerLegend={setLayerLegend}
              setInfoButtonBox={setInfoButtonBox}
              listLayers={listLayers}
              setShowPhotos={setShowPhotos}
              getPolyline={getPolyline}
              setGetPolyline={setGetPolyline}
              setClickPoint={setClickPoint}
              showSuitability={false}
            />
          )}
          {selectedSidebarOption === 'Suitability' && (
            <DataExplorationSelection
              selectedLayers={selectedLayers}
              setSelectedLayers={setSelectedLayers}
              actualLayer={actualLayer}
              setActualLayer={setActualLayer}
              layerAction={layerAction}
              setLayerAction={setLayerAction}
              setLayerLegend={setLayerLegend}
              setInfoButtonBox={setInfoButtonBox}
              listLayers={listLayers}
              setShowPhotos={setShowPhotos}
              getPolyline={getPolyline}
              setGetPolyline={setGetPolyline}
              setClickPoint={setClickPoint}
              showSuitability={true}
            />
          )}
          {selectedSidebarOption === '3D' && (
            <ThreeDDataExplorationSelection
              selectedLayers={selectedLayers}
              setSelectedLayers={setSelectedLayers}
              setActualLayer={setActualLayer}
              layerAction={layerAction}
              setLayerAction={setLayerAction}
              setLayerLegend={setLayerLegend}
              setInfoButtonBox={setInfoButtonBox}
              listLayers={listLayers}
              threeD={threeD}
              setThreeD={setThreeD}
              showSuitability={false}
            />
          )}
        </div>
      </SideSelectionContainer>
    </div>
  )
}
