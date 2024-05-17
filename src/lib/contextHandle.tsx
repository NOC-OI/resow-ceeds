import React, {
  createContext,
  useState,
  ReactNode,
  useContext,
  useEffect,
} from 'react'

interface ContextHandleContextType {
  loading: boolean
  setLoading: (loading: boolean) => void
  showFlash: boolean
  setShowFlash: (showFlash: boolean) => void
  flashMessage: {
    messageType: string
    content: string
    duration?: number
  }
  setFlashMessage: (flashMessage: {
    messageType: string
    content: string
    duration?: number
  }) => void
  dialogInfo: any
  setDialogInfo: any
}

const ContextHandleContext = createContext<
  ContextHandleContextType | undefined
>(undefined)

interface ContextHandleProviderProps {
  children: ReactNode
}

export const ContextHandleProvider: React.FC<ContextHandleProviderProps> = ({
  children,
}) => {
  const [loading, setLoading] = useState<boolean>(true)
  const [dialogInfo, setDialogInfo] = useState<any>({})

  const [showFlash, setShowFlash] = useState(false)
  const [flashMessage, setFlashMessage] = useState({
    messageType: '',
    content: '',
  })

  useEffect(() => {
    if (flashMessage.messageType) {
      setShowFlash(true)
    }
  }, [flashMessage])

  return (
    <ContextHandleContext.Provider
      value={{
        loading,
        setLoading,
        showFlash,
        setShowFlash,
        flashMessage,
        setFlashMessage,
        dialogInfo,
        setDialogInfo,
      }}
    >
      {children}
    </ContextHandleContext.Provider>
  )
}

export const useContextHandle = (): ContextHandleContextType => {
  const context = useContext(ContextHandleContext)
  if (!context) {
    throw new Error(
      'useContextHandle must be used within a ContextHandleProvider',
    )
  }
  return context
}
