import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons'
import 'katex/dist/katex.min.css'
import Draggable from 'react-draggable'
import { useRef } from 'react'
import {
  InfoButtonBoxContainer,
  InfoButtonBoxContent,
} from '../InfoButtonBox/styles'

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
  const dataType = mapPopup.type
  const content = mapPopup[title]
  return (
    <Draggable nodeRef={nodeRef} cancel=".clickable">
      <InfoButtonBoxContainer id="mappopup-box" ref={nodeRef} className="w-80">
        <div>
          <FontAwesomeIcon
            icon={faCircleXmark}
            onClick={handleClose}
            className="clickable"
          />
        </div>
        <InfoButtonBoxContent>
          <div className="font-bold text-center pb-3 !justify-center">
            {title.replace('_', ': ')}
          </div>
          {dataType === 'html' ? (
            <div dangerouslySetInnerHTML={{ __html: content }}></div>
          ) : (
            Object.keys(content).map((key, index) => {
              return (
                <div
                  className="text-xs flex pb-2 gap-1 justify-between"
                  key={index}
                >
                  {typeof content[key] !== 'object' && (
                    <div>
                      <strong>{key === 'filename' ? 'More Info' : key}</strong>:
                    </div>
                  )}
                  {typeof content[key] !== 'object' &&
                    (key === 'filename' ? (
                      <a
                        href={`${content[key]}`}
                        target="_blank"
                        className="clickable"
                      >
                        Click Here
                      </a>
                    ) : (
                      <div>{content[key]}</div>
                    ))}
                </div>
              )
            })
          )}
        </InfoButtonBoxContent>
      </InfoButtonBoxContainer>
    </Draggable>
  )
}
