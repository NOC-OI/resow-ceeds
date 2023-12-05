import {
  faCircleXmark,
  faCode,
  faVideo,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { FullPagePopupContainer } from './styles'

interface FullPagePopupProps {
  setShowPopup: any
}

export function FullPagePopup({ setShowPopup }: FullPagePopupProps) {
  function handleClose() {
    setShowPopup(false)
  }

  return (
    <FullPagePopupContainer onClick={handleClose}>
      <div className="w-[40rem] align-middle text-center">
        <FontAwesomeIcon icon={faCircleXmark} onClick={handleClose} />
        <div>
          <img src="logo.png" className="h-28" />
        </div>
        <h2 className="text-center font-bold pb-3 capitalize text-4xl">
          CEEDs Tool
        </h2>
        <div className="p-4">
          <p className="text-center font-bold text-2xl">
            Some text about the tool
          </p>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-2 gap-1">
            <a href="" target="_blank" className="p-4 cursor-pointer">
              <FontAwesomeIcon icon={faVideo} />
              <p className="text-center text-sm font-bold">About</p>
            </a>
            <a
              href="https://imfe-pilot-documentation.co.uk/"
              target="_blank"
              className="p-4 cursor-pointer"
            >
              <FontAwesomeIcon icon={faCode} />
              <p className="text-center text-sm font-bold">Documentation</p>
            </a>
          </div>
        </div>
      </div>
    </FullPagePopupContainer>
  )
}
