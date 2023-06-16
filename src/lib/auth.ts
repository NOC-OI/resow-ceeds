import Cookies from 'js-cookie'
import decode from 'jwt-decode'

interface User {
  sub: string
  name: string
  orcid: string
  access_token: string
}

export function getUser(): User {
  const token = Cookies.get('token')

  if (!token) {
    throw new Error('Unauthenticated.')
  }

  const user: User = decode(token)

  return user
}
