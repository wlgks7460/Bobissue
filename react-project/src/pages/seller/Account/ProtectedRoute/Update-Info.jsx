import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const UpdateInfo = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    email: '',
    phone: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  // 더미 데이터 불러오기
  useEffect(() => {
    setIsLoading(true)
    try {
      const dummyData = {
        id: '1234',
        name: '홍길동',
        email: 'hong@example.com',
        phone: '010-1234-5678',
      }
      setFormData(dummyData)
    } catch (err) {
      setError('데이터를 불러오는 중 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  // 입력값 변경 처리
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  // 개인정보 수정 제출
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.name || !formData.email || !formData.phone) {
      alert('모든 정보를 입력해주세요.')
      return
    }

    console.log(`개인정보 수정 중...`)
    console.log(`이름: ${formData.name}, 이메일: ${formData.email}, 전화번호: ${formData.phone}`)

    try {
      // 가상의 응답 시뮬레이션
      const response = {
        ok: true,
        json: () => Promise.resolve({ message: '개인정보가 성공적으로 업데이트되었습니다.' }),
      }
      if (response.ok) {
        const data = await response.json()
        alert(data.message)
        navigate('/seller/account/info')
      } else {
        throw new Error('업데이트 실패')
      }
    } catch (error) {
      alert('개인정보 업데이트에 실패했습니다.')
    }
  }

  return (
    <div className=' p-6 bg-white rounded-lg w-[600px] border border-gray-300'>
      <h1 className='text-[28px] font-bold mb-6'>개인정보 수정</h1>
      {isLoading ? (
        <p>로딩 중...</p>
      ) : error ? (
        <p className='text-red-500'>{error}</p>
      ) : (
        <form onSubmit={handleSubmit} className='space-y-4 bg-white p-6 border rounded-lg'>
          {/* 아이디 */}
          <div className='flex items-center gap-4'>
            <label htmlFor='id' className='w-1/4 text-sm font-medium text-gray-700'>
              아이디:
            </label>
            <input
              type='text'
              id='id'
              name='id'
              value={formData.id}
              readOnly
              className='w-3/4 p-2 border border-gray-300  bg-gray-100 cursor-not-allowed'
            />
          </div>

          {/* 이름 */}
          <div className='flex items-center gap-4'>
            <label htmlFor='name' className='w-1/4 text-sm font-medium text-gray-700'>
              이름:
            </label>
            <input
              type='text'
              id='name'
              name='name'
              value={formData.name}
              readOnly
              className='w-3/4 p-2 border border-gray-300  bg-gray-100 cursor-not-allowed'
            />
          </div>

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
              className='w-3/4 p-2 border border-gray-300  focus:ring-blue-500 focus:border-blue-500'
            />
          </div>

          {/* 전화번호 */}
          <div className='flex items-center gap-4'>
            <label htmlFor='phone' className='w-1/4 text-sm font-medium text-gray-700'>
              전화번호:
            </label>
            <input
              type='tel'
              id='phone'
              name='phone'
              value={formData.phone}
              onChange={handleChange}
              required
              className='w-3/4 p-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500'
            />
          </div>

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
      )}
    </div>
  )
}

export default UpdateInfo
