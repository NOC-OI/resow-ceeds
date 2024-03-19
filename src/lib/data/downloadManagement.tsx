import { createContext, useState, ReactNode, useContext } from 'react'
// import { useContextHandle } from '../contextHandle'
// import { fetchApiGet } from '../api'

interface DownloadManagementHandleContextType {
  drawRectangle: any
  setDrawRectangle: any
  rectangleLimits: any
  setRectangleLimits: any
  downloadInputValue: any
  setDownloadInputValue: any
}
const DownloadManagementHandleContext = createContext<
  DownloadManagementHandleContextType | undefined
>(undefined)

interface DownloadManagementHandleProviderProps {
  children: ReactNode
}

// eslint-disable-next-line no-undef
export const DownloadManagementHandleProvider: React.FC<
  DownloadManagementHandleProviderProps
> = ({ children }) => {
  const [rectangleLimits, setRectangleLimits] = useState(null)
  const [drawRectangle, setDrawRectangle] = useState(false)
  const [downloadInputValue, setDownloadInputValue] = useState({
    layers: [],
    region: [49.1, -7.1, 59.1, 0.1],
  })
  // async function getLeaks() {
  //   await fetchApiGet('v1/leaks/', setLeakList, accessToken)
  // }
  return (
    <DownloadManagementHandleContext.Provider
      value={{
        drawRectangle,
        setDrawRectangle,
        rectangleLimits,
        setRectangleLimits,
        downloadInputValue,
        setDownloadInputValue,
      }}
    >
      {children}
    </DownloadManagementHandleContext.Provider>
  )
}

export const useDownloadManagementHandle =
  (): DownloadManagementHandleContextType => {
    const context = useContext(DownloadManagementHandleContext)
    if (!context) {
      throw new Error(
        'useDownloadManagementHandle must be used within a DownloadManagementHandleProvider',
      )
    }
    return context
  }
