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

export function ThreeD() {
  const [selectedSidebarOption, setSelectedSidebarOption] = useState<string>('')
  const { setLoading } = useContextHandle()
  const { canSelect } = usePrintPageHandle()
  const [threeD, setThreeD] = useState(null)
  const [depth, setDepth] = useState({})
  const [position, setPosition] = useState(null)
  const [actualDate, setActualDate] = useState(yearMonths.indexOf('2021-05'))

  const [selectedLayers, setSelectedLayers] = useState<Object>({})

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
            />
            <div className="hidden sm:block z-[9999]">
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

          {showPopup && <FullPagePopup setShowPopup={setShowPopup} />}
          {canSelect ? <PrintSelectionArea /> : null}
        </ThreeDContainer>
      </UploadDataHandleProvider>
    </DownloadManagementHandleProvider>
  )
}
