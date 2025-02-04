import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '@/utils/API'

const SellerRegisterPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    businessName: '',
    representativeName: '',
    businessRegistrationNumber: '',
    contactNumber: '',
  })
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const SELLER_AUTH_TOKEN = localStorage.getItem('SELLER_AUTH_TOKEN')
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
    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.')
      return
    }
    try {
      await API.post('/auth/seller/register', formData)
      navigate('/seller/login')
    } catch (err) {
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
              required
            />
          </div>
        </div>

        {/* 사업체명 & 대표자명 */}
        <div className='mb-4 grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <label className='block text-sm font-medium mb-2' htmlFor='businessName'>
              사업체명
            </label>
            <input
              type='text'
              id='businessName'
              name='businessName'
              value={formData.businessName}
              onChange={handleChange}
              className='w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500'
              required
            />
          </div>
          <div>
            <label className='block text-sm font-medium mb-2' htmlFor='representativeName'>
              대표자명
            </label>
            <input
              type='text'
              id='representativeName'
              name='representativeName'
              value={formData.representativeName}
              onChange={handleChange}
              className='w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500'
              required
            />
          </div>
        </div>

        {/* 사업자 등록번호 */}
        <div className='mb-4'>
          <label className='block text-sm font-medium mb-2' htmlFor='businessRegistrationNumber'>
            사업자 등록번호
          </label>
          <input
            type='text'
            id='businessRegistrationNumber'
            name='businessRegistrationNumber'
            value={formData.businessRegistrationNumber}
            onChange={handleChange}
            className='w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500'
            required
          />
        </div>

        {/* 연락처 & 인증 버튼 */}
        <div className='mb-4 flex flex-col md:flex-row md:items-center space-y-3 md:space-y-0 md:space-x-4'>
          <input
            type='text'
            id='contactNumber'
            name='contactNumber'
            value={formData.contactNumber}
            onChange={handleChange}
            className='flex-grow px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500'
            placeholder='전화번호 입력'
            required
          />
          <button
            type='button'
            className='bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 md:w-40'
          >
            인증하기
          </button>
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
