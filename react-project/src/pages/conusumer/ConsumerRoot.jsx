import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../../components/consumer/Navbar'
import Footer from '../../components/consumer/Footer'

const ConsumerRoot = () => {
  return (
    <div className='min-h-screen'>
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  )
}

export default ConsumerRoot
