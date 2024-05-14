import { Fish, Mountains, StackSimple, Waves } from 'phosphor-react'
import { useEffect, useState } from 'react'
// import { LayerTypeContainer } from './styles'
import { DataExplorationTypeOptions } from '../DataExplorationTypeOptions'
import { CalcTypeContainer } from './styles'

interface keyable {
  [key: string]: any
}

interface DataExplorationTypeProps {
  content: string
  childs: object
  selectedLayers: keyable
  setSelectedLayers: any
  actualLayer: string[]
  setActualLayer: any
  layerAction: string
  setLayerAction: any
  layerLegend: any
  setLayerLegend: any
  setInfoButtonBox?: any
  setShowPhotos?: any
  getPolyline: any
  setGetPolyline: any
  setShowRange?: any
  setClickPoint: any
  listLayers: any
  setDownloadPopup?: any
}

export function DataExplorationType({
  content,
  childs,
  selectedLayers,
  setSelectedLayers,
  actualLayer,
  setActualLayer,
  layerAction,
  setLayerAction,
  layerLegend,
  setLayerLegend,
  setInfoButtonBox,
  setShowPhotos,
  getPolyline,
  setGetPolyline,
  setClickPoint,
  listLayers,
  setDownloadPopup,
}: DataExplorationTypeProps) {
  const [subLayers, setSubLayers] = useState<keyable>({})

  const [isActive, setIsActive] = useState(false)

  function handleShowLayers() {
    setIsActive((isActive) => !isActive)
    setSubLayers((subLayers) =>
      Object.keys(subLayers).length === 0 ? childs : {},
    )
  }

  useEffect(() => {
    if (layerAction) {
      const photoList: any[] = []
      Object.keys(selectedLayers).forEach((layer) => {
        if (selectedLayers[layer].dataType === 'Photo') {
          selectedLayers[layer].photos.forEach((photo: any) => {
            photo.layerName = actualLayer[0]
            photoList.push(photo)
          })
        }
      })
      setShowPhotos([])
      // setShowPhotos(photoList)
    }
  }, [selectedLayers])
  return (
    <CalcTypeContainer>
      <div>
        <header
          id="general-types"
          onClick={handleShowLayers}
          style={isActive ? { color: '#D49511' } : { color: 'white' }}
        >
          <span title="expand">
            {listLayers[`${content}`].icon === 'mountain' ? (
              <Mountains size={30} />
            ) : listLayers[`${content}`].icon === 'waves' ? (
              <Waves size={30} />
            ) : listLayers[`${content}`].icon === 'fish' ? (
              <Fish size={30} />
            ) : listLayers[`${content}`].icon === 'area' ? (
              <StackSimple size={32} />
            ) : (
              <StackSimple size={32} />
            )}
          </span>
          <p>{content}</p>
          {listLayers[`${content}`].ceeds && (
            <div
              className="flex justify-center items-center pl-2"
              title="Layer produced by RESOW project"
            >
              <img src="favicon.png" className="h-3" />
            </div>
          )}
        </header>
      </div>
      <div className="flex flex-col gap-1 pt-1">
        {Object.keys(subLayers).map((subLayer) => {
          return (
            <DataExplorationTypeOptions
              key={`${content}_${subLayer}`}
              subLayer={subLayer}
              content={content}
              setActualLayer={setActualLayer}
              subLayers={subLayers}
              layerLegend={layerLegend}
              setLayerLegend={setLayerLegend}
              layerAction={layerAction}
              setLayerAction={setLayerAction}
              selectedLayers={selectedLayers}
              setSelectedLayers={setSelectedLayers}
              setInfoButtonBox={setInfoButtonBox}
              getPolyline={getPolyline}
              setGetPolyline={setGetPolyline}
              setClickPoint={setClickPoint}
              setDownloadPopup={setDownloadPopup}
            />
          )
        })}
      </div>
    </CalcTypeContainer>
  )
}
