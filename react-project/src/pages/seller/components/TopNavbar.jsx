import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaSignOutAlt, FaBug, FaHome, FaBars } from 'react-icons/fa'

const TopNavbar = ({ toggleSidebar, user, setSelect }) => {
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
    <nav className='flex items-center justify-between bg-white px-6 py-3  shadow-md shadow-coffeeBrown/20 relative z-50'>
      {/* 왼쪽 영역 (햄버거 메뉴 + 로고) */}
      <div className='flex items-center gap-4'>
        {/* ☰ 햄버거 버튼 */}
        <button
          onClick={toggleSidebar}
          className='text-coffeeBrown p-2 rounded-lg hover:bg-caramelTan/80 focus:outline-none transition'
          aria-label='Toggle Sidebar'
        >
          <FaBars className='w-6 h-6' />
        </button>

        {/* 로고 이미지 */}
        <Link to='/' onClick={() => setSelect(null)}>
          <img
            src='/bobissueLogo2.png'
            alt='로고'
            className='w-30 h-10 object-cover cursor-pointer'
          />
        </Link>
      </div>

      {/* 네비게이션 버튼 그룹 */}
      <div className='ml-auto flex items-center gap-4'>
        {/* 👤 유저 인사 메시지 */}
        <span className='text-coffeeBrown font-semibold'>
          {user?.name || '판매자'}님 안녕하세요!
        </span>

        {/* 🏠 홈 버튼 */}
        <Link
          to='/seller'
          className='p-3 bg-caramelTan/30 text-coffeeBrown rounded-lg hover:bg-caramelTan/80 transition flex items-center'
        >
          <FaHome className='w-5 h-5' />
        </Link>

        {/* 🐞 디버그 모드 토글 버튼 */}
        {/* <button
          onClick={toggleDebugMode}
          className={`p-3 rounded-lg transition ${
            debugMode
              ? 'bg-roastedCocoa hover:bg-mochaBrown text-white'
              : 'bg-caramelTan/50 hover:bg-caramelTan text-coffeeBrown'
          }`}
        >
          <FaBug className='w-5 h-5' />
        </button> */}

        {/* 🚪 로그아웃 버튼 */}
        <button
          onClick={handleLogout}
          className='p-3 bg-rose-500 text-warmBeige rounded-lg hover:bg-rose-600 transition'
        >
          <FaSignOutAlt className='w-5 h-5' />
        </button>
      </div>
    </nav>
  )
}

export default TopNavbar
