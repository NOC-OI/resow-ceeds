import { useEffect, useState } from 'react'
import { MapHome } from '../../components/MapHome'
import { SideSelection } from '../../components/SideSelection'
import { SideBar, HomeContainer, BottomBar } from './styles'
import { CalculationValue } from '../../components/CalculationValue'
import { DataExplorationLegend } from '../../components/DataExplorationLegend'
import { InfoButtonBox } from '../../components/InfoButtonBox'
import { GraphBox } from '../../components/GraphBox'
import { GetLayers } from '../../data/loadLayers'
import { RangeSelection } from '../../components/RangeSelection'
import { yearMonths } from '../../data/yearMonths'
import { MapPopup } from '../../components/MapPopup'
import { InfoBox } from '../../components/InfoBox'
import { defaultBaseLayer } from '../../lib/map/utils'
import { useContextHandle } from '../../lib/contextHandle'
import { DownloadManagementHandleProvider } from '../../lib/data/downloadManagement'
import { FullPagePopup } from '../../components/FullPagePopup'
import { PrintSelection } from '../../components/PrintSelection'
import { usePrintPageHandle } from '../../lib/data/printPageManagement'
import { PrintSelectionArea } from '../../components/PrintSelectionArea'
import { UploadDataHandleProvider } from '../../lib/data/uploadDataManagement'
import { DownloadPopup } from '../../components/DownloadPopup'
import { DimensionsToogle } from '../../components/DimensionsToogle'
import Joyride from 'react-joyride'

export function Home() {
  const steps = [
    {
      target: '#data_exploration',
      content: 'Explore various layers of data here.',
    },
    {
      target: '#selected_layers',
      content: 'Interact and manage your selected data layers in this area.',
    },
    {
      target: '#Download',
      content: 'Select specific areas to download the data you need.',
    },
    {
      target: '#Upload',
      content: 'Upload your data files here.',
    },
    {
      target: '#Print',
      content: 'Choose map areas to save and export as images.',
    },
    {
      target: '#clean_map',
      content: 'Remove all active layers from the map with this option.',
    },
    {
      target: '#dimensions_toogle',
      content: 'Toggle this switch to view the map in either 2D or 3D.',
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
  const [depth, setDepth] = useState({})
  const [position, setPosition] = useState(null)
  const [actualDate, setActualDate] = useState(yearMonths.indexOf('2021-05'))

  const [graphData, setGraphData] = useState(null)

  const [selectedLayers, setSelectedLayers] = useState<any>({})

  const [actualLayer, setActualLayer] = useState<string[]>([''])

  const [layerAction, setLayerAction] = useState('')

  const [calculationValue, setCalculationValue] = useState('')

  const [showPhotos, setShowPhotos] = useState<object[]>([])
  const [selectedBaseLayer, setSelectedBaseLayer] = useState(defaultBaseLayer)

  const [layerLegend, setLayerLegend] = useState({})
  const [printBox, setPrintBox] = useState(false)

  const [infoButtonBox, setInfoButtonBox] = useState({})

  const [activePhoto, setActivePhoto] = useState('')

  const [mapBounds, setMapBounds] = useState({
    _northEast: { lat: -89, lng: 179 },
    _southWest: { lat: -89, lng: 179 },
  })
  const [showRange, setShowRange] = useState(false)

  const [getPolyline, setGetPolyline] = useState(false)

  const [listLayers, setListLayers] = useState([])

  const [showPopup, setShowPopup] = useState(true)

  const [clickPoint, setClickPoint] = useState(false)

  const [mapPopup, setMapPopup] = useState({})
  const [downloadPopup, setDownloadPopup] = useState({})

  const fetchData = async () => {
    const rout = window.location.pathname
    const getLayers = new GetLayers(rout)
    await getLayers.loadJsonLayers().then(async function () {
      setListLayers((listLayers: any) =>
        listLayers.lenght > 0 ? listLayers : getLayers.data,
      )
      // setSelectedLayers({
      //   ...selectedLayers,
      //   'Marine Protected Areas_Special Areas of Conservation':
      //     getLayers.data['Marine Protected Areas'].layerNames[
      //       'Special Areas of Conservation'
      //     ],
      //   'Marine Protected Areas_Marine Conservation Zones':
      //     getLayers.data['Marine Protected Areas'].layerNames[
      //       'Marine Conservation Zones'
      //     ],
      // })
      setLoading(false)
    })
  }
  useEffect(() => {
    fetchData()
  }, [])

  return (
    <DownloadManagementHandleProvider>
      <UploadDataHandleProvider>
        <HomeContainer>
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
              setShowPhotos={setShowPhotos}
              setShowPopup={setShowPopup}
              actualLayer={actualLayer}
              layerAction={layerAction}
              layerLegend={layerLegend}
              setLayerLegend={setLayerLegend}
              setInfoButtonBox={setInfoButtonBox}
              listLayers={listLayers}
              getPolyline={getPolyline}
              setGetPolyline={setGetPolyline}
              setShowRange={setShowRange}
              setClickPoint={setClickPoint}
              selectedBaseLayer={selectedBaseLayer}
              setSelectedBaseLayer={setSelectedBaseLayer}
              printBox={printBox}
              setPrintBox={setPrintBox}
              setDownloadPopup={setDownloadPopup}
            />
            <div className="hidden sm:block z-[9998] h-max" id="side-selection">
              <DimensionsToogle />
            </div>
            {graphData ? (
              <GraphBox
                graphData={graphData}
                setGraphData={setGraphData}
                actualLayer={actualLayer}
                setGetPolyline={setGetPolyline}
                setClickPoint={setClickPoint}
                selectedLayers={selectedLayers}
              />
            ) : null}
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
            {printBox ? <PrintSelection setPrintBox={setPrintBox} /> : null}
            {calculationValue && (
              <CalculationValue
                calculationValue={calculationValue}
                setCalculationValue={setCalculationValue}
                selectedLayers={selectedLayers}
                setSelectedLayers={setSelectedLayers}
                listLayers={listLayers}
                layerAction={layerAction}
                setLayerAction={setLayerAction}
                actualLayer={actualLayer}
                setActualLayer={setActualLayer}
                setShowPhotos={setShowPhotos}
              />
            )}
            {Object.keys(infoButtonBox).length !== 0 ? (
              <InfoButtonBox
                infoButtonBox={infoButtonBox}
                setInfoButtonBox={setInfoButtonBox}
              />
            ) : null}
            {Object.keys(mapPopup).length !== 0 ? (
              <MapPopup mapPopup={mapPopup} setMapPopup={setMapPopup} />
            ) : null}
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
          <MapHome
            selectedLayers={selectedLayers}
            actualLayer={actualLayer}
            layerAction={layerAction}
            setLayerAction={setLayerAction}
            showPhotos={showPhotos}
            setShowPhotos={setShowPhotos}
            activePhoto={activePhoto}
            setActivePhoto={setActivePhoto}
            mapBounds={mapBounds}
            setMapBounds={setMapBounds}
            selectedSidebarOption={selectedSidebarOption}
            getPolyline={getPolyline}
            setGraphData={setGraphData}
            actualDate={actualDate}
            setMapPopup={setMapPopup}
            clickPoint={clickPoint}
            setClickPoint={setClickPoint}
            setPosition={setPosition}
            setDepth={setDepth}
            selectedBaseLayer={selectedBaseLayer}
          />
          <InfoBox position={position} depth={depth} />
          {showPopup && (
            <FullPagePopup
              setShowPopup={setShowPopup}
              setShowTutorial={setShowTutorial}
            />
          )}
          {canSelect ? <PrintSelectionArea /> : null}
        </HomeContainer>
      </UploadDataHandleProvider>
    </DownloadManagementHandleProvider>
  )
}
