import { useEffect, useState } from 'react'
import { MapHome } from '../../components/MapHome'
import { SideSelection } from '../../components/SideSelection'
import { SideBar, HomeContainer, BottomBar, BottomLeft } from './styles'
import { CalculationValue } from '../../components/CalculationValue'
import { DataExplorationLegend } from '../../components/DataExplorationLegend'
import { InfoButtonBox } from '../../components/InfoButtonBox'
import { FullPagePopup } from '../../components/FullPagePopup'
import { FlashMessages } from '../../components/FlashMessages'
import { GraphBox } from '../../components/GraphBox'
import { GetLayers } from '../../data/loadLayers'
import { Loading } from '../../components/Loading'
import { RangeSelection } from '../../components/RangeSelection'
import { yearMonths } from '../../data/yearMonths'
import { MapPopup } from '../../components/MapPopup'

export function Home() {
  const [selectedSidebarOption, setSelectedSidebarOption] = useState<string>('')

  const [surveyDesignCircleValues, setSurveyDesignCircleValues] = useState([])
  const [actualDate, setActualDate] = useState(yearMonths.indexOf('2021-05'))

  const [graphData, setGraphData] = useState(null)

  const [selectedLayers, setSelectedLayers] = useState<Object>({})

  const [actualLayer, setActualLayer] = useState<string[]>([''])

  const [layerAction, setLayerAction] = useState('')

  const [calculationValue, setCalculationValue] = useState('')

  const [showPhotos, setShowPhotos] = useState<object[]>([])

  const [layerLegend, setLayerLegend] = useState('')
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
  const [loading, setLoading] = useState(true)

  const [showFlash, setShowFlash] = useState(false)
  const [flashMessage, setFlashMessage] = useState({
    messageType: '',
    content: '',
  })
  const [clickPoint, setClickPoint] = useState(false)

  const [mapPopup, setMapPopup] = useState({})

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
    <HomeContainer>
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
          loading={loading}
          actualLayer={actualLayer}
          layerAction={layerAction}
          setLayerLegend={setLayerLegend}
          setInfoButtonBox={setInfoButtonBox}
          listLayers={listLayers}
          getPolyline={getPolyline}
          setGetPolyline={setGetPolyline}
          setShowRange={setShowRange}
          setClickPoint={setClickPoint}
        />
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
        {layerLegend ? (
          <DataExplorationLegend
            layerLegend={layerLegend}
            setLayerLegend={setLayerLegend}
          />
        ) : null}
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
      <BottomLeft>
        <img src="favicon.png" className="h-16" />
      </BottomLeft>
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
        setShowFlash={setShowFlash}
        setFlashMessage={setFlashMessage}
        surveyDesignCircleValues={surveyDesignCircleValues}
        setSurveyDesignCircleValues={setSurveyDesignCircleValues}
        actualDate={actualDate}
        setMapPopup={setMapPopup}
        clickPoint={clickPoint}
        setClickPoint={setClickPoint}
      />
      {showPopup && <FullPagePopup setShowPopup={setShowPopup} />}
      {showFlash && (
        <FlashMessages
          type={flashMessage.messageType}
          message={flashMessage.content}
          duration={5000}
          active={showFlash}
          setActive={setShowFlash}
          position={'bcenter'}
          width={'medium'}
        />
      )}
      {loading ? <Loading /> : null}
    </HomeContainer>
  )
}
