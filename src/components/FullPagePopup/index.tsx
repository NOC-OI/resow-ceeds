import { faCircleXmark } from '@fortawesome/free-solid-svg-icons'
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
          <img src="favicon_CEEDS.png" className="h-40" />
        </div>
        <h2 className="text-center font-bold pb-3 capitalize text-5xl">
          CEEDS
        </h2>
        <div className="p-4">
          <p className="text-center font-bold text-3xl">
            An AI-powered model to guide nature-based solutions to climate
            change
          </p>
        </div>
      </div>
    </FullPagePopupContainer>
  )
}
