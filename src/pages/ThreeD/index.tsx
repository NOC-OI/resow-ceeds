import { ThreeDContainer } from './styles'
import { useEffect, useState } from 'react'
import { SideSelection } from '../../components/SideSelection'
import { BottomBar, SideBar } from '../Home/styles'
import { ThreeDMap } from '../../components/ThreeDMap'
import { FullPagePopup } from '../../components/FullPagePopup'
import { InfoButtonBox } from '../../components/InfoButtonBox'
import { DataExplorationLegend } from '../../components/DataExplorationLegend'
import { GetLayers } from '../../data/loadLayers'
import { RangeSelection } from '../../components/RangeSelection'
import { yearMonths } from '../../data/yearMonths'
import { DownloadManagementHandleProvider } from '../../lib/data/downloadManagement'
import { UploadDataHandleProvider } from '../../lib/data/uploadDataManagement'
import { PrintSelection } from '../../components/PrintSelection'
import { InfoBox } from '../../components/InfoBox'
import { useContextHandle } from '../../lib/contextHandle'
import { usePrintPageHandle } from '../../lib/data/printPageManagement'
import { PrintSelectionArea } from '../../components/PrintSelectionArea'
import { bathymetryUrl, getGeorasterLayer } from '../../lib/map/utils'
import { DownloadPopup } from '../../components/DownloadPopup'
import { DimensionsToogle } from '../../components/DimensionsToogle'
import Joyride from 'react-joyride'

export function ThreeD() {
  const steps = [
    {
      target: '#data_exploration',
      content: 'Here you can explore the layers',
    },
    {
      target: '#Download',
      content: 'Here you can select areas and download data',
    },
    {
      target: '#Upload',
      content: 'Here you can upload data',
    },
    {
      target: '#Print',
      content: 'Here you can select areas of the map and save as images',
    },
    {
      target: '#clean_map',
      content: 'Here you remove all layers from the map',
    },
    {
      target: '#dimensions_toogle',
      content: 'Here you can switch between 2D and 3D map',
    },
  ]

  const [showTutorial, setShowTutorial] = useState(false)
  const handleJoyrideCallback = (data) => {
    const { status } = data
    const finishedStatus = 'finished'
    const skippedStatus = 'skipped'
    if (status === finishedStatus || status === skippedStatus) {
      setShowTutorial(false)
    }
  }
  const [selectedSidebarOption, setSelectedSidebarOption] = useState<string>('')
  const { setLoading } = useContextHandle()
  const { canSelect } = usePrintPageHandle()
  const [threeD, setThreeD] = useState(null)
  const [depth, setDepth] = useState({})
  const [position, setPosition] = useState(null)
  const [actualDate, setActualDate] = useState(yearMonths.indexOf('2021-05'))

  const [selectedLayers, setSelectedLayers] = useState<any>({})

  const [actualLayer, setActualLayer] = useState<string[]>([''])

  const [layerAction, setLayerAction] = useState('')

  const [layerLegend, setLayerLegend] = useState({})

  const [printBox, setPrintBox] = useState(false)

  const [infoButtonBox, setInfoButtonBox] = useState({})

  const [showRange, setShowRange] = useState(false)

  const [listLayers, setListLayers] = useState([])

  const [showPopup, setShowPopup] = useState(false)
  // const [activePhoto, setActivePhoto] = useState('')
  const [downloadPopup, setDownloadPopup] = useState({})
  const [threeDLayer, setThreeDLayer] = useState({})

  const fetchData = async () => {
    const rout = window.location.pathname
    const getLayers = new GetLayers(rout)
    await getLayers.loadJsonLayers().then(async function () {
      setListLayers((listLayers: any) =>
        listLayers.lenght > 0 ? listLayers : getLayers.data,
      )
      setLoading(false)
    })
  }
  const [batLayer, setBatLayer] = useState(null)
  useEffect(() => {
    async function fetchLayer() {
      const layer = await getGeorasterLayer(bathymetryUrl)
      setBatLayer(layer)
    }
    fetchLayer()
  }, [bathymetryUrl])
  useEffect(() => {
    fetchData()
  }, [])
  return (
    <DownloadManagementHandleProvider>
      <UploadDataHandleProvider>
        <ThreeDContainer>
          {showTutorial && (
            <Joyride
              steps={steps}
              callback={handleJoyrideCallback}
              styles={{
                options: {
                  zIndex: 99999,
                  arrowColor: 'rgba(17,17,17,0.7)',
                  backgroundColor: 'rgba(17,17,17,0.7)',
                  overlayColor: 'rgba(92, 174, 171, .3)',
                  primaryColor: 'rgb(212, 149, 17)',
                  textColor: '#fff',
                },
                // spotlight: {
                //   backgroundColor: 'transparent',
                // },
              }}
              continuous={true}
              showSkipButton={true}
              showProgress={true}
            />
          )}
          <SideBar>
            <SideSelection
              selectedSidebarOption={selectedSidebarOption}
              setSelectedSidebarOption={setSelectedSidebarOption}
              selectedLayers={selectedLayers}
              setSelectedLayers={setSelectedLayers}
              setActualLayer={setActualLayer}
              setLayerAction={setLayerAction}
              setShowPopup={setShowPopup}
              actualLayer={actualLayer}
              layerAction={layerAction}
              layerLegend={layerLegend}
              setLayerLegend={setLayerLegend}
              setInfoButtonBox={setInfoButtonBox}
              listLayers={listLayers}
              setShowRange={setShowRange}
              printBox={printBox}
              setPrintBox={setPrintBox}
              threeD={threeD}
              setThreeD={setThreeD}
              setDownloadPopup={setDownloadPopup}
              threeDLayer={threeDLayer}
              setThreeDLayer={setThreeDLayer}
            />
            <div className="hidden sm:block z-[9998]" id="side-selection">
              <DimensionsToogle />
            </div>
            {Object.keys(layerLegend).map((legend) => (
              <DataExplorationLegend
                key={legend}
                layerLegend={layerLegend}
                layerLegendName={legend}
                setLayerLegend={setLayerLegend}
                setSelectedLayers={setSelectedLayers}
                setLayerAction={setLayerAction}
                setActualLayer={setActualLayer}
              />
            ))}
            {Object.keys(infoButtonBox).length !== 0 ? (
              <InfoButtonBox
                infoButtonBox={infoButtonBox}
                setInfoButtonBox={setInfoButtonBox}
              />
            ) : null}
            {printBox ? <PrintSelection setPrintBox={setPrintBox} /> : null}
            {Object.keys(downloadPopup).length !== 0 ? (
              <DownloadPopup
                downloadPopup={downloadPopup}
                setDownloadPopup={setDownloadPopup}
              />
            ) : null}
          </SideBar>
          <BottomBar>
            {showRange ? (
              <RangeSelection
                actualDate={actualDate}
                setActualDate={setActualDate}
                setLayerAction={setLayerAction}
                setActualLayer={setActualLayer}
                selectedLayers={selectedLayers}
              />
            ) : null}
          </BottomBar>
          <ThreeDMap
            selectedLayers={selectedLayers}
            actualLayer={actualLayer}
            layerAction={layerAction}
            setLayerAction={setLayerAction}
            listLayers={listLayers}
            threeD={threeD}
            actualDate={actualDate}
            setPosition={setPosition}
            setDepth={setDepth}
            position={position}
            selectedSidebarOption={selectedSidebarOption}
          />
          <InfoBox
            position={position}
            depth={depth}
            batLayer={batLayer}
            setDepth={setDepth}
          />
          {showPopup && (
            <FullPagePopup
              setShowPopup={setShowPopup}
              setShowTutorial={setShowTutorial}
            />
          )}
          {canSelect ? <PrintSelectionArea /> : null}
        </ThreeDContainer>
      </UploadDataHandleProvider>
    </DownloadManagementHandleProvider>
  )
}
