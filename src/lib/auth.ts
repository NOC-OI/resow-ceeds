import Cookies from 'js-cookie'
import decode from 'jwt-decode'

export function getUser() {
  const token = Cookies.get('token')

  if (!token) {
    return
  }

  const user: any = decode(token)

  if (user.exp) {
    const expDate = new Date(user.exp)
    const dateNow = new Date()
    if (expDate < dateNow) {
      Cookies.remove('token')
    } else {
      return user
    }
  } else {
    Cookies.remove('token')
  }
}
