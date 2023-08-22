import { ThreeDContainer } from './styles'
import { useEffect, useState } from 'react'
import { SideSelection } from '../../components/SideSelection'
import { SideBar } from '../TileServer/styles'
import { ThreeDMap } from '../../components/ThreeDMap'
import { ThreeDDataExplorationSelection } from '../../components/ThreeDDataExplorationSelection'
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom'
import { FlashMessages } from '../../components/FlashMessages'
import { LoginPopup } from '../../components/LoginPopup'
import { FullPagePopup } from '../../components/FullPagePopup'
import { InfoButtonBox } from '../../components/InfoButtonBox'
import { DataExplorationLegend } from '../../components/DataExplorationLegend'

export function ThreeD() {
  const navigate = useNavigate()

  const [selectedSidebarOption, setSelectedSidebarOption] =
    useState<string>('3D')
  const [threeD, setThreeD] = useState(null)

  const [selectedLayers, setSelectedLayers] = useState<Object>({})

  const [actualLayer, setActualLayer] = useState<string[]>([''])

  const [layerAction, setLayerAction] = useState('')

  const [layerLegend, setLayerLegend] = useState('')
  const [infoButtonBox, setInfoButtonBox] = useState({})

  const [listLayers, setListLayers] = useState([])

  const [showPopup, setShowPopup] = useState(false)
  const [activePhoto, setActivePhoto] = useState('')

  const [showLogin, setShowLogin] = useState(false)
  const [isLogged, setIsLogged] = useState(Cookies.get('token'))

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

  const dealWithLogin = process.env.VITE_LOGIN

  useEffect(() => {
    if (dealWithLogin !== '0') {
      if (!isLogged) {
        navigate('/login')
        setShowFlash(true)
      }
    }
  }, [])

  return (
    <ThreeDContainer>
      <SideBar>
        <SideSelection
          selectedSidebarOption={selectedSidebarOption}
          setSelectedSidebarOption={setSelectedSidebarOption}
          selectedLayers={selectedLayers}
          setSelectedLayers={setSelectedLayers}
          actualLayer={actualLayer}
          setActualLayer={setActualLayer}
          setLayerAction={setLayerAction}
          listLayers={listLayers}
          setListLayers={setListLayers}
          showPopup={showPopup}
          setShowPopup={setShowPopup}
          showLogin={showLogin}
          setShowLogin={setShowLogin}
          isLogged={isLogged}
        />
        {selectedSidebarOption === '3D' && (
          <ThreeDDataExplorationSelection
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
            isLogged={isLogged}
            threeD={threeD}
            setThreeD={setThreeD}
          />
        )}
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
            selectedLayers={selectedLayers}
            setSelectedLayers={setSelectedLayers}
            layerAction={layerAction}
            setLayerAction={setLayerAction}
            actualLayer={actualLayer}
            setActualLayer={setActualLayer}
            listLayers={listLayers}
          />
        ) : null}
      </SideBar>
      <ThreeDMap
        selectedLayers={selectedLayers}
        actualLayer={actualLayer}
        layerAction={layerAction}
        setLayerAction={setLayerAction}
        activePhoto={activePhoto}
        setActivePhoto={setActivePhoto}
        listLayers={listLayers}
        threeD={threeD}
        setThreeD={setThreeD}
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
    </ThreeDContainer>
  )
}
