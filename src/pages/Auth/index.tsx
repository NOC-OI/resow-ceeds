import axios from 'axios'
import Cookies from 'js-cookie'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loading } from '../../components/Loading'

export function Auth() {
  const navigate = useNavigate()

  // const redirectTo = request.cookies.get('redirectTo')?.value

  useEffect(() => {
    const fetchData = async () => {
      const searchParams = new URLSearchParams(document.location.search)
      const code = searchParams.get('code')
      let response

      try {
        response = await axios.post('https://imfe-pilot.ddns.net/user', null, {
          params: {
            code,
          },
        })
      } catch (error) {
        console.log(error)
        navigate('/login?message=not-allowed')
        return
      }

      const user = response.data
      // const redirectURL = redirectTo ?? new URL('/', request.url)

      const cookieExpiresInSeconds = 60 * 60 * 24 * 30

      Cookies.set('token', user, {
        path: '/',
        expires: cookieExpiresInSeconds,
      })
      navigate('/')
    }
    fetchData()
  }, [])

  return (
    <div>
      <Loading />
    </div>
  )
}