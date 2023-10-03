import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { InfoButtonBoxContainer, InfoButtonBoxContent } from './styles'
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import remarkBreaks from 'remark-breaks'
import 'katex/dist/katex.min.css' // `rehype-katex` does not import the CSS for you
// import { Button } from '../AreaSelector/styles'
// import parse from 'html-react-parser'

interface InfoButtonBoxProps {
  infoButtonBox: any
  setInfoButtonBox: any
  selectedLayers: any
  setSelectedLayers: any
  layerAction: any
  setLayerAction: any
  actualLayer: any
  setActualLayer: any
  listLayers: any
}

export function InfoButtonBox({
  infoButtonBox,
  setInfoButtonBox,
  selectedLayers,
  setSelectedLayers,
  layerAction,
  setLayerAction,
  actualLayer,
  setActualLayer,
  listLayers,
}: InfoButtonBoxProps) {
  function handleClose() {
    setInfoButtonBox({})
  }

  // function verifyIfWasSelectedBefore(subLayer: string) {
  //   return !!selectedLayers[subLayer]
  // }

  // function addMapLayer(layerInfo: any) {
  //   setLayerAction('add')
  //   const newSelectedLayer = layerInfo.dataInfo
  //   newSelectedLayer.opacity = 1
  //   newSelectedLayer.zoom = true
  //   setSelectedLayers({
  //     ...selectedLayers,
  //     [layerInfo.subLayer]: newSelectedLayer,
  //   })
  // }

  // function changeMapLayer(newSelectedLayers: any) {
  //   setLayerAction('marker-changes')
  //   setSelectedLayers((selectedLayers: any) => {
  //     const copy = { ...selectedLayers }
  //     newSelectedLayers.forEach((layerInfo: any) => {
  //       delete copy[layerInfo.subLayer]
  //       layerInfo.dataInfo.plotLimits = true
  //       layerInfo.dataInfo.opacity = 1
  //       layerInfo.dataInfo.zoom = true
  //       copy[layerInfo.subLayer] = layerInfo.dataInfo
  //     })
  //     return copy
  //   })
  // }
  // async function handleChangeMapLayer(e: any) {
  //   const buttonValue = e.currentTarget.value
  //   const [column, result] = buttonValue.split('_')

  //   const layerInfo = {
  //     subLayer: buttonValue,
  //     dataInfo: listLayers[column].layerNames[result],
  //   }
  //   if (verifyIfWasSelectedBefore(buttonValue)) {
  //     layerInfo.dataInfo.selectedBefore = true
  //   } else {
  //     layerInfo.dataInfo.selectedBefore = false
  //   }
  //   layerInfo.dataInfo.show = []
  //   setActualLayer([buttonValue])
  //   changeMapLayer([layerInfo])
  // }

  return (
    <InfoButtonBoxContainer id="info-subsection" className="w-80">
      <div>
        <FontAwesomeIcon icon={faCircleXmark} onClick={handleClose} />
      </div>
      <div className="font-bold text-center pb-3">
        <ReactMarkdown
          children={infoButtonBox.title}
          remarkPlugins={[remarkGfm, remarkMath, remarkBreaks]}
          rehypePlugins={[rehypeKatex]}
          linkTarget={'_blank'}
        />
      </div>
      <InfoButtonBoxContent className="content-center pb-2">
        <ReactMarkdown
          children={infoButtonBox.content}
          remarkPlugins={[remarkGfm, remarkMath, remarkBreaks]}
          rehypePlugins={[rehypeKatex]}
          linkTarget={'_blank'}
        />
        {/* {infoButtonBox.link && (
          <Button
            value={infoButtonBox.link.layers}
            onClick={handleChangeMapLayer}
            className="bg-inherit font-bold center-element"
          >
            View Layer
          </Button>
        )} */}
      </InfoButtonBoxContent>
      {/* <p>{infoButtonBox.content}</p> */}
    </InfoButtonBoxContainer>
  )
}
