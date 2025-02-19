import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../../components/consumer/common/Navbar'
import Footer from '../../components/consumer/common/Footer'
import { useSelector } from 'react-redux'
import SellerLink from '../../components/consumer/common/SellerLink'
import Loader from '../../components/common/Loader'

const ConsumerRoot = () => {
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated)
  const loginStatus = useSelector((state) => state.user.status)
  const loading = useSelector((state) => state.loading.loading)
  return (
    <div className='min-h-screen relative'>
      {!isAuthenticated && loginStatus !== 'consumer' && <SellerLink />}
      <Navbar />
      <Outlet />
      <Footer />
      {loading && <Loader />}
    </div>
  )
}

export default ConsumerRoot
