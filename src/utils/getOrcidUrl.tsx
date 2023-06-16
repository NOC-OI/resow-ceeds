export function getOrcidUrl() {
  // const rootURl = 'https://sandbox.orcid.org/oauth/authorize'
  const rootURl = 'https://orcid.org/oauth/authorize'

  // const MAPBOX_API_KEY = import.meta.env.VITE_MAPBOX_API_KEY

  const options = {
    client_id: import.meta.env.VITE_ORCID_CLIENT_ID as string,
    redirect_uri: import.meta.env.VITE_ORCID_CLIENT_REDIRECT_URI as string,
    response_type: 'code',
    scope: '/authenticate',
  }

  const qs = new URLSearchParams(options)

  return `${rootURl}?${qs.toString()}`
}
