import {
  faCashRegister,
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
      <div className="w-96 align-middle text-center">
        <FontAwesomeIcon icon={faCircleXmark} onClick={handleClose} />
        <h2 className="text-center font-bold pb-3 capitalize text-3xl">
          Haig Fras Digital Twin - Pilot Study
        </h2>
        <div className="p-4">
          <p className="text-center text-base">
            Some important text about the project... <br />
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce
            semper velit vel turpis efficitur, eu fermentum dui volutpat.
            Curabitur id ullamcorper eros. Aliquam erat volutpat. Sed eleifend
            volutpat odio, sed gravida velit ullamcorper at. \n Nulla facilisi.{' '}
            <br />
            Duis nec sapien ultrices, ullamcorper ligula in, hendrerit purus. In
            pulvinar nisl ac ligula ferment
          </p>
        </div>
        <div className="p-4">
          {/* <h3 className="text-center font-bold p-4 text-lg">Other Topics...</h3> */}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 cursor-pointer">
              <FontAwesomeIcon icon={faVideo} />
              <p className="text-center text-sm">Tutorial</p>
            </div>
            <div className="p-4  cursor-pointer">
              <FontAwesomeIcon icon={faCode} />
              <p className="text-center text-sm">Technologies</p>
            </div>
            <div className="p-4 cursor-pointer">
              <FontAwesomeIcon icon={faCashRegister} />
              <p className="text-center text-sm">Asset Register</p>
            </div>
          </div>
        </div>
      </div>
    </FullPagePopupContainer>
  )
}
