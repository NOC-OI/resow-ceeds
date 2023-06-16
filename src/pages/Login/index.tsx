import { useEffect, useState } from 'react'
import { FlashMessages } from '../../components/FlashMessages'
import { LoginPopup } from '../../components/LoginPopup'
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom'

export function LoginPage() {
  const navigate = useNavigate()

  const [showFlash, setShowFlash] = useState(false)
  const [flashMessage, setFlashMessage] = useState({
    messageType: '',
    content: '',
  })

  useEffect(() => {
    const searchParams = new URLSearchParams(document.location.search)
    console.log(searchParams)
    const message = searchParams.get('message')
    if (message) {
      setFlashMessage({
        messageType: 'error',
        content: 'ORCID ID not allowed to login in this page',
      })
      setShowFlash(true)
    }
  }, [])

  const [isLogged, setIsLogged] = useState(!!Cookies.get('token'))

  if (isLogged) {
    navigate('/')
  }

  return (
    <>
      <LoginPopup
        isLogged={isLogged}
        setIsLogged={setIsLogged}
        setFlashMessage={setFlashMessage}
      />
      {showFlash && (
        <FlashMessages
          type={flashMessage.messageType}
          message={flashMessage.content}
          duration={5000}
          active={showFlash}
          setActive={setShowFlash}
          position={'bcenter'}
          width={'medium'}
        />
      )}
    </>
  )
}
