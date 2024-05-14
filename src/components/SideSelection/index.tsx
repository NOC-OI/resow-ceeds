import { SideSelectionContainer, SideSelectionLink } from './styles'
import styles from './SideSelection.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCamera,
  faCircleQuestion,
  faDownload,
  faLayerGroup,
  faSquareCheck,
  faSquarePlus,
  faTrash,
} from '@fortawesome/free-solid-svg-icons'
import { useEffect } from 'react'
import { DataExplorationSelection } from '../DataExplorationSelection'
import { ThreeDDataExplorationSelection } from '../ThreeDDataExplorationSelection'
import { useContextHandle } from '../../lib/contextHandle'
import { DownloadSelection } from '../DownloadSelection'
import { UploadSelection } from '../UploadSelection'
import { useUploadDataHandle } from '../../lib/data/uploadDataManagement'
import { useDownloadManagementHandle } from '../../lib/data/downloadManagement'
import { SelectedLayersTab } from '../SelectedLayersTab'

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
  layerLegend: any
  setLayerLegend: any
  setInfoButtonBox: any
  listLayers: any
  getPolyline?: any
  setGetPolyline?: any
  setShowRange?: any
  setClickPoint?: any
  threeD?: any
  setThreeD?: any
  selectedBaseLayer?: any
  setSelectedBaseLayer?: any
  printBox: any
  setPrintBox: any
  setDownloadPopup: any
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
  layerLegend,
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
  setDownloadPopup,
}: SideSelectionProps) {
  const { loading } = useContextHandle()
  const { setSelectedLayersUpload } = useUploadDataHandle()
  const { setDrawRectangle, setRectangleLimits } = useDownloadManagementHandle()
  async function handleShowSelection(e: any) {
    const oldSelectedSidebarOption = selectedSidebarOption
    if (oldSelectedSidebarOption === e.currentTarget.id) {
      setSelectedSidebarOption('')
    } else {
      setSelectedSidebarOption(e.currentTarget.id)
    }
  }

  useEffect(() => {
    if (window.location.pathname !== '/3d') {
      if (selectedSidebarOption === 'data_exploration') {
        const photoList: any[] = []
        Object.keys(selectedLayers).forEach((layer: string) => {
          if (selectedLayers[layer].dataType === 'Photo') {
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
    if (selectedSidebarOption !== 'Download') {
      setRectangleLimits(null)
      setDrawRectangle(false)
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
    setSelectedLayersUpload({})
    setLayerLegend('')
    setLayerAction('remove')
  }

  // function handleGoToBathymetry() {
  //   if (window.location.pathname !== '/3d') {
  //     navigate('/3d')
  //   } else {
  //     setSelectedSidebarOption((selectedSidebarOption: string) =>
  //       selectedSidebarOption ? '' : '3D',
  //     )
  //   }
  // }
  const rout = window.location.pathname

  function handleToogleFullPagePopup() {
    setShowPopup((showPopup: any) => !showPopup)
  }

  return (
    <div id="side-selection">
      <SideSelectionContainer className={loading ? 'pointer-events-none' : ''}>
        <div className="flex gap-3 md:gap-6 pl-2 pr-2">
          <SideSelectionLink
            title={'Data Exploration'}
            onClick={handleShowSelection}
            id={'data_exploration'}
            className={
              selectedSidebarOption === 'data_exploration' ? styles.active : ''
            }
            // id="data_exploration"
          >
            <FontAwesomeIcon icon={faLayerGroup} />
          </SideSelectionLink>
          <SideSelectionLink
            title={'Selected Layers'}
            onClick={handleShowSelection}
            id={'selected_layers'}
            className={
              selectedSidebarOption === 'selected_layers' ? styles.active : ''
            }
            // id="data_exploration"
          >
            <FontAwesomeIcon icon={faSquareCheck} />
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
            title={'Clean map'}
            id="clean_map"
            onClick={handleEraseLayers}
          >
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
          {selectedSidebarOption === 'data_exploration' &&
            (rout === '/' ? (
              <DataExplorationSelection
                selectedLayers={selectedLayers}
                setSelectedLayers={setSelectedLayers}
                actualLayer={actualLayer}
                setActualLayer={setActualLayer}
                layerAction={layerAction}
                setLayerAction={setLayerAction}
                layerLegend={layerLegend}
                setLayerLegend={setLayerLegend}
                setInfoButtonBox={setInfoButtonBox}
                listLayers={listLayers}
                setShowPhotos={setShowPhotos}
                getPolyline={getPolyline}
                setGetPolyline={setGetPolyline}
                setClickPoint={setClickPoint}
                selectedBaseLayer={selectedBaseLayer}
                setSelectedBaseLayer={setSelectedBaseLayer}
                setDownloadPopup={setDownloadPopup}
              />
            ) : rout === '/3d' ? (
              <ThreeDDataExplorationSelection
                selectedLayers={selectedLayers}
                setSelectedLayers={setSelectedLayers}
                setActualLayer={setActualLayer}
                layerAction={layerAction}
                setLayerAction={setLayerAction}
                layerLegend={layerLegend}
                setLayerLegend={setLayerLegend}
                setInfoButtonBox={setInfoButtonBox}
                listLayers={listLayers}
                threeD={threeD}
                setThreeD={setThreeD}
                setDownloadPopup={setDownloadPopup}
              />
            ) : null)}
          {selectedSidebarOption === 'selected_layers' && (
            <SelectedLayersTab
              selectedLayers={selectedLayers}
              setSelectedLayers={setSelectedLayers}
              actualLayer={actualLayer}
              setActualLayer={setActualLayer}
              layerAction={layerAction}
              setLayerAction={setLayerAction}
              layerLegend={layerLegend}
              setLayerLegend={setLayerLegend}
              setInfoButtonBox={setInfoButtonBox}
              listLayers={listLayers}
              getPolyline={getPolyline}
              setGetPolyline={setGetPolyline}
              setClickPoint={setClickPoint}
              setDownloadPopup={setDownloadPopup}
            />
          )}
          {selectedSidebarOption === 'Download' && (
            <DownloadSelection
              selectedLayers={selectedLayers}
              setSelectedLayers={setSelectedLayers}
              listLayers={listLayers}
              setDownloadPopup={setDownloadPopup}
            />
          )}
          {selectedSidebarOption === 'Upload' && (
            <UploadSelection
              layerAction={layerAction}
              setLayerAction={setLayerAction}
              layerLegend={layerLegend}
              setLayerLegend={setLayerLegend}
            />
          )}
        </div>
      </SideSelectionContainer>
    </div>
  )
}
