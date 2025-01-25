import React from 'react'

const AdminNav = ({ onLogout }) => {
  return (
    <nav className='fixed top-0 left-64 w-[calc(100%-16rem)] bg-white shadow-md z-50'>
      <div className='px-6 py-3 flex justify-between items-center'>
        {/* 페이지 제목 */}
        <h1 className='text-lg font-bold text-gray-800'>관리자 페이지</h1>

        {/* 관리자 정보 및 로그아웃 버튼 */}
        <div className='flex items-center space-x-4'>
          <div className='text-gray-800 font-medium'>admin님</div>
          <button onClick={onLogout} className='text-black px-4 py-2 rounded-md'>
            로그아웃
          </button>
        </div>
      </div>
    </nav>
  )
}

export default AdminNav
