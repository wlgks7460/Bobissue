import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../../components/consumer/Navbar'
import SearchBar from '../../components/consumer/SearchBar'
import Footer from '../../components/consumer/Footer'

const ConsumerRoot = () => {
  return (
    <div className='min-h-screen'>
      <Navbar />
      <SearchBar />
      <Outlet />
      <Footer />
    </div>
  )
}

export default ConsumerRoot
