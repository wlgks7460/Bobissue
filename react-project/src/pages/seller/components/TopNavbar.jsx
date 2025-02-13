import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaSignOutAlt, FaBug } from 'react-icons/fa' // ✅ FontAwesome 아이콘 추가

const TopNavbar = ({ toggleSidebar }) => {
  const navigate = useNavigate() // 로그인 페이지로 이동하기 위한 네비게이션 함수
  const [debugMode, setDebugMode] = useState(false) // ✅ 디버그 모드 상태

  // ✅ 컴포넌트가 마운트될 때 localStorage에서 debug_mode 값 불러오기
  useEffect(() => {
    const storedDebugMode = localStorage.getItem('debug_mode')
    if (storedDebugMode) {
      setDebugMode(storedDebugMode === 'true') // "true"를 boolean 값으로 변환
    }
  }, [])

  // ✅ 디버그 모드 토글 함수
  const toggleDebugMode = () => {
    const newMode = !debugMode
    setDebugMode(newMode)
    localStorage.setItem('debug_mode', newMode) // localStorage에 저장
  }

  // ✅ 로그아웃 함수
  const handleLogout = () => {
    localStorage.removeItem('access_token') // 로컬스토리지에서 access_token 삭제
    sessionStorage.removeItem('access_token') // 세션스토리지에서도 삭제 (필요한 경우)
    navigate('/seller/login') // 로그인 페이지로 이동
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
        <Link
          to='/'
          className='text-sm text-indigo-600 no-underline hover:underline focus:underline'
        >
          Home
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
