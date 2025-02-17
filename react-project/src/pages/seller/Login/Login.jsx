import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import API from '@/utils/API'
import { userReducerActions } from '../../../redux/reducers/userSlice'

const SellerLoginPage = () => {
  const debug_mode = false
  const SELLER_AUTH_TOKEN = localStorage.getItem('access_token')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search)
    const redirectPath = queryParams.get('path') || '/seller'
    if (SELLER_AUTH_TOKEN) {
      navigate(redirectPath, { replace: true })
    }
  }, [navigate, location.search])

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    if (debug_mode) {
      localStorage.setItem('access_token', 'access')
      navigate('/seller')
    }
    try {
      const payload = { email, password }
      console.log(payload)
      const response = await API.post('/auths/seller-login', payload)
      if (response.status === 200 && response.data.status === 'OK') {
        const sellerData = { ...response.data.result.data, status: 'seller' }
        dispatch(userReducerActions.login(sellerData))
        navigate('/seller')
      } else {
        throw new Error('로그인에 실패했습니다.')
      }
    } catch (err) {
      setError(err.response?.data?.message || '이메일 또는 비밀번호가 올바르지 않습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex justify-center items-center h-screen bg-gray-100'>
      <div className='w-full max-w-lg bg-white p-10 rounded-xl shadow-lg hover:shadow-xl'>
        <h2 className='text-3xl font-bold text-center text-gray-900 mb-6'>판매자 로그인</h2>
        {error && <p className='text-red-500 text-sm mb-4 text-center'>{error}</p>}
        <form onSubmit={handleLogin}>
          <div className='mb-4'>
            <label className='block text-sm font-medium text-gray-700 mb-2' htmlFor='email'>
              이메일
            </label>
            <input
              type='email'
              id='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='w-full px-4 py-2 border border-gray-400 rounded-md focus:ring-2 focus:ring-gray-700'
              placeholder='example@example.com'
              required
            />
          </div>
          <div className='mb-6'>
            <label className='block text-sm font-medium text-gray-700 mb-2' htmlFor='password'>
              비밀번호
            </label>
            <input
              type='password'
              id='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='w-full px-4 py-2 border border-gray-400 rounded-md focus:ring-2 focus:ring-gray-700'
              placeholder='비밀번호를 입력하세요'
              required
            />
          </div>
          <button
            type='submit'
            disabled={loading}
            className={`w-full py-2 px-4 rounded-md text-white transition-all font-semibold ${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-500 hover:bg-gray-900'
            }`}
          >
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>
        <div className='mt-6 text-center'>
          <p className='text-sm text-gray-600'>
            <a href='/password/reset' className='text-rose-500 hover:underline'>
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
