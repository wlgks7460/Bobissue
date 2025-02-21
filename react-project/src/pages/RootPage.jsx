import React from 'react'
import { Outlet } from 'react-router-dom'
import ScrollToTop from '../components/common/ScrollToTop'

const RootPage = () => {
  return (
    <>
      <ScrollToTop />
      <Outlet />
    </>
  )
}

export default RootPage
