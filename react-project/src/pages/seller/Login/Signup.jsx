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
  const [loading, setLoading] = useState(false)
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
    setError('')
    setLoading(true)
    const { password, confirmPassword } = formData
    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.')
      setLoading(false)
      return
    }

    const fullPhoneNumber = `${formData.call_number1}-${formData.call_number2}-${formData.call_number3}`
    const payload = {
      email: formData.email,
      password: formData.password,
      name: formData.name,
      callNumber: fullPhoneNumber,
    }
    console.log(payload)
    try {
      const response = await API.post('/sellers/sign-up', payload)
      if (response.status === 200) {
        navigate('/seller/login')
      } else {
        setError('회원가입 중 오류가 발생했습니다. 다시 시도해주세요.')
      }
    } catch (err) {
      setError('회원가입 중 오류가 발생했습니다. 다시 시도해주세요.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex justify-center items-center h-screen bg-gray-100'>
      <div className='w-full max-w-lg bg-white p-10 rounded-xl shadow-lg hover:shadow-xl'>
        <h2 className='text-3xl font-bold text-center text-gray-900 mb-6'>판매자 회원가입</h2>
        {error && <p className='text-red-500 text-sm mb-4 text-center'>{error}</p>}
        <form onSubmit={handleRegister}>
          <div className='space-y-4'>
            <div>
              <label className='block text-sm font-medium mb-2 text-gray-700'>이름</label>
              <input
                type='text'
                name='name'
                value={formData.name}
                onChange={handleChange}
                className='w-full px-4 py-2 border border-gray-400 rounded-md focus:ring-2 focus:ring-gray-700'
                required
              />
            </div>
            <div>
              <label className='block text-sm font-medium mb-2 text-gray-700'>이메일</label>
              <input
                type='email'
                name='email'
                value={formData.email}
                onChange={handleChange}
                className='w-full px-4 py-2 border border-gray-400 rounded-md focus:ring-2 focus:ring-gray-700'
                required
              />
            </div>
            <div className='grid grid-cols-3 gap-2'>
              <div>
                <label className='block text-sm font-medium mb-2 text-gray-700'>휴대폰 번호</label>
                <input
                  type='text'
                  name='call_number1'
                  value={formData.call_number1}
                  onChange={handleChange}
                  maxLength={3}
                  className='w-full px-4 py-2 border border-gray-400 rounded-md text-center'
                  placeholder='010'
                  required
                />
              </div>
              <div className='flex items-end'>
                <input
                  type='text'
                  name='call_number2'
                  value={formData.call_number2}
                  onChange={handleChange}
                  maxLength={4}
                  className='w-full px-4 py-2 border border-gray-400 rounded-md text-center'
                  required
                />
              </div>
              <div className='flex items-end'>
                <input
                  type='text'
                  name='call_number3'
                  value={formData.call_number3}
                  onChange={handleChange}
                  maxLength={4}
                  className='w-full px-4 py-2 border border-gray-400 rounded-md text-center'
                  required
                />
              </div>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium mb-2 text-gray-700'>비밀번호</label>
                <input
                  type='password'
                  name='password'
                  value={formData.password}
                  onChange={handleChange}
                  className='w-full px-4 py-2 border border-gray-400 rounded-md focus:ring-2 focus:ring-gray-700'
                  required
                />
              </div>
              <div>
                <label className='block text-sm font-medium mb-2 text-gray-700'>
                  비밀번호 확인
                </label>
                <input
                  type='password'
                  name='confirmPassword'
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className='w-full px-4 py-2 border border-gray-400 rounded-md focus:ring-2 focus:ring-gray-700'
                  required
                />
              </div>
            </div>
          </div>
          <button
            type='submit'
            disabled={loading}
            className={`mt-3 w-full py-2 px-4 rounded-md text-white transition-all font-semibold ${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-700 hover:bg-gray-900'
            }`}
          >
            {loading ? '가입 중...' : '회원가입'}
          </button>
        </form>
        <button
          className='mt-4 w-full py-2 px-4 bg-gray-500 text-white rounded-md hover:bg-gray-600'
          onClick={() => navigate('/seller/login')}
        >
          로그인하러 가기
        </button>
      </div>
    </div>
  )
}

export default SellerRegisterPage
