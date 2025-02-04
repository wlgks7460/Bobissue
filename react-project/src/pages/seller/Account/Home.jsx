import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, useLocation, Outlet } from 'react-router-dom'

const Account = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const redirectPath = location.pathname // 기본값 설정
  const token = localStorage.getItem('VerificationToken')
  // console.log(location)
  // 컴포넌트 로드 시 로컬스토리지 확인
  useEffect(() => {
    if (token) {
      // 토큰이 있으면 리다이렉트 경로로 이동
      navigate(redirectPath)
    } else {
      navigate(`/seller/account/verification/?redirect=${redirectPath}`)
    }
  }, [navigate, token, redirectPath])

  return <Outlet />
}

export default Account
