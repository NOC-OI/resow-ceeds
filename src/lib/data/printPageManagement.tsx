import { createContext, useState, ReactNode, useContext } from 'react'
// import { useContextHandle } from '../contextHandle'
// import { fetchApiGet } from '../api'

interface PrintPageHandleContextType {
  canSelect: boolean
  setCanSelect: any
  isSelecting: boolean
  setIsSelecting: any
  startPoint: any
  setStartPoint: any
  selectionBox: any
  setSelectionBox: any
  logoPosition: string
  setLogoPosition: any
}
const PrintPageHandleContext = createContext<
  PrintPageHandleContextType | undefined
>(undefined)

interface PrintPageHandleProviderProps {
  children: ReactNode
}

// eslint-disable-next-line no-undef
export const PrintPageHandleProvider: React.FC<
  PrintPageHandleProviderProps
> = ({ children }) => {
  const [canSelect, setCanSelect] = useState(false)
  const [isSelecting, setIsSelecting] = useState(false)
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 })
  const [logoPosition, setLogoPosition] = useState('bottom-right')

  const [selectionBox, setSelectionBox] = useState({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    visible: false,
  })

  return (
    <PrintPageHandleContext.Provider
      value={{
        canSelect,
        setCanSelect,
        isSelecting,
        setIsSelecting,
        startPoint,
        setStartPoint,
        selectionBox,
        setSelectionBox,
        logoPosition,
        setLogoPosition,
      }}
    >
      {children}
    </PrintPageHandleContext.Provider>
  )
}

export const usePrintPageHandle = (): PrintPageHandleContextType => {
  const context = useContext(PrintPageHandleContext)
  if (!context) {
    throw new Error(
      'usePrintPageHandle must be used within a PrintPageHandleProvider',
    )
  }
  return context
}
