import { Outlet } from 'react-router-dom'
import { LayoutContainer } from './styles'
import { ContextHandleProvider } from '../../lib/contextHandle'
import { Loading } from '../../components/Loading'
import { FlashMessages } from '../../components/FlashMessages'
import { PrintPageHandleProvider } from '../../lib/data/printPageManagement'

export function DefaulLayout() {
  return (
    <LayoutContainer>
      <ContextHandleProvider>
        <PrintPageHandleProvider>
          <Outlet />
          <Loading />
          <FlashMessages
            duration={5000}
            position={'bcenter'}
            width={'medium'}
          />
        </PrintPageHandleProvider>
      </ContextHandleProvider>
    </LayoutContainer>
  )
}
