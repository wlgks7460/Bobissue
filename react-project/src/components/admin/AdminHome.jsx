import React from 'react'
import AdminSideBar from '../admin/AdminSideBar'
import AdminNav from './AdminNav'

const AdminHome = () => {
  return (
    <div className='flex h-screen'>
      {/* 사이드바 */}
      <AdminSideBar />

      {/* 메인 레이아웃 */}
      <div className='flex-1 flex flex-col'>
        {/* 네비게이션 바 */}
        <AdminNav />

        {/* 콘텐츠 영역 */}
        <main className='flex-1 bg-gray-50 p-6'>
          <h1>Admin Home Page</h1>
          <p>여기에 콘텐츠를 추가하세요.</p>
        </main>
      </div>
    </div>
  )
}

export default AdminHome
