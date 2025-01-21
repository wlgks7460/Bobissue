import React from 'react'

import Navbar from '../../components/consumer/Navbar'

const Home = () => {
  return (
    <div>
      <Navbar />
      <div className='flex justify-center'>
        <div className='border w-full'>이벤트 배너</div>
      </div>
    </div>
  )
}

export default Home
