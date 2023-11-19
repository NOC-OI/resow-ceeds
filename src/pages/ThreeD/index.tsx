import { ThreeDContainer } from './styles'
import { useEffect, useState } from 'react'
import { SideSelection } from '../../components/SideSelection'
import { BottomBar, SideBar } from '../Home/styles'
import { ThreeDMap } from '../../components/ThreeDMap'
import { FullPagePopup } from '../../components/FullPagePopup'
import { InfoButtonBox } from '../../components/InfoButtonBox'
import { DataExplorationLegend } from '../../components/DataExplorationLegend'
import { GetLayers } from '../../data/loadLayers'
import { Loading } from '../../components/Loading'
import { RangeSelection } from '../../components/RangeSelection'
import { yearMonths } from '../../data/yearMonths'

export function ThreeD() {
  const [selectedSidebarOption, setSelectedSidebarOption] =
    useState<string>('3D')
  const [threeD, setThreeD] = useState(null)
  const [actualDate, setActualDate] = useState(yearMonths.indexOf('2021-05'))

  const [selectedLayers, setSelectedLayers] = useState<Object>({})

  const [actualLayer, setActualLayer] = useState<string[]>([''])

  const [layerAction, setLayerAction] = useState('')
  const [loading, setLoading] = useState(true)

  const [layerLegend, setLayerLegend] = useState('')
  const [infoButtonBox, setInfoButtonBox] = useState({})

  const [listLayers, setListLayers] = useState([])

  const [showPopup, setShowPopup] = useState(false)
  // const [activePhoto, setActivePhoto] = useState('')
  const [showRange, setShowRange] = useState(false)

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

  useEffect(() => {
    fetchData()
  }, [])

  return (
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
          loading={loading}
          actualLayer={actualLayer}
          layerAction={layerAction}
          setLayerLegend={setLayerLegend}
          setInfoButtonBox={setInfoButtonBox}
          listLayers={listLayers}
          threeD={threeD}
          setThreeD={setThreeD}
          setShowRange={setShowRange}
        />
        {layerLegend ? (
          <DataExplorationLegend
            layerLegend={layerLegend}
            setLayerLegend={setLayerLegend}
          />
        ) : null}
        {Object.keys(infoButtonBox).length !== 0 ? (
          <InfoButtonBox
            infoButtonBox={infoButtonBox}
            setInfoButtonBox={setInfoButtonBox}
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
      />
      {showPopup && <FullPagePopup setShowPopup={setShowPopup} />}
      {loading ? <Loading /> : null}
    </ThreeDContainer>
  )
}
