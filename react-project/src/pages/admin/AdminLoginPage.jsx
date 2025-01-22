import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminLoginForm from '../../components/admin/AdminLoginForm'

const AdminLoginPage = () => {
  const navigate = useNavigate()
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const handleLogin = (username) => {
    setIsLoggedIn(true)
    localStorage.setItem('adminUser', username)
    navigate('/admin/home') // 로그인 후 home으로 이동
  }

  return <AdminLoginForm onLogin={handleLogin} />
}
export default AdminLoginPage
