import React from 'react'
import ReactDOM from 'react-dom/client'
import { ToastContainer } from 'react-toast'

import SocketProvider from '@/providers/SocketProvider'
import App from '@/components/App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <SocketProvider>
      <App />
    </SocketProvider>
    <ToastContainer position='top-center' delay={5000} />
  </React.StrictMode>
)
