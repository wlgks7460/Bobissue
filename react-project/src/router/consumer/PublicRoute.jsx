import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'

const PublicRoute = () => {
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated)
  return !isAuthenticated ? <Outlet /> : <Navigate to={'/'} replace />
}

export default PublicRoute
