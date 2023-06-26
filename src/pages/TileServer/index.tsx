import { useEffect, useState } from 'react'
import { DataExplorationSelection } from '../../components/DataExplorationSelection'
import { MapHome } from '../../components/MapHome'
import { SideSelection } from '../../components/SideSelection'
import { TileServerContainer, SideBar } from './styles'
import { CalculationValue } from '../../components/CalculationValue'
import { PhotoList } from '../../components/PhotoList'
import * as L from 'leaflet'
import { DataExplorationLegend } from '../../components/DataExplorationLegend'
import { InfoButtonBox } from '../../components/InfoButtonBox'
import { HabitatSelection } from '../../components/HabitatSelection'
import { BiodiversitySelection } from '../../components/BiodiversitySelection'
import { IndicatorSpeciesSelection } from '../../components/IndicatorSpeciesSelection'
import { SurveyDesignSelection } from '../../components/SurveyDesignSelection'
import { FullPagePopup } from '../../components/FullPagePopup'
import { LoginPopup } from '../../components/LoginPopup'
import { FlashMessages } from '../../components/FlashMessages'
import Cookies from 'js-cookie'
// import { useNavigate } from 'react-router-dom'
import { GraphBox } from '../../components/GraphBox'

export function TileServer() {
  // const navigate = useNavigate()

  const [selectedSidebarOption, setSelectedSidebarOption] = useState<string>('')

  const [selectedArea, setSelectedArea] = useState(false)

  const [latLonLimits, setLatLonLimits] = useState([
    new L.LatLng(50.55, -8.21),
    new L.LatLng(50.55, -7.35),
    new L.LatLng(50.07, -7.35),
    new L.LatLng(50.07, -8.21),
  ])

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

  const [getPolyline, setGetPolyline] = useState(false)

  const [listLayers, setListLayers] = useState([])

  const [showPopup, setShowPopup] = useState(true)

  const [showLogin, setShowLogin] = useState(false)
  const [isLogged, setIsLogged] = useState(!!Cookies.get('token'))

  const [showFlash, setShowFlash] = useState(false)
  const [flashMessage, setFlashMessage] = useState({
    messageType: '',
    content: '',
  })

  useEffect(() => {
    if (flashMessage.messageType) {
      setShowFlash(true)
    }
  }, [isLogged])

  // useEffect(() => {
  //   if (!isLogged) {
  //     navigate('/login')
  //     setShowFlash(true)
  //   }
  // }, [])

  return (
    <TileServerContainer>
      <SideBar>
        <SideSelection
          selectedSidebarOption={selectedSidebarOption}
          setSelectedSidebarOption={setSelectedSidebarOption}
          selectedLayers={selectedLayers}
          setSelectedLayers={setSelectedLayers}
          actualLayer={actualLayer}
          setActualLayer={setActualLayer}
          setLayerAction={setLayerAction}
          setSelectedArea={setSelectedArea}
          setShowPhotos={setShowPhotos}
          listLayers={listLayers}
          setListLayers={setListLayers}
          showPopup={showPopup}
          setShowPopup={setShowPopup}
          showLogin={showLogin}
          setShowLogin={setShowLogin}
          isLogged={isLogged}
        />
        {selectedSidebarOption === 'Data Exploration' && (
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
            isLogged={isLogged}
            getPolyline={getPolyline}
            setGetPolyline={setGetPolyline}
          />
        )}
        {selectedSidebarOption === 'Habitats' && (
          <HabitatSelection
            setCalculationValue={setCalculationValue}
            selectedArea={selectedArea}
            setSelectedArea={setSelectedArea}
            latLonLimits={latLonLimits}
            setLatLonLimits={setLatLonLimits}
            setInfoButtonBox={setInfoButtonBox}
          />
        )}
        {selectedSidebarOption === 'Species of Interest' && (
          <IndicatorSpeciesSelection
            setCalculationValue={setCalculationValue}
            selectedArea={selectedArea}
            setSelectedArea={setSelectedArea}
            latLonLimits={latLonLimits}
            setLatLonLimits={setLatLonLimits}
            setInfoButtonBox={setInfoButtonBox}
            selectedLayers={selectedLayers}
            setSelectedLayers={setSelectedLayers}
            layerAction={layerAction}
            setLayerAction={setLayerAction}
            actualLayer={actualLayer}
            setActualLayer={setActualLayer}
            listLayers={listLayers}
            setShowPhotos={setShowPhotos}
          />
        )}
        {selectedSidebarOption === 'Biodiversity' && (
          <BiodiversitySelection
            setCalculationValue={setCalculationValue}
            selectedArea={selectedArea}
            setSelectedArea={setSelectedArea}
            latLonLimits={latLonLimits}
            setLatLonLimits={setLatLonLimits}
            setInfoButtonBox={setInfoButtonBox}
            selectedLayers={selectedLayers}
            setSelectedLayers={setSelectedLayers}
            layerAction={layerAction}
            setLayerAction={setLayerAction}
            actualLayer={actualLayer}
            setActualLayer={setActualLayer}
            listLayers={listLayers}
          />
        )}
        {selectedSidebarOption === 'Survey Design' && (
          <SurveyDesignSelection
            setCalculationValue={setCalculationValue}
            selectedArea={selectedArea}
            setSelectedArea={setSelectedArea}
            latLonLimits={latLonLimits}
            setLatLonLimits={setLatLonLimits}
            setInfoButtonBox={setInfoButtonBox}
          />
        )}
        {graphData ? (
          <GraphBox
            graphData={graphData}
            setGraphData={setGraphData}
            actualLayer={actualLayer}
            setGetPolyline={setGetPolyline}
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
            selectedLayers={selectedLayers}
            setSelectedLayers={setSelectedLayers}
            layerAction={layerAction}
            setLayerAction={setLayerAction}
            actualLayer={actualLayer}
            setActualLayer={setActualLayer}
            listLayers={listLayers}
          />
        ) : null}
        {showPhotos.length > 0 &&
          selectedSidebarOption === 'Data Exploration' && (
            <PhotoList
              showPhotos={showPhotos}
              setShowPhotos={setShowPhotos}
              activePhoto={activePhoto}
              setActivePhoto={setActivePhoto}
              mapBounds={mapBounds}
              infoButtonBox={infoButtonBox}
            />
          )}
      </SideBar>
      <MapHome
        selectedLayers={selectedLayers}
        actualLayer={actualLayer}
        layerAction={layerAction}
        setLayerAction={setLayerAction}
        selectedArea={selectedArea}
        latLonLimits={latLonLimits}
        showPhotos={showPhotos}
        setShowPhotos={setShowPhotos}
        activePhoto={activePhoto}
        setActivePhoto={setActivePhoto}
        mapBounds={mapBounds}
        setMapBounds={setMapBounds}
        selectedSidebarOption={selectedSidebarOption}
        getPolyline={getPolyline}
        setGetPolyline={setGetPolyline}
        setGraphData={setGraphData}
        setShowFlash={setShowFlash}
        setFlashMessage={setFlashMessage}
      />
      {showPopup && <FullPagePopup setShowPopup={setShowPopup} />}
      {showLogin && (
        <LoginPopup
          isLogged={isLogged}
          setIsLogged={setIsLogged}
          setShowLogin={setShowLogin}
          setFlashMessage={setFlashMessage}
          setShowFlash={setShowFlash}
        />
      )}
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
    </TileServerContainer>
  )
}
