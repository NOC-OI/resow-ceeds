import { Route, Routes } from 'react-router-dom'
import { DefaulLayout } from './layouts/DefaultLayout/index'
import { ThreeD } from './pages/ThreeD'
import { TileServer } from './pages/TileServer'

export function Router() {
  return (
    <Routes>
      <Route path="/" element={<DefaulLayout />}>
        <Route path="/tileserver" element={<TileServer />} />
        <Route path="/" element={<TileServer />} />
        <Route path="/notileserver" element={<TileServer />} />
        <Route path="/3d" element={<ThreeD />} />
      </Route>
    </Routes>
  )
}
