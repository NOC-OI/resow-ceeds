import { SideSelectionContainer, SideSelectionLink } from './styles'
import styles from './SideSelection.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCamera,
  faCircleQuestion,
  faDownload,
  faLayerGroup,
  faSquarePlus,
  faTrash,
} from '@fortawesome/free-solid-svg-icons'
import { Icon } from '@iconify/react'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { DataExplorationSelection } from '../DataExplorationSelection'
import { ThreeDDataExplorationSelection } from '../ThreeDDataExplorationSelection'
import { useContextHandle } from '../../lib/contextHandle'
import { DownloadSelection } from '../DownloadSelection'
import { UploadSelection } from '../UploadSelection'

interface SideSelectionProps {
  selectedSidebarOption: any
  setSelectedSidebarOption: any
  selectedLayers: any
  setSelectedLayers: any
  setActualLayer: any
  setLayerAction: any
  setShowPhotos?: any
  setShowPopup: any
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
  selectedBaseLayer: any
  setSelectedBaseLayer: any
  printBox: any
  setPrintBox: any
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
  selectedBaseLayer,
  setSelectedBaseLayer,
  printBox,
  setPrintBox,
}: SideSelectionProps) {
  const navigate = useNavigate()
  const { loading } = useContextHandle()
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
    <div id="side-selection">
      <SideSelectionContainer className={loading ? 'pointer-events-none' : ''}>
        <div className="flex gap-6">
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
            title={'Download'}
            onClick={handleShowSelection}
            id={'Download'}
            className={
              selectedSidebarOption === 'Download' ? styles.active : ''
            }
          >
            <FontAwesomeIcon icon={faDownload} />
          </SideSelectionLink>
          <SideSelectionLink
            title={'Upload'}
            onClick={handleShowSelection}
            id={'Upload'}
            className={selectedSidebarOption === 'Upload' ? styles.active : ''}
          >
            <FontAwesomeIcon icon={faSquarePlus} />
          </SideSelectionLink>
          <SideSelectionLink
            title={'Print'}
            onClick={() => setPrintBox(true)}
            id={'Print'}
            className={printBox ? styles.active : ''}
          >
            <FontAwesomeIcon icon={faCamera} />
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
              selectedBaseLayer={selectedBaseLayer}
              setSelectedBaseLayer={setSelectedBaseLayer}
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
          {selectedSidebarOption === 'Download' && (
            <DownloadSelection
              selectedLayers={selectedLayers}
              setSelectedLayers={setSelectedLayers}
              listLayers={listLayers}
            />
          )}
          {selectedSidebarOption === 'Upload' && <UploadSelection />}
        </div>
      </SideSelectionContainer>
    </div>
  )
}
