import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

const TopNavbar = ({ toggleSidebar }) => {
  const navigate = useNavigate() // 로그인 페이지로 이동하기 위한 네비게이션 함수

  // 로그아웃 함수
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

        {/* 로그아웃 버튼 추가 */}
        <button
          onClick={handleLogout}
          className='bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none'
        >
          로그아웃
        </button>
      </div>
    </nav>
  )
}

export default TopNavbar
