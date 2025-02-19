import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'

const PrivateRoute = () => {
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated)
  return isAuthenticated ? <Outlet /> : <Navigate to={'/login'} replace />
}

export default PrivateRoute
