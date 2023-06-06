import { faCircleXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { FormEvent } from 'react'
import Cookies from 'js-cookie'
import { FullPagePopupContainer } from '../FullPagePopup/styles'

interface LoginPopupProps {
  isLogged: any
  setIsLogged: any
  setShowLogin: any
  setFlashMessage: any
  setShowFlash: any
}

export function LoginPopup({
  isLogged,
  setIsLogged,
  setShowLogin,
  setFlashMessage,
  setShowFlash,
}: LoginPopupProps) {
  function handleClose() {
    setShowLogin(false)
  }

  async function handleLogin(event: any) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    const cookieExpiresInSeconds = 60 * 60 * 24 * 30

    if (formData.get('user') === 'NOC' && formData.get('psw') === 'haig-fras') {
      Cookies.set('imfe_logged', 'true', { expires: cookieExpiresInSeconds })
      setFlashMessage({
        messageType: 'success',
        content: 'You have successfully logged in',
      })
      setShowLogin(false)
      setIsLogged(true)
    } else {
      setFlashMessage({
        messageType: 'error',
        content: 'Wrong username or password',
      })
      setShowFlash(true)
    }
  }

  async function handleLogout(event: any) {
    Cookies.remove('imfe_logged')
    setFlashMessage({
      messageType: 'success',
      content: 'You have successfully logged out',
    })
    setShowLogin(false)
    setIsLogged(false)
  }

  return (
    <FullPagePopupContainer>
      {isLogged ? (
        <div className="w-96 align-middle text-center">
          <p className="text-center font-bold pb-3 capitalize text-3xl">
            Are you sure you want do log out?
          </p>
          <div className="flex justify-center gap-2">
            <button onClick={handleLogout} className="normal-button w-full">
              YES
            </button>
            <button onClick={handleClose} className="normal-button  w-full">
              CANCEL
            </button>
          </div>
        </div>
      ) : (
        <div className="w-96 align-middle text-center">
          <FontAwesomeIcon icon={faCircleXmark} onClick={handleClose} />
          <h2 className="text-center font-bold pb-3 capitalize text-3xl">
            Sign In
          </h2>
          <div className="p-4">
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <label htmlFor="user" className="w-full">
                <input
                  type="text"
                  name="user"
                  id="user"
                  className="w-full"
                  placeholder="Username"
                />
              </label>
              <label htmlFor="psw" className="w-full">
                <input
                  type="password"
                  name="psw"
                  id="psw"
                  placeholder="Password"
                  className="w-full"
                />
              </label>
              <button type="submit" className="normal-button">
                Login
              </button>
            </form>
          </div>
        </div>
      )}
    </FullPagePopupContainer>
  )
}
