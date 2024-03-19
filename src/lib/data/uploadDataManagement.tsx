import { createContext, useState, ReactNode, useContext } from 'react'
// import { useContextHandle } from '../contextHandle'
// import { fetchApiGet } from '../api'

interface UploadDataHandleContextType {
  uploadFormats: string[]
  selectedUploadFormat: string
  setSelectedUploadFormat: (format: string) => void
  selectedUploadInfo: any
  setSelectedUploadInfo: (info: any) => void
}
const UploadDataHandleContext = createContext<
  UploadDataHandleContextType | undefined
>(undefined)

interface UploadDataHandleProviderProps {
  children: ReactNode
}

// eslint-disable-next-line no-undef
export const UploadDataHandleProvider: React.FC<
  UploadDataHandleProviderProps
> = ({ children }) => {
  const uploadFormats = [
    'GeoJSON',
    'GeoTIFF',
    'COG',
    'NetCDF',
    'Shapefile',
    'CSV',
    'KML',
    'KMZ',
    'WMS',
  ]
  const [selectedUploadFormat, setSelectedUploadFormat] = useState('GeoJSON')

  const [selectedUploadInfo, setSelectedUploadInfo] = useState({})

  return (
    <UploadDataHandleContext.Provider
      value={{
        uploadFormats,
        selectedUploadFormat,
        setSelectedUploadFormat,
        selectedUploadInfo,
        setSelectedUploadInfo,
      }}
    >
      {children}
    </UploadDataHandleContext.Provider>
  )
}

export const useUploadDataHandle = (): UploadDataHandleContextType => {
  const context = useContext(UploadDataHandleContext)
  if (!context) {
    throw new Error(
      'useUploadDataHandle must be used within a UploadDataHandleProvider',
    )
  }
  return context
}
