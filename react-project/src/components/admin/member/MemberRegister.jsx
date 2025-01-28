import React, { useState } from 'react'
import Breadcrumb from '../common/Breadcrumb'
import API from '../../../utils/API'

const MemberRegister = () => {
  const breadcrumbPaths = [{ name: 'Home' }, { name: '회원관리' }, { name: '회원등록' }]

  const [formData, setFormData] = useState({
    name: '',
    birthday: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: 'F', // 기본값
    height: '',
    weight: '',
    phoneNumber: '',
  })

  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
    setErrors({
      ...errors,
      [name]: '', // 입력 시 기존 에러 메시지 초기화
    })
  }

  const validate = () => {
    const newErrors = {}
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const phoneRegex = /^\d{3}-\d{3,4}-\d{4}$/

    if (!formData.name) newErrors.name = '이름을 입력해주세요.'
    if (!formData.birthday) newErrors.birthday = '생년월일을 입력해주세요.'
    if (!emailRegex.test(formData.email)) newErrors.email = '올바른 이메일 형식을 입력해주세요.'
    if (!formData.password) newErrors.password = '비밀번호를 입력해주세요.'
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.'
    if (!formData.height || formData.height <= 0) newErrors.height = '키는 양수여야 합니다.'
    if (!formData.weight || formData.weight <= 0) newErrors.weight = '몸무게는 양수여야 합니다.'
    if (!phoneRegex.test(formData.phoneNumber))
      newErrors.phoneNumber = '전화번호 형식이 올바르지 않습니다. (예: 010-1234-5678)'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validate()) {
      return
    }

    try {
      const response = await API.post('/users/sign-up', {
        name: formData.name,
        birthday: formData.birthday.replace(/-/g, ''), // YYYYMMDD 형식
        email: formData.email,
        password: formData.password,
        gender: formData.gender,
        height: parseFloat(formData.height),
        weight: parseFloat(formData.weight),
        phoneNumber: formData.phoneNumber,
      })

      if (response.status === 201) {
        alert('회원 등록이 완료되었습니다!')
        setFormData({
          name: '',
          birthday: '',
          email: '',
          password: '',
          confirmPassword: '',
          gender: 'F',
          height: '',
          weight: '',
          phoneNumber: '',
        })
      } else {
        alert(`회원 등록 실패: ${response.statusText}`)
      }
    } catch (error) {
      console.error('회원 등록 오류:', error.response || error.message)
      alert('회원 등록에 실패했습니다. 다시 시도해주세요.')
    }
  }

  return (
    <div className='p-6'>
      <Breadcrumb paths={breadcrumbPaths} />
      <h1 className='text-2xl font-bold mb-6'>회원 등록하기</h1>

      <form onSubmit={handleSubmit}>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
          <div>
            <label className='block text-sm font-medium mb-1'>이름</label>
            <input
              type='text'
              name='name'
              value={formData.name}
              onChange={handleChange}
              placeholder='이름 입력'
              className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500'
              required
            />
            {errors.name && <div className='text-red-500 text-sm mt-1'>{errors.name}</div>}
          </div>
          <div>
            <label className='block text-sm font-medium mb-1'>생년월일</label>
            <input
              type='date'
              name='birthday'
              value={formData.birthday}
              onChange={handleChange}
              className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500'
              required
            />
            {errors.birthday && <div className='text-red-500 text-sm mt-1'>{errors.birthday}</div>}
          </div>
          <div>
            <label className='block text-sm font-medium mb-1'>이메일</label>
            <input
              type='email'
              name='email'
              value={formData.email}
              onChange={handleChange}
              placeholder='이메일 입력'
              className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500'
              required
            />
            {errors.email && <div className='text-red-500 text-sm mt-1'>{errors.email}</div>}
          </div>
          <div>
            <label className='block text-sm font-medium mb-1'>비밀번호</label>
            <input
              type='password'
              name='password'
              value={formData.password}
              onChange={handleChange}
              placeholder='비밀번호 입력'
              className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500'
              required
            />
            {errors.password && <div className='text-red-500 text-sm mt-1'>{errors.password}</div>}
          </div>
          <div>
            <label className='block text-sm font-medium mb-1'>비밀번호 확인</label>
            <input
              type='password'
              name='confirmPassword'
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder='비밀번호 확인'
              className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500'
              required
            />
            {errors.confirmPassword && (
              <div className='text-red-500 text-sm mt-1'>{errors.confirmPassword}</div>
            )}
          </div>
          <div>
            <label className='block text-sm font-medium mb-1'>성별</label>
            <select
              name='gender'
              value={formData.gender}
              onChange={handleChange}
              className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500'
            >
              <option value='F'>여성</option>
              <option value='M'>남성</option>
            </select>
          </div>
          <div>
            <label className='block text-sm font-medium mb-1'>키 (cm)</label>
            <input
              type='number'
              name='height'
              value={formData.height}
              onChange={handleChange}
              placeholder='키 입력'
              className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500'
              step='0.1'
              required
            />
            {errors.height && <div className='text-red-500 text-sm mt-1'>{errors.height}</div>}
          </div>
          <div>
            <label className='block text-sm font-medium mb-1'>몸무게 (kg)</label>
            <input
              type='number'
              name='weight'
              value={formData.weight}
              onChange={handleChange}
              placeholder='몸무게 입력'
              className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500'
              step='0.1'
              required
            />
            {errors.weight && <div className='text-red-500 text-sm mt-1'>{errors.weight}</div>}
          </div>
          <div>
            <label className='block text-sm font-medium mb-1'>휴대폰 번호</label>
            <input
              type='tel'
              name='phoneNumber'
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder='010-0000-0000'
              className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500'
              required
            />
            {errors.phoneNumber && (
              <div className='text-red-500 text-sm mt-1'>{errors.phoneNumber}</div>
            )}
          </div>
        </div>

        <div className='text-center'>
          <button
            type='submit'
            className='bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600'
          >
            회원 등록
          </button>
        </div>
      </form>
    </div>
  )
}

export default MemberRegister
