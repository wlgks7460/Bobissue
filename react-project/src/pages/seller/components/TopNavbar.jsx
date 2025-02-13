import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaSignOutAlt, FaBug, FaHome } from 'react-icons/fa' // ✅ Home 아이콘 추가

const TopNavbar = ({ toggleSidebar }) => {
  const navigate = useNavigate()
  const [debugMode, setDebugMode] = useState(false)

  useEffect(() => {
    const storedDebugMode = localStorage.getItem('debug_mode')
    if (storedDebugMode) {
      setDebugMode(storedDebugMode === 'true')
    }
  }, [])

  const toggleDebugMode = () => {
    const newMode = !debugMode
    setDebugMode(newMode)
    localStorage.setItem('debug_mode', newMode)
  }

  const handleLogout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    navigate('/seller/login')
  }

  return (
    <nav className='flex items-center justify-between bg-gray-100 px-4 py-3 border-b-2 relative z-50'>
      {/* 햄버거 버튼 */}
      <button
        onClick={toggleSidebar}
        className='text-gray-600 p-2 rounded-md hover:bg-gray-200 focus:outline-none'
        aria-label='Toggle Sidebar'
      >
        <svg
          fill='none'
          strokeWidth={1.5}
          stroke='currentColor'
          viewBox='0 0 24 24'
          xmlns='http://www.w3.org/2000/svg'
          className='w-6 h-6'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5'
          />
        </svg>
      </button>

      {/* 로고 이미지 */}
      <Link to=''>
        <img
          src='/path/to/your/image.png'
          alt='이미지'
          className='w-12 h-12 object-cover cursor-pointer'
        />
      </Link>

      {/* 네비게이션 링크 */}
      <div className='ml-auto flex items-center gap-4'>
        {/* ✅ 홈 버튼 (아이콘) */}
        <Link
          to='/'
          className='p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none'
        >
          <FaHome className='w-5 h-5' />
        </Link>

        {/* ✅ 디버그 모드 토글 버튼 (아이콘) */}
        <button
          onClick={toggleDebugMode}
          className={`p-2 rounded-full focus:outline-none ${
            debugMode ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-500 hover:bg-gray-600'
          }`}
        >
          <FaBug className='text-white w-5 h-5' />
        </button>

        {/* ✅ 로그아웃 버튼 (아이콘) */}
        <button
          onClick={handleLogout}
          className='p-2 bg-red-500 text-white rounded-full hover:bg-red-600 focus:outline-none'
        >
          <FaSignOutAlt className='w-5 h-5' />
        </button>
      </div>
    </nav>
  )
}

export default TopNavbar
