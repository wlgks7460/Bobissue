import React, { useState } from 'react'

const Withdrawal = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    reason: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // 가상 백엔드 응답 (디버깅용)
    const response = {
      ok: true,
      json: () => Promise.resolve({ message: '회원 탈퇴가 완료되었습니다.' }),
    }

    if (response.ok) {
      const data = await response.json()
      alert(data.message)
      setFormData({ email: '', password: '', reason: '' })
    } else {
      alert('회원 탈퇴에 실패했습니다. 다시 시도해주세요.')
    }
  }

  return (
    <div className='p-6 bg-white rounded-lg w-[600px] border border-gray-300'>
      <h1 className='text-[28px] font-bold mb-6'>회원 탈퇴</h1>
      <form onSubmit={handleSubmit} className='space-y-4 bg-white p-6 border rounded-lg'>
        {/* 이메일 */}
        <div className='flex items-center gap-4'>
          <label htmlFor='email' className='w-1/4 text-sm font-medium text-gray-700'>
            이메일:
          </label>
          <input
            type='email'
            id='email'
            name='email'
            value={formData.email}
            onChange={handleChange}
            required
            className='w-3/4 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500'
          />
        </div>

        {/* 비밀번호 */}
        <div className='flex items-center gap-4'>
          <label htmlFor='password' className='w-1/4 text-sm font-medium text-gray-700'>
            비밀번호:
          </label>
          <input
            type='password'
            id='password'
            name='password'
            value={formData.password}
            onChange={handleChange}
            required
            className='w-3/4 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500'
          />
        </div>

        {/* 탈퇴 사유 */}
        <div className='flex items-center gap-4'>
          <label htmlFor='reason' className='w-1/4 text-sm font-medium text-gray-700'>
            탈퇴 사유:
          </label>
          <textarea
            id='reason'
            name='reason'
            value={formData.reason}
            onChange={handleChange}
            rows='3'
            className='w-3/4 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 resize-none'
          />
        </div>

        {/* 제출 버튼 */}
        <button
          type='submit'
          className='w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400'
        >
          회원 탈퇴하기
        </button>
      </form>
    </div>
  )
}

export default Withdrawal
