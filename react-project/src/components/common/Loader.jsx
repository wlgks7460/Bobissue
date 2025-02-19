import React from 'react'
import { SyncLoader } from 'react-spinners'
import bobIssueLogo from '../../assets/bobissueLogo.png'

const Loader = () => {
  return (
    <div className='w-full h-[100vh] bg-white/50 flex flex-col justify-center items-center absolute top-0 left-0'>
      <img src={bobIssueLogo} alt='밥이슈 로고' className='w-[100px] h-[100px]' />
      <SyncLoader color='#6F4E37' size={20} speedMultiplier={1} />
    </div>
  )
}

export default Loader
