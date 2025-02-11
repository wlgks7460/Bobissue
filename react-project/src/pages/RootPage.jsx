import React from 'react'
import { Outlet } from 'react-router-dom'
import ScrollToTop from '../components/common/ScrollToTop'
import LogoutWatcher from '../components/common/LogoutWatcher'

const RootPage = () => {
  return (
    <>
      <LogoutWatcher />
      <ScrollToTop />
      <Outlet />
    </>
  )
}

export default RootPage
