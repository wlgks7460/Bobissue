import React from 'react'
import { Outlet } from 'react-router-dom'
import AdminSideBar from '../../components/admin/home/AdminSideBar' // 사이드바
import NavBar from '../../components/admin/home/AdminNav' // 네비바

const AdminRootPage = () => {
  return (
    <div className='flex h-screen'>
      {/* 사이드바 */}
      <AdminSideBar />

      {/* 메인 컨텐츠 */}
      <div className='flex-1 flex flex-col'>
        {/* 네비바 */}
        <NavBar />

        {/* 대시보드 또는 자식 라우트 */}
        <div className='flex-1 p-4 bg-white'>
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default AdminRootPage
