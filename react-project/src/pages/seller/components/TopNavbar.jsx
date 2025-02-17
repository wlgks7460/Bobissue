import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaSignOutAlt, FaBug, FaHome, FaBars } from 'react-icons/fa' // ✅ 햄버거 아이콘 변경

const TopNavbar = ({ toggleSidebar, user }) => {
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
    <nav className='flex items-center justify-between bg-gray-100 px-6 py-3 border-b border-gray-300 shadow-md relative z-50'>
      {/* 왼쪽 영역 (햄버거 메뉴 + 로고) */}
      <div className='flex items-center gap-4'>
        {/* ☰ 햄버거 버튼 */}
        <button
          onClick={toggleSidebar}
          className='text-gray-800 p-2 rounded-lg hover:bg-gray-300 focus:outline-none transition'
          aria-label='Toggle Sidebar'
        >
          <FaBars className='w-6 h-6' />
        </button>

        {/* 로고 이미지 */}
        <Link to='/seller'>
          <img
            src='/bobissueLogo_gray.png'
            alt='로고'
            className='w-30 h-10 object-cover cursor-pointer'
          />
        </Link>
      </div>

      {/* 네비게이션 버튼 그룹 */}
      <div className='ml-auto flex items-center gap-4'>
        {/* 👤 유저 인사 메시지 */}
        <span className='text-gray-800 font-semibold'>{user?.name || '판매자'}님 안녕하세요!</span>

        {/* 🏠 홈 버튼 */}
        <Link
          to='/'
          className='p-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition flex items-center'
        >
          <FaHome className='w-5 h-5' />
        </Link>

        {/* 🐞 디버그 모드 토글 버튼 */}
        <button
          onClick={toggleDebugMode}
          className={`p-3 rounded-lg transition ${
            debugMode
              ? 'bg-gray-600 hover:bg-gray-700 text-white'
              : 'bg-gray-400 hover:bg-gray-500 text-white'
          }`}
        >
          <FaBug className='w-5 h-5' />
        </button>

        {/* 🚪 로그아웃 버튼 */}
        <button
          onClick={handleLogout}
          className='p-3 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition'
        >
          <FaSignOutAlt className='w-5 h-5' />
        </button>
      </div>
    </nav>
  )
}

export default TopNavbar
