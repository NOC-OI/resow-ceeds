import {
  faBook,
  faCircleXmark,
  faClipboardQuestion,
  faInfoCircle,
  faList,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { FullPagePopupContainer } from './styles'
import styles from './FullPagePopup.module.css'
import { GithubLogo } from 'phosphor-react'

interface FullPagePopupProps {
  setShowPopup: any
  setShowTutorial: any
}

export function FullPagePopup({
  setShowPopup,
  setShowTutorial,
}: FullPagePopupProps) {
  function handleClose() {
    setShowPopup(false)
  }

  function handleTutorial() {
    setShowPopup(false)
    setShowTutorial(true)
  }
  return (
    <FullPagePopupContainer>
      <div
        className="p-5 text-center lg:w-[60%] md:w-[60%] xl:w-[50%] 2xl:w-[40%]"
        onClick={handleClose}
      >
        <FontAwesomeIcon icon={faCircleXmark} onClick={handleClose} />
        <div>
          <img src="logo.png" className="h-20" />
        </div>
        <h2 className="text-center font-bold pb-3 capitalize text-4xl"></h2>
        <div className="p-4">
          <p className="text-center font-bold text-2xl">
            Coastal Ecosystem Enhancement Decision Support (CEEDS) tool
          </p>
        </div>
        <div className="p-2">
          <p className="text-justify font-bold text-lg">
            The CEEDS is a critical component of the Sustainable Management of
            Marine Resources (SMMR) funded Restoration of Seagrass for Ocean
            Wealth (ReSOW) UK project. The CEEDS Tool brings together all data
            and reports from the project in a manner that is accessible and can
            be explored spatially, aligning with the needs and priorities of our
            community.
          </p>
          <p className="text-center font-bold text-xl pt-5"></p>
        </div>
        <div className="p-2 lg:px-32 px-24  flex justify-center items-center">
          <a
            href="https://forms.office.com/e/KriKWpWS6x"
            target="_blank"
            className={`p-2 cursor-pointer ${styles.pulseAnimation}`}
            title="Feedback Form"
          >
            <FontAwesomeIcon icon={faClipboardQuestion} className="" />
            <p className="text-center text-md font-bold">Feedback Survey</p>
          </a>

          <p className="text-center font-bold text-xl text-red-500 uppercase">
            This is a beta version of the tool and we welcome your feedback
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
        <div className="p-2">
          <div className="grid grid-cols-4 gap-1">
            <a
              href="https://resow.uk/"
              target="_blank"
              className="p-2 cursor-pointer opacity-70 hover:opacity-100"
              title="Resow Website"
            >
              <img src="favicon.png" className="h-8 pb-4" />
              {/* <FontAwesomeIcon icon={faInfoCircle} /> */}
              <p className="text-center text-sm font-bold !opacity-100">
                RESOW
              </p>
            </a>
            <div
              onClick={() => handleTutorial()}
              className="p-2 cursor-pointer hover:text-[#D49511]"
              title="Guided tour of the tool"
            >
              <FontAwesomeIcon icon={faBook} />
              <p className="text-center text-sm font-bold">Guided Tour</p>
            </div>
            <a
              href="https://radiantearth.github.io/stac-browser/#/external/ceeds-tool-store-o.s3-ext.jc.rl.ac.uk/ceeds/stac/catalog.json"
              target="_blank"
              className="p-2 cursor-pointer"
              title="Data Catalog"
            >
              <FontAwesomeIcon icon={faList} />
              <p className="text-center text-sm font-bold">Data Catalog</p>
            </a>
            <a
              href="https://github.com/NOC-OI/resow-ceeds"
              target="_blank"
              className="p-2 cursor-pointer"
              title="Code"
            >
              <GithubLogo size={32} />
              <p className="text-center text-sm font-bold">Code</p>
            </a>
          </div>
        </div>
      </div>
    </FullPagePopupContainer>
  )
}
