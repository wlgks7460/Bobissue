import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import ScrollToTop from '../components/common/ScrollToTop'
import AdminLoginPage from '../pages/admin/login/AdminLoginPage'
import AdminHome from '../../src/components/admin/home/AdminHome'
import { useSelector } from 'react-redux'

const RootPage = () => {
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated)

  return isAuthenticated ? <AdminHome /> : <AdminLoginPage />
}

export default RootPage
