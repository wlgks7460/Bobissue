import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import API from '@/utils/API'

const SellerLoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const SELLER_AUTH_TOKEN = localStorage.getItem('SELLER_AUTH_TOKEN')
    const queryParams = new URLSearchParams(location.search)
    const redirectPath = queryParams.get('path') || '/seller'
    if (SELLER_AUTH_TOKEN) {
      navigate(redirectPath, { replace: true })
    }
  }, [navigate, location.search])

  const handleLogin = async (e) => {
    e.preventDefault()

    try {
      const response = await API.post('/auths/seller-login', { email, password })

      // 로그인 성공 시 response 구조 확인
      if (response.status === 200 || response.status === 201) {
        // 서버에서 응답받은 토큰 정보
        const { access_token, refresh_token } = response.data.result.data

        // 로컬 스토리지에 토큰 저장
        localStorage.setItem('SELLER_AUTH_TOKEN', access_token)
        localStorage.setItem('SELLER_REFRESH_TOKEN', refresh_token)

        // 로그인 성공 후 리디렉션
        const queryParams = new URLSearchParams(location.search)
        const redirectPath = queryParams.get('path') || '/seller'
        navigate(redirectPath)
      } else {
        setError('로그인 실패. 다시 시도해 주세요.')
      }
    } catch (err) {
      // 400번대 오류 발생 시 페이지 이동 X, 에러 메시지만 표시
      if (err.response && err.response.status >= 400 && err.response.status < 500) {
        setError('이메일 또는 비밀번호를 확인하세요.')
      } else {
        setError('로그인 중 오류가 발생했습니다. 다시 시도해 주세요.')
      }
    }
  }

  const handleSocialLogin = (provider) => {
    window.location.href = `/auth/seller/social/${provider}` // 소셜 로그인 URL로 리디렉션
  }

  return (
    <div className='flex justify-center items-center h-screen bg-gray-50'>
      <div className='w-full max-w-lg bg-white p-8 rounded shadow-md'>
        <h2 className='text-2xl font-bold text-center mb-6'>판매자 로그인</h2>
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
          <button
            type='submit'
            className='w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700'
          >
            로그인
          </button>
        </form>

        <div className='mt-6'>
          <p className='text-center text-sm text-gray-600 mb-2'>소셜 계정으로 로그인</p>
          <div className='flex justify-center space-x-4'>
            <button
              onClick={() => handleSocialLogin('naver')}
              className='bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600'
            >
              Naver
            </button>
            <button
              onClick={() => handleSocialLogin('kakao')}
              className='bg-yellow-400 text-black py-2 px-4 rounded hover:bg-yellow-500'
            >
              Kakao
            </button>
          </div>
        </div>

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
