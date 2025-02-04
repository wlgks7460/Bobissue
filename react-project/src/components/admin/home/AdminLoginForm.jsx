import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { userReducerActions } from '../../../redux/reducers/userSlice'
import API from '../../../utils/API'

const AdminLoginForm = () => {
  const [email, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      // 🚀 로그인 API 호출
      const response = await API.post('/auths/admin-login', { email, password })
      console.log(response)
      // 서버 응답에서 Access Token과 Refresh Token 가져오기
      const { access_token, refresh_token } = response.data.result.data

      // ✅ Redux 상태 업데이트 (로그인 정보 저장)
      dispatch(userReducerActions.login({ access_token, refresh_token }))

      // ✅ 로그인 성공 후 대시보드로 이동
      navigate('/admin/home')
    } catch (err) {
      setError('아이디 또는 비밀번호가 올바르지 않습니다.')
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className='max-w-md mx-auto mt-60 p-6 bg-white shadow-md rounded-md'
    >
      <h2 className='text-2xl font-semibold text-center mb-6'>관리자 로그인</h2>

      {error && <p className='text-red-500 text-center mb-4'>{error}</p>}

      <div className='mb-4'>
        <input
          type='text'
          placeholder='이메일'
          value={email}
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
          autoComplete='off'
        />
      </div>

      <button
        type='submit'
        className={`w-full py-2 rounded-md transition ${
          email && password
            ? 'bg-blue-500 text-white hover:bg-blue-600'
            : 'bg-gray-300 text-gray-600 cursor-not-allowed'
        }`}
        disabled={!email || !password}
      >
        로그인
      </button>
    </form>
  )
}

export default AdminLoginForm
