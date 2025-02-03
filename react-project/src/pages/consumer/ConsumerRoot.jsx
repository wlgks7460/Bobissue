import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../../components/consumer/common/Navbar'
import Footer from '../../components/consumer/common/Footer'

const ConsumerRoot = () => {
  return (
    <div className='min-h-screen relative'>
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  )
}

export default ConsumerRoot
