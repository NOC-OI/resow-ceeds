import { useEffect, useRef, useState } from 'react'
import Draggable from 'react-draggable'
import { InfoButtonBoxContainer } from '../InfoButtonBox/styles'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons'
import { usePrintPageHandle } from '../../lib/data/printPageManagement'
import { LayerTypeOptionsContainer } from '../DataExplorationTypeOptions/styles'
import styles from '../DataExplorationTypeOptions/DataExplorationTypeOptions.module.css'
import { Button } from '@mui/material'
import { useContextHandle } from '../../lib/contextHandle'

interface PrintSelectionProps {
  setPrintBox: any
}

export function PrintSelection({ setPrintBox }: PrintSelectionProps) {
  function handleClose() {
    Object.keys(removableIds).forEach((key) => {
      const element = document.getElementById(removedIds[key][0])
      if (element) element.style.opacity = '1'
    })
    setCanSelect(false)
    setPrintBox(false)
  }
  const nodeRef = useRef(null)
  const { canSelect, setCanSelect, logoPosition, setLogoPosition } =
    usePrintPageHandle()
  const { setFlashMessage } = useContextHandle()
  const toggleCanSelect = () => {
    setFlashMessage({
      messageType: 'warning',
      content: 'Select the area to be printed',
      duration: 3000,
    })
    setCanSelect(!canSelect)
  }
  const removableIds = {
    'Main Bar': ['side-selection', '1'],
    'Info Box': ['info-subsection', '1'],
    'Legend Box': ['legend-box', '1'],
    'Map Pop Up Box': ['mappopup-box', '1'],
    'Graph Box': ['graph-box', '1'],
    'Bottom Right Box': ['infobox-container', '1'],
  }

  const [removedIds, setRemovedIds] = useState(removableIds)

  function handleChangeRemovableId(e, key) {
    setRemovedIds((prev) => {
      const newRemovedIds = { ...prev }
      if (e.target.checked) {
        newRemovedIds[key][1] = '1'
      } else {
        newRemovedIds[key][1] = '0'
      }
      return newRemovedIds
    })
  }
  function verifyIfItIsSelected(key) {
    return removedIds[key][1] === '1'
  }
  useEffect(() => {
    Object.keys(removedIds).forEach((key) => {
      const element = document.getElementById(removedIds[key][0])
      if (element) element.style.opacity = removedIds[key][1]
    })
  }, [removedIds])

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setCanSelect(false)
      }
    }

    // Add event listener when component mounts
    window.addEventListener('keydown', handleKeyDown)

    // Remove event listener when component unmounts
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [setCanSelect])
  return (
    <Draggable nodeRef={nodeRef} cancel=".clickable">
      <InfoButtonBoxContainer
        id="print-selection-box"
        ref={nodeRef}
        className={`w-max ${canSelect ? 'opacity-0' : 'opacity-100'}`}
      >
        <div>
          <FontAwesomeIcon
            icon={faCircleXmark}
            onClick={handleClose}
            className="clickable"
          />
        </div>
        <div className="font-bold text-center pb-3 text-xl">Export Image</div>
        <div className="font-semibold text-center text-md">Filter area</div>
        <div className="pb-2 flex flex-col !justify-start">
          {Object.keys(removableIds).map((removableId) => (
            <>
              <div></div>
              <LayerTypeOptionsContainer key={removableId}>
                <div></div>
                <div id="type-option" className="flex justify-start">
                  <label
                    htmlFor={removableId}
                    title={`Remove/add the ${removableId} from the image`}
                  >
                    <input
                      id={removableId}
                      onChange={(e) => handleChangeRemovableId(e, removableId)}
                      className={styles.chk}
                      type="checkbox"
                      checked={verifyIfItIsSelected(removableId)}
                      name={removableId}
                    />
                    <label
                      htmlFor={removableId}
                      className={`${styles.switch}`}
                      title={`Remove/add the ${removableId} from the image`}
                    >
                      <span className={styles.slider}></span>
                    </label>
                    <p>{removableId}</p>
                  </label>
                </div>
              </LayerTypeOptionsContainer>
            </>
          ))}
          <div className="py-4 flex flex-col justify-between items-center gap-4">
            <div className="font-semibold text-center text-md">
              Logo Position
            </div>
            <select
              id="cycle-select"
              value={logoPosition}
              onChange={(e) => setLogoPosition(e.target.value)}
              className="clickable bg-black border border-black bg-opacity-20 text-white text-sm rounded-lg  block w-max p-2 "
            >
              <option
                className="!bg-black !bg-opacity-80 opacity-30 !text-white"
                value="bottom-right"
              >
                Bottom-Right
              </option>
              <option
                className="!bg-black !bg-opacity-80 !text-white"
                value="bottom-left"
              >
                Bottom-Left
              </option>
              <option
                className="!bg-black !bg-opacity-80 !text-white"
                value="top-right"
              >
                Top-Right
              </option>
              <option
                className="!bg-black !bg-opacity-80 !text-white hover:!bg-opacity-100 hover:!bg-black"
                value="top-left"
              >
                Top-Left
              </option>
            </select>
          </div>
          <Button
            onClick={toggleCanSelect}
            disabled={canSelect}
            variant="contained"
            className="!w-full !text-white !bg-black !rounded-lg opacity-60 hover:!opacity-80"
          >
            Select Area
          </Button>
        </div>
      </InfoButtonBoxContainer>
    </Draggable>
  )
}