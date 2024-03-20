import {
  createContext,
  useState,
  ReactNode,
  useContext,
  useEffect,
} from 'react'
// import { useContextHandle } from '../contextHandle'
// import { fetchApiGet } from '../api'

interface UploadDataHandleContextType {
  uploadFormats: string[]
  actualLayerUpload: any
  setActualLayerUpload: (layer: any) => void
  selectedLayersUpload: any
  setSelectedLayersUpload: (layers: any) => void
  listLayersUpload: any
  setListLayersUpload: (layers: any) => void
  actualLayerAction: string
  setActualLayerAction: (action: string) => void
  actualLayerUploadNow: string
  setActualLayerUploadNow: (action: string) => void
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

  const [actualLayerUpload, setActualLayerUpload] = useState<any>({
    uploadFormat: 'GeoJSON',
    layer: {},
  })
  const [actualLayerAction, setActualLayerAction] = useState<string>('')
  const [actualLayerUploadNow, setActualLayerUploadNow] = useState<string>('')
  const [selectedLayersUpload, setSelectedLayersUpload] = useState<any>({})
  const [listLayersUpload, setListLayersUpload] = useState<any>({})
  useEffect(() => {
    if (actualLayerUpload.layer.active) {
      setSelectedLayersUpload((selectedLayersUpload: any) => {
        const newSelectedLayersUpload = { ...selectedLayersUpload }
        return {
          ...newSelectedLayersUpload,
          [actualLayerUpload.layer.name]: {
            name: actualLayerUpload.layer.name,
            data: actualLayerUpload.layer.data,
            data_type: actualLayerUpload.uploadFormat,
          },
        }
      })
      setListLayersUpload((listLayersUpload: any) => {
        const newListLayersUpload = { ...listLayersUpload }
        return {
          ...newListLayersUpload,
          [actualLayerUpload.layer.name]: {
            name: actualLayerUpload.layer.name,
            data: actualLayerUpload.layer.data,
            data_type: actualLayerUpload.uploadFormat,
          },
        }
      })
    }
  }, [actualLayerUpload])
  return (
    <UploadDataHandleContext.Provider
      value={{
        uploadFormats,
        actualLayerUpload,
        setActualLayerUpload,
        selectedLayersUpload,
        setSelectedLayersUpload,
        listLayersUpload,
        setListLayersUpload,
        actualLayerAction,
        setActualLayerAction,
        actualLayerUploadNow,
        setActualLayerUploadNow,
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
