import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext'
import { SocketProvider } from './context/SocketContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <SocketProvider>
      <BrowserRouter>
        <React.StrictMode>
          <App />
          <Toaster />
        </React.StrictMode>
      </BrowserRouter>
    </SocketProvider>
  </AuthProvider>,
)
