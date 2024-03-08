import { Outlet } from 'react-router-dom'
import { LayoutContainer } from './styles'
import { ContextHandleProvider } from '../../lib/contextHandle'
import { Loading } from '../../components/Loading'
import { FlashMessages } from '../../components/FlashMessages'

export function DefaulLayout() {
  return (
    <LayoutContainer>
      <ContextHandleProvider>
        <Outlet />
        <Loading />
        <FlashMessages duration={5000} position={'bcenter'} width={'medium'} />
      </ContextHandleProvider>
    </LayoutContainer>
  )
}
