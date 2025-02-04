import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Update_Password = () => {
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [backendPassword] = useState('secure1234') // 가상의 현재 비밀번호
  const [message, setMessage] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (newPassword === backendPassword) {
      setMessage('새 비밀번호는 현재 비밀번호와 다르게 설정해야 합니다.')
      return
    }

    if (newPassword !== confirmPassword) {
      setMessage('새 비밀번호와 확인 비밀번호가 일치하지 않습니다.')
      return
    }

    // 비밀번호 업데이트 요청 (디버깅용 가상 응답)
    const response = {
      ok: true,
      json: () => Promise.resolve({ message: '비밀번호가 성공적으로 업데이트되었습니다.' }),
    }

    if (response.ok) {
      const data = await response.json()
      alert(data.message)
      setMessage('')
      setNewPassword('')
      setConfirmPassword('')
      navigate('/seller/account/info') // 성공 시 페이지 이동
    } else {
      alert('비밀번호 업데이트에 실패했습니다.')
    }
  }

  return (
    <div className='p-6 bg-white rounded-lg w-[600px] border border-gray-300'>
      <h1 className='text-[28px] font-bold mb-6'>비밀번호 수정</h1>
      <form onSubmit={handleSubmit} className='space-y-4 bg-white p-6 border rounded-lg'>
        {/* 새 비밀번호 */}
        <div className='flex items-center gap-4'>
          <label htmlFor='newPassword' className='w-1/4 text-sm font-medium text-gray-700'>
            새 비밀번호:
          </label>
          <input
            type='password'
            id='newPassword'
            name='newPassword'
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className='w-3/4 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500'
          />
        </div>

        {/* 비밀번호 확인 */}
        <div className='flex items-center gap-4'>
          <label htmlFor='confirmPassword' className='w-1/4 text-sm font-medium text-gray-700'>
            비밀번호 확인:
          </label>
          <input
            type='password'
            id='confirmPassword'
            name='confirmPassword'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className='w-3/4 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500'
          />
        </div>

        {/* 에러 메시지 */}
        {message && <p className='text-red-500 text-center'>{message}</p>}

        {/* 제출 버튼 */}
        <div className='flex justify-center'>
          <button
            type='submit'
            className='flex items-center bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400'
          >
            수정하기
          </button>
        </div>
      </form>
    </div>
  )
}

export default Update_Password
