import {
  faCircleXmark,
  faClipboardQuestion,
  faInfoCircle,
  faList,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { FullPagePopupContainer } from './styles'
// import { GithubLogo } from 'phosphor-react'

interface FullPagePopupProps {
  setShowPopup: any
}

export function FullPagePopup({ setShowPopup }: FullPagePopupProps) {
  function handleClose() {
    setShowPopup(false)
  }

  return (
    <FullPagePopupContainer>
      <div className="p-5 text-center px-44">
        <FontAwesomeIcon icon={faCircleXmark} onClick={handleClose} />
        <div>
          <img src="logo.png" className="h-28" />
        </div>
        <h2 className="text-center font-bold pb-3 capitalize text-4xl"></h2>
        <div className="p-4">
          <p className="text-center font-bold text-2xl">
            Coastal Ecosystem Enhancement Decision Support (CEEDS) tool
          </p>
        </div>
        <div className="p-4">
          <p className="text-center font-bold text-xl">
            The CEEDS is a critical component of the Sustainable Management of
            Marine Resources (SMMR) funded Restoration of Seagrass for Ocean
            Wealth (ReSOW) UK project.
          </p>
          <p className="text-center font-bold text-xl pt-5">
            The CEEDS tool brings together all data and reports from the project
            in a manner that is accessible and can be explored spatially,
            aligning with the needs and priorities of our community.
          </p>
        </div>
        <div className="p-4">
          <p className="text-center font-bold text-xl text-red-500 uppercase">
            This is a beta version of the tool and we welcome your feedback.
          </p>
        </div>
        {/* <div className="p-4">
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
        </div> */}
        <div className="p-4">
          <div className="grid grid-cols-1 gap-1 text-red-500">
            <a
              href="https://forms.office.com/e/KriKWpWS6x"
              target="_blank"
              className="p-4 cursor-pointer"
              title="Feedback Form"
            >
              <FontAwesomeIcon icon={faClipboardQuestion} className="" />
              <p className="text-center text-md font-bold">Feedback Form</p>
            </a>
          </div>
          <div className="grid grid-cols-2 gap-1 pt-10">
            <a
              href="https://resow.uk/"
              target="_blank"
              className="p-4 cursor-pointer"
              title="Resow Website"
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              <p className="text-center text-sm font-bold">RESOW WEBSITE</p>
            </a>
            <a
              href="https://radiantearth.github.io/stac-browser/#/external/ceeds-tool-store-o.s3-ext.jc.rl.ac.uk/ceeds/stac/catalog.json"
              target="_blank"
              className="p-4 cursor-pointer"
              title="Data Catalog"
            >
              <FontAwesomeIcon icon={faList} />
              <p className="text-center text-sm font-bold">Data Catalog</p>
            </a>
          </div>
        </div>
      </div>
    </FullPagePopupContainer>
  )
}
