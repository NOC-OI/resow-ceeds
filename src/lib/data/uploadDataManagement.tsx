import {
  createContext,
  useState,
  ReactNode,
  useContext,
  useEffect,
} from 'react'
import { defaultOpacity } from '../map/utils'
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
  actualLayerNowUpload: string[]
  setActualLayerNowUpload: (action: string[]) => void
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
    dataType: 'GeoJSON',
    colors: ['#0859fc', '#fd1317'],
    data: '',
    name: '',
    active: false,
  })
  const [selectedLayersUpload, setSelectedLayersUpload] = useState<any>({})
  const [listLayersUpload, setListLayersUpload] = useState<any>({})
  const [actualLayerNowUpload, setActualLayerNowUpload] = useState<string[]>([])
  useEffect(() => {
    if (actualLayerUpload.active) {
      setSelectedLayersUpload((selectedLayersUpload: any) => {
        const newSelectedLayersUpload = { ...selectedLayersUpload }
        return {
          ...newSelectedLayersUpload,
          [`uploaded_${actualLayerUpload.name}`]: {
            name: actualLayerUpload.name,
            data: actualLayerUpload.data,
            dataType: actualLayerUpload.dataType,
            url: actualLayerUpload.url,
            colors: actualLayerUpload.colors,
            scale: actualLayerUpload.scale,
            opacity: defaultOpacity,
          },
        }
      })
      setListLayersUpload((listLayersUpload: any) => {
        const newListLayersUpload = { ...listLayersUpload }
        return {
          ...newListLayersUpload,
          [actualLayerUpload.name]: {
            name: actualLayerUpload.name,
            data: actualLayerUpload.data,
            url: actualLayerUpload.url,
            dataType: actualLayerUpload.dataType,
            colors: actualLayerUpload.colors,
            scale: actualLayerUpload.scale,
            opacity: defaultOpacity,
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
        actualLayerNowUpload,
        setActualLayerNowUpload,
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