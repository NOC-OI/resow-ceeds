import {
  faCircleXmark,
  faCode,
  faVideo,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { FullPagePopupContainer } from './styles'
import { GithubLogo } from 'phosphor-react'

interface FullPagePopupProps {
  setShowPopup: any
}

export function FullPagePopup({ setShowPopup }: FullPagePopupProps) {
  function handleClose() {
    setShowPopup(false)
  }

  return (
    <FullPagePopupContainer>
      <div className="h-full p-5 text-center">
        <FontAwesomeIcon icon={faCircleXmark} onClick={handleClose} />
        <div>
          <img src="logo.png" className="h-28" />
        </div>
        <h2 className="text-center font-bold pb-3 capitalize text-4xl"></h2>
        <div className="p-4">
          <p className="text-center font-bold text-2xl">CEEDS Tool</p>
        </div>
        <div className="p-4">
          <p className="text-center font-bold text-xl">
            Same text about CEEDS Tool
          </p>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-2 gap-5">
            <div
              onClick={handleClose}
              className="p-4 cursor-pointer bg-yellow-500 rounded-xl"
            >
              <p className="text-center font-bold text-xl">MAP VIEWER</p>
            </div>
            <a
              href=""
              target="_blank"
              className="p-4 cursor-pointer bg-yellow-500 rounded-xl"
            >
              <p className="text-center text-xl font-bold">
                Decision Making Tool
              </p>
            </a>
          </div>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-3 gap-1">
            <a href="" target="_blank" className="p-4 cursor-pointer">
              <FontAwesomeIcon icon={faVideo} />
              <p className="text-center text-sm font-bold">About</p>
            </a>
            <a
              href="https://radiantearth.github.io/stac-browser/#/external/pilot-imfe-o.s3-ext.jc.rl.ac.uk/haig-fras/stac/catalog.json?.language=en"
              target="_blank"
              className="p-4 cursor-pointer"
            >
              <FontAwesomeIcon icon={faCode} />
              <p className="text-center text-sm font-bold">Catalog</p>
            </a>
            <a href="#" target="_blank" className="p-4 cursor-pointer">
              <GithubLogo size={42} />
              {/* <FontAwesomeIcon icon={faGitHub} /> */}
              <p className="text-center text-sm font-bold">Codes</p>
            </a>
          </div>
        </div>
      </div>
    </FullPagePopupContainer>
  )
}
