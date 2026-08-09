import { useState } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
// import ProtectedRoute from './components/ProtectedRoute'
import Auth from './components/Auth'
function App() {

  return (
    <>
       <Routes>
          <Route path="/"   element={<Auth />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    </>
  )
}

export default App
