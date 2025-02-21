import React, { useState, useEffect, useReducer } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaSignOutAlt, FaHome, FaBars } from 'react-icons/fa'
import { useDispatch } from 'react-redux'
import { userReducerActions } from '../../../redux/reducers/userSlice'

const TopNavbar = ({ toggleSidebar, user, setSelect }) => {
  const navigate = useNavigate()
  const [debugMode, setDebugMode] = useState(false)
  const dispatch = useDispatch()
  useEffect(() => {
    const storedDebugMode = localStorage.getItem('debug_mode')
    if (storedDebugMode) {
      setDebugMode(storedDebugMode === 'true')
    }
  }, [])

  const handleLogout = () => {
    dispatch(userReducerActions.logout())
    navigate('/seller/login')
  }

  return (
    <nav className='flex items-center justify-between bg-white px-6 py-3 shadow-md shadow-coffeeBrown/20 relative z-50'>
      {/* Left Section (Hamburger Menu + Logo) */}
      <div className='flex items-center gap-4'>
        <button
          onClick={toggleSidebar}
          className='text-coffeeBrown p-2 rounded-lg hover:bg-caramelTan/80 focus:outline-none transition'
          aria-label='Toggle Sidebar'
        >
          <FaBars className='w-6 h-6' />
        </button>

        {/* Logo */}
        <Link to='/seller' onClick={() => setSelect(null)}>
          <img
            src='/bobissueLogo2.png'
            alt='Bobissue Logo'
            className='w-30 h-10 object-cover cursor-pointer'
          />
        </Link>
      </div>

      {/* Navigation Button Group */}
      <div className='ml-auto flex items-center gap-4'>
        <div className='flex items-center'>
          <span className='text-mochaBrown font-semibold'>{user ? user.name : '판매자'}</span>
          <p className='text-coffeeBrown'>님 안녕하세요!</p>
        </div>

        {/* Home Button */}
        <Link
          to='/'
          className='p-3 bg-caramelTan/30 text-coffeeBrown rounded-lg hover:bg-caramelTan/80 transition flex items-center'
          aria-label='Go to Home'
          onClick={handleLogout}
        >
          <FaHome className='w-5 h-5' />
        </Link>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className='p-3 bg-rose-500 text-warmBeige rounded-lg hover:bg-rose-600 transition'
          aria-label='Logout'
        >
          <FaSignOutAlt className='w-5 h-5' />
        </button>
      </div>
    </nav>
  )
}

export default TopNavbar
