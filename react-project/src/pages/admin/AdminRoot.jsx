import React from 'react'
import { Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import AdminSideBar from '../../components/admin/home/AdminSideBar' // 사이드바
import NavBar from '../../components/admin/home/AdminNav' // 네비바
import AdminLoginPage from '../../pages/admin/login/AdminLoginPage' // 로그인 페이지

const AdminRootPage = () => {
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated)

  // 로그인하지 않은 경우, 로그인 페이지만 렌더링
  if (!isAuthenticated) {
    return <AdminLoginPage />
  }

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
