import Cookies from 'js-cookie'
import decode from 'jwt-decode'

export function getUser() {
  const token = Cookies.get('token')

  if (!token) {
    return
  }

  const user = decode(token)

  return user
}
