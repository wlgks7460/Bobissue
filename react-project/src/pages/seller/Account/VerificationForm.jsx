import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const VerificationForm = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  // URL에서 redirect 값을 가져오거나 기본값 설정
  const Path = '/seller/account/vender/info'

  const handleSubmit = async (e) => {
    e.preventDefault()

    // 디버깅용 응답 시뮬레이션
    const response = { ok: true, json: () => Promise.resolve({ token: 'debug_verificationtoken' }) }

    if (response.ok) {
      const data = await response.json()
      localStorage.setItem('VerificationToken', data.token)
      navigate(Path) // 리다이렉트 실행
    } else {
      setMessage('비밀번호가 올바르지 않습니다.')
    }
  }

  return (
    <div className='p-4'>
      <h1 className='text-2xl font-semibold text-gray-700 mb-6'>비밀번호 확인</h1>
      <form onSubmit={handleSubmit}>
        <div className='mb-6'>
          <input
            type='password'
            id='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none'
            placeholder='비밀번호를 입력하세요'
            required
            style={{ width: '400px' }}
          />
        </div>
        {message && <p className='text-red-500 text-center mt-2'>{message}</p>}
        <button
          type='submit'
          className='mt-4 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600'
        >
          확인
        </button>
      </form>
    </div>
  )
}

export default VerificationForm
