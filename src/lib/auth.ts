import Cookies from 'js-cookie'
import decode from 'jwt-decode'

export function getUser() {
  const token = Cookies.get('token')

  if (!token) {
    return
  }

  const user: any = decode(token)
  console.log(user)

  if (user.exp) {
    const expDate = new Date(user.exp)
    const dateNow = new Date()
    if (expDate > dateNow) {
      return user
    }
  }
}
