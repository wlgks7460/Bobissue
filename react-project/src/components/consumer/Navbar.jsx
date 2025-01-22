import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <div className='w-full py-3 px-2 flex justify-between border-b'>
      <h3 className='text-3xl'>LOGO</h3>
      <div className='flex items-center gap-3'>
        <Link to='/login'>로그인</Link>
        <Link to='/signup'>회원가입</Link>
      </div>
    </div>
  )
}

export default Navbar
