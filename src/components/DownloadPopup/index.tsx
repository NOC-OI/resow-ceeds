import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons'
import 'katex/dist/katex.min.css'
import Draggable from 'react-draggable'
import { useRef } from 'react'
import { InfoButtonBoxContainer } from '../InfoButtonBox/styles'

interface DownloadPopupProps {
  downloadPopup: any
  setDownloadPopup: any
}

export function DownloadPopup({
  downloadPopup,
  setDownloadPopup,
}: DownloadPopupProps) {
  function handleClose() {
    setDownloadPopup({})
  }
  const nodeRef = useRef(null)

  const downloadFiles = (files) => {
    files.forEach((file, index) => {
      setTimeout(() => {
        const link = document.createElement('a')
        link.href = file
        link.download = file.split('/').pop()
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }, 500 * index)
    })
  }

  const title = Object.keys(downloadPopup)[0]
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
        <div className="font-bold text-center">Download Formats for Layer</div>
        <div className="text-center pb-5">{title.replace('_', ': ')}</div>
        {Object.keys(downloadPopup[title]).map((key) => {
          return (
            <div className="flex pb-2 justify-center no-underline" key={key}>
              {typeof downloadPopup[title][key] === 'object' ? (
                <div
                  onClick={() => downloadFiles(downloadPopup[title][key])}
                  className="underline clickable cursor-pointer"
                >
                  <strong>{key === 'url' ? 'Access Data Source' : key}</strong>
                </div>
              ) : (
                <a
                  href={downloadPopup[title][key]}
                  target="_blank"
                  className="no-underline clickable cursor-pointer capitalize"
                >
                  <strong>{key === 'url' ? 'Extenal Link' : key}</strong>
                </a>
              )}
            </div>
          )
        })}
      </InfoButtonBoxContainer>
    </Draggable>
  )
}
