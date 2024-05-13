import { useEffect, useState } from 'react'
import { useContextHandle } from '../../lib/contextHandle'
import { usePrintPageHandle } from '../../lib/data/printPageManagement'
import domToImageMore from 'dom-to-image-more'

export function PrintSelectionArea() {
  const {
    canSelect,
    setCanSelect,
    isSelecting,
    setIsSelecting,
    startPoint,
    setStartPoint,
    selectionBox,
    setSelectionBox,
    logoPosition,
  } = usePrintPageHandle()

  const { setFlashMessage } = useContextHandle()

  const handleMouseDown = (e) => {
    if (!canSelect) return

    const rect = e.target.getBoundingClientRect()
    const x = e.clientX - rect.left // x position within the element.
    const y = e.clientY - rect.top // y position within the element.
    setIsSelecting(true)
    setStartPoint({ x, y })
    setSelectionBox((prev) => ({ ...prev, visible: true }))
  }

  const handleMouseUp = () => {
    if (!canSelect || !isSelecting) return

    setIsSelecting(false)
    const oldSelectionBox = { ...selectionBox }
    setFlashMessage({
      messageType: 'warning',
      content: 'Your image is beeing processed, please wait...',
      duration: 2500,
    })
    setTimeout(() => {
      setSelectionBox((selectionBox) => ({ ...selectionBox, visible: false }))
    }, 1000)
    setTimeout(() => {
      captureSelectedArea(oldSelectionBox)
    }, 3000)
  }

  const handleMouseMove = (e) => {
    if (!isSelecting || !canSelect) return
    e.preventDefault()
    const x = e.clientX
    const y = e.clientY
    setSelectionBox({
      left: Math.min(startPoint.x, x),
      top: Math.min(startPoint.y, y),
      width: Math.abs(x - startPoint.x),
      height: Math.abs(y - startPoint.y),
      visible: true,
    })
  }

  const captureSelectedArea = (oldSelectionBox) => {
    const element = document.body
    domToImageMore
      .toPng(element)
      .then((dataUrl) => {
        const img = new Image()
        img.onload = () => {
          const fullCanvas = document.createElement('canvas')
          fullCanvas.width = img.width
          fullCanvas.height = img.height
          const fullCtx = fullCanvas.getContext('2d')
          fullCtx.drawImage(img, 0, 0, img.width, img.height)
          const selectionCanvas = document.createElement('canvas')
          const { width, height } = oldSelectionBox
          selectionCanvas.width = width
          selectionCanvas.height = height
          const selectionCtx = selectionCanvas.getContext('2d')
          selectionCtx.drawImage(
            fullCanvas,
            oldSelectionBox.left,
            oldSelectionBox.top,
            width,
            height,
            0,
            0,
            width,
            height,
          )
          // const canvas = document.createElement('canvas')
          // canvas.width = img.width
          // canvas.height = img.height
          // const ctx = canvas.getContext('2d')
          // ctx.drawImage(img, 0, 0, img.width, img.height)
          const logo = new Image()
          logo.src = 'favicon.png'
          logo.onload = () => {
            const logoWidth = 100
            const logoHeight = (logo.height / logo.width) * logoWidth
            let logoX: number
            let logoY: number
            if (logoPosition === 'top-left') {
              logoX = 10
              logoY = 10
            } else if (logoPosition === 'top-right') {
              logoX = selectionCanvas.width - logoWidth - 10
              logoY = 10
            } else if (logoPosition === 'bottom-left') {
              logoX = 10
              logoY = selectionCanvas.height - logoHeight - 10
            } else {
              logoX = selectionCanvas.width - logoWidth - 10
              logoY = selectionCanvas.height - logoHeight - 10
            }
            selectionCtx.drawImage(logo, logoX, logoY, logoWidth, logoHeight)
            const finalDataUrl = selectionCanvas.toDataURL('image/png')
            const link = document.createElement('a')
            link.href = finalDataUrl
            const date = new Date()
            const timestamp =
              date.getFullYear() +
              '-' +
              (date.getMonth() + 1).toString().padStart(2, '0') +
              '-' +
              date.getDate().toString().padStart(2, '0') +
              '_' +
              date.getHours().toString().padStart(2, '0') +
              '-' +
              date.getMinutes().toString().padStart(2, '0') +
              '-' +
              date.getSeconds().toString().padStart(2, '0')

            link.download = 'ceeds_' + timestamp + '.png'
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            setCanSelect(false)
          }
        }
        img.src = dataUrl
        // const link = document.createElement('a')
        // link.href = dataUrl
        // link.download = 'captured-image.png'
        // document.body.appendChild(link)
        // link.click()
        // document.body.removeChild(link)
        // setCanSelect(false)
        setFlashMessage({
          messageType: 'success',
          content: 'Image captured successfully!',
          duration: 5000,
        })
      })
      .catch((error) => {
        console.error('dom-to-image-more error:', error)
        setCanSelect(false)
        setFlashMessage({
          messageType: 'error',
          content: 'Error capturing image, please try again.',
        })
      })
  }

  const finalizeSelection = () => {
    const box = isMobile
      ? {
          left: 0,
          top: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        }
      : selectionBox
    setSelectionBox((prev) => ({ ...prev, visible: false }))
    captureSelectedArea(box)
  }

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 768)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  useEffect(() => {
    if (isMobile && canSelect) {
      finalizeSelection()
    }
  }, [isMobile, canSelect])

  return (
    <div
      className={`w-screen h-screen ${
        canSelect ? '!cursor-crosshair' : ''
      } absolute top-0 left-0 !z-[9999]`}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
    >
      {canSelect && (
        <div
          style={{
            position: 'absolute',
            border: '2px dashed #000',
            backgroundColor: 'rgba(0, 0, 255, 0.2)',
            left: `${selectionBox.left}px`,
            top: `${selectionBox.top}px`,
            width: `${selectionBox.width}px`,
            height: `${selectionBox.height}px`,
            display: selectionBox.visible ? 'block' : 'none',
          }}
        ></div>
      )}
    </div>
  )
}
