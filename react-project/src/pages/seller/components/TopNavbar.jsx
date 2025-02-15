import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaSignOutAlt, FaBug, FaHome, FaBars } from 'react-icons/fa' // ✅ 햄버거 아이콘 변경

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
    <nav className="flex items-center justify-between bg-white px-6 py-3 border-b border-brown-300 shadow-md relative z-50">
      {/* 왼쪽 영역 (햄버거 메뉴 + 로고) */}
      <div className="flex items-center gap-4">
        {/* ☰ 햄버거 버튼 */}
        <button
          onClick={toggleSidebar}
          className="text-brown-700 p-2 rounded-lg hover:bg-brown-200 focus:outline-none transition"
          aria-label="Toggle Sidebar"
        >
          <FaBars className="w-6 h-6" />
        </button>

        {/* 로고 이미지 */}
        <Link to="/">
          <img
            src="/bobissueLogo.png"
            alt="로고"
            className="w-16 h-12 object-cover cursor-pointer"
          />
        </Link>
      </div>

      {/* 네비게이션 버튼 그룹 */}
      <div className="ml-auto flex items-center gap-4">
        {/* 🏠 홈 버튼 */}
        <Link
          to="/"
          className="p-3 bg-brown-100 text-brown-700 rounded-lg hover:bg-brown-200 transition"
        >
          <FaHome className="w-5 h-5" />
        </Link>

        {/* 🐞 디버그 모드 토글 버튼 */}
        <button
          onClick={toggleDebugMode}
          className={`p-3 rounded-lg transition ${
            debugMode ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-gray-500 hover:bg-gray-600 text-white'
          }`}
        >
          <FaBug className="w-5 h-5" />
        </button>

        {/* 🚪 로그아웃 버튼 */}
        <button
          onClick={handleLogout}
          className="p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
        >
          <FaSignOutAlt className="w-5 h-5" />
        </button>
      </div>
    </nav>
  )
}

export default TopNavbar
