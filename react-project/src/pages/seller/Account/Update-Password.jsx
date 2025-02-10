import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react' // 비밀번호 가시성 아이콘 추가

const UpdatePassword = () => {
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [backendPassword] = useState('secure1234') // 가상의 현재 비밀번호
  const [message, setMessage] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (newPassword === backendPassword) {
      setMessage('❌ 새 비밀번호는 현재 비밀번호와 다르게 설정해야 합니다.')
      return
    }

    if (newPassword !== confirmPassword) {
      setMessage('❌ 새 비밀번호와 확인 비밀번호가 일치하지 않습니다.')
      return
    }

    try {
      // 비밀번호 업데이트 요청 (디버깅용 가상 응답)
      const response = {
        ok: true,
        json: () => Promise.resolve({ message: '✅ 비밀번호가 성공적으로 업데이트되었습니다.' }),
      }

      if (response.ok) {
        const data = await response.json()
        alert(data.message)
        setMessage('')
        setNewPassword('')
        setConfirmPassword('')
        navigate('/seller/account/vender/info') // 성공 시 페이지 이동
      } else {
        alert('❌ 비밀번호 업데이트에 실패했습니다.')
      }
    } catch (error) {
      console.error('비밀번호 업데이트 오류:', error)
      alert('❌ 서버 오류가 발생했습니다.')
    }
  }

  return (
    <div className='h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 p-6'>
      <div className='w-full max-w-md bg-white p-8 rounded-xl shadow-lg'>
        <h1 className='text-2xl font-bold text-center mb-6'>🔑 비밀번호 변경</h1>

        <form onSubmit={handleSubmit} className='space-y-5'>
          {/* 새 비밀번호 입력 */}
          <div className='relative'>
            <label htmlFor='newPassword' className='block text-sm font-medium text-gray-700'>
              새 비밀번호
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              id='newPassword'
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className='w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 transition-all'
            />
            <button
              type='button'
              className='absolute right-3 top-10 text-gray-500 hover:text-gray-700'
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* 비밀번호 확인 입력 */}
          <div className='relative'>
            <label htmlFor='confirmPassword' className='block text-sm font-medium text-gray-700'>
              비밀번호 확인
            </label>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              id='confirmPassword'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className='w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 transition-all'
            />
            <button
              type='button'
              className='absolute right-3 top-10 text-gray-500 hover:text-gray-700'
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* 에러 메시지 */}
          {message && <p className='text-center text-red-500 animate-fade-in'>{message}</p>}

          {/* 제출 버튼 */}
          <div className='flex justify-center'>
            <button
              type='submit'
              className='w-full py-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 hover:scale-105 transition-all'
            >
              비밀번호 변경
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UpdatePassword
