import React from 'react'
import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token')
  const hasAuthCookie = document.cookie.split(';').some((cookie) => cookie.trim().startsWith('token='))

  if (!token && !hasAuthCookie) {
    return <Navigate to="/" replace />
  }

  return children
}

export default ProtectedRoute