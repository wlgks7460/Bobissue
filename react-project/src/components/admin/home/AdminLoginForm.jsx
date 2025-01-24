import React, { useState } from 'react'

const AdminLoginForm = ({ onLogin }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handlesubmit = (e) => {
    e.preventDefault()
    if (username === 'admin' && password === 'admin123') {
      onLogin(username) // 로그인 성공시  username을 전달
    } else {
      alert('아이디 또는 비밀번호가 올바르지 않습니다.')
    }
  }

  return (
    <form
      onSubmit={handlesubmit}
      className='max-w-md mx-auto mt-60 p-6 bg-white shadow-md rounded-md'
    >
      <h2 className='text-2xl font-semibold text-center mb-6'>관리자 로그인</h2>
      <div className='mb-4'>
        <input
          type='text'
          placeholder='아이디'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500'
          required
        />
      </div>
      <div className='mb-6'>
        <input
          type='password'
          placeholder='비밀번호'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500'
          required
        />
      </div>
      <button
        type='submit'
        className='w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition'
      >
        로그인
      </button>
    </form>
  )
}

export default AdminLoginForm
