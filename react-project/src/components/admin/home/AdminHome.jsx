import React from 'react'
import AdminSideBar from '../home/AdminSideBar'
import AdminNav from '../home/AdminNav'
import AdminDashBoard from '../home/AdminDashboard'

const AdminHome = () => {
  return (
    <div className='flex h-screen'>
      {/* 사이드바 */}
      <div className='fixed top-0 left-0 h-full w-64'>
        <AdminSideBar />
      </div>

      {/* 메인 레이아웃 */}
      <div className='flex-1 ml-64'>
        {/* 네비게이션 바 */}
        <div className='fixed top-0 left-64 w-[calc(100%-16rem)] z-50'>
          <AdminNav />
        </div>

        {/* 콘텐츠 영역 */}
        <main className='pt-16 bg-white h-full p-6 overflow-y-auto'>
          <AdminDashBoard />
        </main>
      </div>
    </div>
  )
}

export default AdminHome
