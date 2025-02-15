import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { userReducerActions } from '../../../redux/reducers/userSlice'
import API from '../../../utils/API'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'

const AdminLoginForm = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const isOauth = false

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      const response = await API.post('/auths/admin-login', { email, password, isOauth })
      console.log(response)

      const { access_token, refresh_token } = response.data.result.data
      dispatch(userReducerActions.login({ ...response.data.result.data, status: 'admin' }))

      navigate('/admin/home') // 로그인 성공 시 대시보드로 이동
    } catch (err) {
      setError('아이디 또는 비밀번호가 올바르지 않습니다.')
    }
  }

  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#FFF5E1] to-[#F0E6D2]'>
      {/* 로고 이미지 */}
      <img src='/bobissueLogo.png' alt='로고' className='h-20 mb-6' />

      {/* 헤더 텍스트 */}
      <h1 className='text-3xl font-bold text-[#5C4033] mb-6'>관리자 로그인</h1>

      {/* 오류 메시지 */}
      {error && (
        <div className='mb-4 text-center bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded'>
          {error}
        </div>
      )}

      {/* 로그인 폼 */}
      <form onSubmit={handleSubmit} className='w-full max-w-sm space-y-4 p-6 '>
        {/* 이메일 입력 */}
        <div className='relative'>
          <input
            type='text'
            placeholder='아이디'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='w-full px-4 py-3 border border-[#D2B48C] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5C4033] placeholder-gray-300'
            required
          />
        </div>

        {/* 비밀번호 입력 */}
        <div className='relative'>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder='비밀번호'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='w-full px-4 py-3 border border-[#D2B48C] rounded-md focus:outline-none focus:ring-2 focus:ring-[#5C4033] placeholder-gray-300'
            required
          />
          <FontAwesomeIcon
            icon={showPassword ? faEyeSlash : faEye}
            className='absolute right-4 top-3 text-gray-500 cursor-pointer'
            onClick={() => setShowPassword(!showPassword)}
          />
        </div>

        {/* 로그인 버튼 */}
        <button
          type='submit'
          className='w-full py-3 bg-[#5C4033] text-white font-semibold rounded-md hover:bg-[#4A3227] transition'
        >
          로그인
        </button>
      </form>

      {/* 푸터 */}
      <p className='mt-4 text-sm text-gray-600'>© 2025 BobIssue. All rights reserved.</p>
    </div>
  )
}

export default AdminLoginForm
