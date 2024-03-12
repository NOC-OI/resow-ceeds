import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons'
import 'katex/dist/katex.min.css'
import Draggable from 'react-draggable'
import { useRef } from 'react'
import { InfoButtonBoxContainer } from '../InfoButtonBox/styles'

interface MapPopupProps {
  mapPopup: any
  setMapPopup: any
}

export function MapPopup({ mapPopup, setMapPopup }: MapPopupProps) {
  function handleClose() {
    setMapPopup({})
  }
  const nodeRef = useRef(null)
  const title = Object.keys(mapPopup)[0]
  const content = mapPopup[title]
  return (
    <Draggable nodeRef={nodeRef} cancel=".clickable">
      <InfoButtonBoxContainer
        id="info-subsection"
        ref={nodeRef}
        className="w-80"
      >
        <div>
          <FontAwesomeIcon
            icon={faCircleXmark}
            onClick={handleClose}
            className="clickable"
          />
        </div>
        <div className="font-bold text-center pb-3">
          {title.replace('_', ': ')}
        </div>
        {Object.keys(content).map((key) => {
          return (
            <div className="flex pb-2 gap-1 justify-between" key={key}>
              <div>
                <strong>{key === 'filename' ? 'More Info:' : key}</strong>:
              </div>
              {key === 'filename' ? (
                <a href={`${content[key]}`} target="_blank">
                  Click Here
                </a>
              ) : (
                <div>{content[key]}</div>
              )}
            </div>
          )
        })}
      </InfoButtonBoxContainer>
    </Draggable>
  )
}
