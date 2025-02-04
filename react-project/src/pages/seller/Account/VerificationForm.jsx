import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const VerificationForm = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  // URL에서 redirect 값을 가져오거나 기본값 설정
  const redirectPath = new URLSearchParams(location.search).get('redirect') || 'info'

  const handleSubmit = async (e) => {
    e.preventDefault()

    // 디버깅용 응답 시뮬레이션
    const response = { ok: true, json: () => Promise.resolve({ token: 'debug_verificationtoken' }) }

    if (response.ok) {
      const data = await response.json()
      localStorage.setItem('VerificationToken', data.token)
      navigate(redirectPath) // 리다이렉트 실행
    } else {
      setMessage('비밀번호가 올바르지 않습니다.')
    }
  }

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100'>
      <form onSubmit={handleSubmit} className='w-full max-w-md bg-white p-6 rounded-lg shadow-md'>
        <h2 className='text-2xl font-semibold text-gray-800 mb-4 text-center'>
          비밀번호를 입력하세요
        </h2>
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
        {message && <p className='text-sm text-center text-red-500 mb-4'>{message}</p>}
        <button
          type='submit'
          className='w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors'
        >
          확인
        </button>
      </form>
    </div>
  )
}

export default VerificationForm
