import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '@/utils/API'

const SellerRegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    call_number1: '',
    call_number2: '',
    call_number3: '',
  })
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const SELLER_AUTH_TOKEN = localStorage.getItem('access_token')
    if (SELLER_AUTH_TOKEN) {
      navigate('/seller')
    }
  }, [navigate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => ({ ...prevData, [name]: value }))
  }

  const handleRegister = async (e) => {
    e.preventDefault()

    const { password, confirmPassword } = formData

    // 비밀번호 일치 여부 확인
    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.')
      return
    }

    // 전화번호 합치기
    const fullPhoneNumber = `${formData.call_number1}-${formData.call_number2}-${formData.call_number3}`
    console.log(fullPhoneNumber)
    // 폼 데이터 준비
    const payload = {
      email: formData.email,
      password: formData.password,
      name: formData.name,
      callNumber: fullPhoneNumber, // 전화번호 합침
    }

    // API 요청 보내기
    try {
      console.log(payload)

      const response = await API.post('/sellers/sign-up', payload)
      console.log(response)
      // 요청 성공 시, 로그인 페이지로 이동
      if (response.status === 200) {
        navigate('/seller/login')
      } else {
        setError('회원가입 중 오류가 발생했습니다. 다시 시도해주세요.')
      }
    } catch (err) {
      // 오류 발생 시
      console.error('회원가입 오류:', err.response ? err.response.data : err.message)
      setError('회원가입 중 오류가 발생했습니다. 다시 시도해주세요.')
    }
  }

  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-100 px-4'>
      <form
        onSubmit={handleRegister}
        className='p-6 md:p-8 lg:p-12 bg-white rounded-lg shadow-lg w-full max-w-xl md:max-w-2xl lg:max-w-3xl'
      >
        <h2 className='text-2xl font-bold mb-6 text-center'>판매자 회원가입</h2>
        {error && <p className='text-red-500 text-sm mb-4 text-center'>{error}</p>}

        {/* 이름 */}
        <div className='mb-4'>
          <label className='block text-sm font-medium mb-2' htmlFor='name'>
            이름
          </label>
          <input
            type='text'
            id='name'
            name='name'
            value={formData.name}
            onChange={handleChange}
            className='w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500'
            maxLength={255}
            required
          />
        </div>

        {/* 이메일 */}
        <div className='mb-4'>
          <label className='block text-sm font-medium mb-2' htmlFor='email'>
            이메일
          </label>
          <input
            type='email'
            id='email'
            name='email'
            value={formData.email}
            onChange={handleChange}
            className='w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500'
            maxLength={255}
            required
          />
        </div>

        {/* 비밀번호 */}
        <div className='mb-4 grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <label className='block text-sm font-medium mb-2' htmlFor='password'>
              비밀번호
            </label>
            <input
              type='password'
              id='password'
              name='password'
              value={formData.password}
              onChange={handleChange}
              className='w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500'
              maxLength={100}
              required
            />
          </div>
          <div>
            <label className='block text-sm font-medium mb-2' htmlFor='confirmPassword'>
              비밀번호 확인
            </label>
            <input
              type='password'
              id='confirmPassword'
              name='confirmPassword'
              value={formData.confirmPassword}
              onChange={handleChange}
              className='w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500'
              maxLength={100}
              required
            />
          </div>
        </div>

        {/* 연락처 & 인증 버튼 */}
        <div className='mb-4'>
          <label className='block text-sm font-medium' htmlFor='call_number'>
            휴대폰번호
          </label>
          <div className='flex flex-wrap space-x-2 justify-center'>
            <input
              type='text'
              id='call_number1'
              name='call_number1'
              value={formData.call_number1}
              onChange={handleChange}
              maxLength={3}
              className='w-full sm:w-1/4 px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-center'
              placeholder='010'
              required
            />
            <span className='text-lg mt-2 sm:mt-0'>-</span>
            <input
              type='text'
              id='call_number2'
              name='call_number2'
              value={formData.call_number2}
              onChange={handleChange}
              maxLength={4}
              className='w-full sm:w-1/4 px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-center'
              placeholder='1234'
              required
            />
            <span className='text-lg mt-2 sm:mt-0'>-</span>
            <input
              type='text'
              id='call_number3'
              name='call_number3'
              value={formData.call_number3}
              onChange={handleChange}
              maxLength={4}
              className='w-full sm:w-1/4 px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-center'
              placeholder='5678'
              required
            />
          </div>
        </div>

        {/* 회원가입 버튼 */}
        <button
          type='submit'
          className='w-full bg-blue-500 text-white py-3 rounded-lg text-sm md:text-base lg:text-lg hover:bg-blue-700'
        >
          회원가입
        </button>

        {/* 로그인 버튼 */}
        <button
          type='button'
          onClick={() => navigate('/seller/login')}
          className='w-full mt-4 bg-red-500 text-white py-3 rounded-lg text-sm md:text-base lg:text-lg hover:bg-red-700'
        >
          로그인하러가기
        </button>
      </form>
    </div>
  )
}

export default SellerRegisterPage
