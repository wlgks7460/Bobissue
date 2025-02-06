import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom'
import API from '@/utils/API' // 필요한 API 유틸리티를 임포트

const PasswordVerification = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [searchParams] = useSearchParams()
  const redirectPath = '/seller/account/vender/info' // 기본 리다이렉트 경로 설정
  const token = localStorage.getItem('VerificationToken')
  const debug_mode = true
  // 컴포넌트 로드 시 로컬스토리지 확인

  // 비밀번호 인증 처리
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (debug_mode) {
      console.log('debug_mode')
      navigate('/seller/account/vender/info')
    }

    try {
      const response = await API.post('/api/verify-password', {
        password, // ✅ POST 요청 body로 비밀번호 전송
      })

      if (response.status !== 200) {
        throw new Error('비밀번호 인증에 실패했습니다.')
      }

      const { token } = response.data
      localStorage.setItem('VerificationToken', token)
      navigate(redirectPath)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className=' bg-gray-100'>
      <form onSubmit={handleSubmit} className='w-full max-w-md bg-white p-6 rounded-lg'>
        <h2 className='text-2xl font-semibold text-gray-800 mb-4'>비밀번호 확인</h2>
        <div className='mb-4'>
          <input
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder='비밀번호를 입력하세요'
            required
            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none'
          />
        </div>
        {error && <p className='text-red-500 text-sm mb-4'>{error}</p>}
        <button
          type='submit'
          className='w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors'
        >
          인증하기
        </button>
      </form>
    </div>
  )
}

export default PasswordVerification
