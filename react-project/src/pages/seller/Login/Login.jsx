import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import API from '@/utils/API'
import { userReducerActions } from '../../../redux/reducers/userSlice'
import { setItemWithExpiry } from '../Form/LocalStorage'

const SellerLoginPage = () => {
  const SELLER_AUTH_TOKEN = localStorage.getItem('access_token')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false) // 🔹 로딩 상태 추가
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const isAuth = false
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search)
    const redirectPath = queryParams.get('path') || '/seller'

    if (SELLER_AUTH_TOKEN) {
      navigate(redirectPath, { replace: true })
    }
  }, [navigate, location.search])

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('') // 🔹 이전 에러 초기화
    setLoading(true) // 🔹 로딩 시작
    {
      try {
        const payload = { email, password }
        console.log(payload)
        const response = await API.post('/auths/seller-login', payload)
        console.log(response)

        if (response.status === 200 && response.data.status === 'OK') {
          const sellerData = { ...response.data.result.data, status: 'seller' }

          // 🔹 Redux 상태 업데이트 및 로컬스토리지에 토큰 저장
          dispatch(userReducerActions.login(sellerData))

          // 🔹 로그인 후 판매자 페이지로 이동
          navigate('/seller')
        } else {
          throw new Error('로그인에 실패했습니다.')
        }
      } catch (err) {
        setError(err.response?.data?.message || '이메일 또는 비밀번호가 올바르지 않습니다.') // 🔹 API 에러 메시지 표시
      } finally {
        setLoading(false) // 🔹 로딩 종료
      }
    }
  }

  return (
    <div className='flex justify-center items-center h-screen bg-gray-50'>
      <div className='w-full max-w-lg bg-white p-8 rounded shadow-md'>
        <h2 className='text-2xl font-bold text-center mb-6'>판매자 로그인</h2>

        {/* 🔹 에러 메시지 표시 */}
        {error && <p className='text-red-500 text-sm mb-4 text-center'>{error}</p>}

        <form onSubmit={handleLogin}>
          <div className='mb-4'>
            <label className='block text-sm font-medium mb-2' htmlFor='email'>
              이메일
            </label>
            <input
              type='email'
              id='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='w-full px-4 py-2 border border-gray-300 rounded'
              placeholder='example@example.com'
              required
            />
          </div>
          <div className='mb-6'>
            <label className='block text-sm font-medium mb-2' htmlFor='password'>
              비밀번호
            </label>
            <input
              type='password'
              id='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='w-full px-4 py-2 border border-gray-300 rounded'
              placeholder='비밀번호를 입력하세요'
              required
            />
          </div>

          {/* 🔹 로그인 버튼 (로딩 중이면 비활성화) */}
          <button
            type='submit'
            disabled={loading}
            className={`w-full py-2 px-4 rounded text-white ${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>

        <div className='mt-6 text-center'>
          <p className='text-sm text-gray-600'>
            <a href='/password/reset' className='text-blue-500 hover:underline'>
              비밀번호를 잊으셨나요?
            </a>
          </p>
        </div>

        <div className='mt-4 text-center'>
          <p className='text-sm text-gray-600'>
            회원이 아니세요?{' '}
            <a href='/seller/signup' className='text-blue-500 font-medium hover:underline'>
              회원가입
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default SellerLoginPage
