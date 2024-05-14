import { useContextHandle } from '../../lib/contextHandle'
import { LoadingContainer, LoadingSpinner } from './styles'

export function Loading() {
  const { loading } = useContextHandle()
  return (
    <>
      {loading && (
        <LoadingContainer id="loading">
          <LoadingSpinner>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </LoadingSpinner>
        </LoadingContainer>
      )}
    </>
  )
}
