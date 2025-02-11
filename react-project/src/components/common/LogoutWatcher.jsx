import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const LogoutWatcher = () => {
  const navigate = useNavigate()
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated)
  const status = useSelector((state) => state.user.status)

  const lastStatus = useRef(status)
  const prevAuth = useRef(isAuthenticated)

  useEffect(() => {
    if (prevAuth.current && !isAuthenticated) {
      alert('인증이 만료되었습니다. 다시 로그인해주세요.')
      if (lastStatus.current === 'seller') {
        navigate('/seller')
      } else if (lastStatus.current === 'admin') {
        navigate('/admin')
      } else {
        navigate('/login')
      }
    }
    prevAuth.current = isAuthenticated
  }, [isAuthenticated, navigate])

  useEffect(() => {
    if (status) {
      lastStatus.current = status
    }
  }, [status])
  return null
}

export default LogoutWatcher
