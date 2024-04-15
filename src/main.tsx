import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App'
// import { Buffer } from 'buffer'
// window.Buffer = Buffer

// window.global = globalThis

// eslint-disable-next-line no-undef
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
