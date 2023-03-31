import { Route, Routes } from 'react-router-dom'
import { DefaulLayout } from './layouts/DefaultLayout/index'
import { Bathymetry } from './pages/Bathymetry'
import { Home } from './pages/Home'
import { TileServer } from './pages/TileServer'

export function Router() {
  return (
    <Routes>
      <Route path="/" element={<DefaulLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/tileserver" element={<TileServer />} />
        <Route path="/bathymetry" element={<Bathymetry />} />
      </Route>
    </Routes>
  )
}
