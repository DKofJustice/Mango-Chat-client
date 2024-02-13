import { Routes, Route, Navigate } from 'react-router-dom'
import LoginHeader from './components/LoginHeader'
import LoginPage from './pages/Login/LoginPage'
import Register from './pages/Register/Register'
import EllipseBlue from './assets/Ellipse Blue.svg'
import Header from './components/Header'
import ChatRoom from './pages/ChatRoom/ChatRoom'
import ProtectedRoute from './components/ProtectedRoute'

function App() {

  return (
    <div className='bg-dark-blue-100 w-full h-screen overflow-hidden relative'>
      <div className='relative z-[100]'>
        <Routes>
          <Route element={<LoginHeader/>}>
            <Route path='/login' element={<LoginPage/>} />
            <Route path='/register' element={<Register/>} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route element={<Header/>}>
              <Route path='/chat' element={<ChatRoom/>} />
            </Route>
          </Route>

          <Route path='*' element={<Navigate to='/chat' />} />
        </Routes>
      </div>
      <div className='absolute z-[10] -bottom-[15rem]'>
        <img src={EllipseBlue} alt="Ellipse Blue" />
      </div>
    </div>
  )
}

export default App
