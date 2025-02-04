import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Info = () => {
  const [userInfo, setUserInfo] = useState(null)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem('SELLER_AUTH_TOKEN')
        if (!token) {
          throw new Error('인증 토큰이 없습니다.')
        }

        // 디버깅용 가상 응답
        const response = {
          ok: true,
          json: async () => ({
            id: '12345',
            name: '홍길동',
            email: 'hong@example.com',
            createdAt: '2022-01-01T12:00:00Z',
            phone: '010-1234-5678',
          }),
        }

        if (response.ok) {
          const data = await response.json()
          setUserInfo(data)
        } else {
          throw new Error('사용자 정보를 불러올 수 없습니다.')
        }
      } catch (err) {
        setError(err.message)
      }
    }

    fetchUserInfo()
  }, [])

  if (error) {
    return <p className='text-red-500'>{error}</p>
  }

  if (!userInfo) {
    return <p className='text-gray-600'>로딩 중...</p>
  }

  return (
    <div className='p-6 bg-white rounded-lg w-[600px] border border-gray-300'>
      <h2 className='text-[28px] font-bold mb-6'>판매자 정보</h2>
      <div className='space-y-3 border border-gray-200 p-4 rounded-md'>
        <div className='flex justify-between'>
          <span className='font-medium text-gray-700 py-2'>아이디</span>
          <span className='text-gray-900 py-2'>{userInfo.id}</span>
        </div>
        <div className='flex justify-between'>
          <span className='font-medium text-grap-700'>비밀번호 </span>
          <button
            className='py-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-100'
            onClick={() => navigate('/seller/account/update-password')}
          >
            비밀번호 수정하기
          </button>
        </div>
        <div className='flex justify-between'>
          <span className='font-medium text-gray-700 py-2'>이름</span>
          <span className='text-gray-900 py-2'>{userInfo.name}</span>
        </div>
        <div className='flex justify-between'>
          <span className='font-medium text-gray-700 py-2'>이메일</span>
          <span className='text-gray-900 py-2'>{userInfo.email}</span>
        </div>
        <div className='flex justify-between'>
          <span className='font-medium text-gray-700 py-2'>가입일</span>
          <span className='text-gray-900 py-2'>
            {new Date(userInfo.createdAt).toLocaleDateString()}
          </span>
        </div>
        <div className='flex justify-between'>
          <span className='font-medium text-gray-700 py-2'>휴대폰</span>
          <span className='text-gray-900 py-2'>{userInfo.phone}</span>
        </div>
      </div>
      <div className='flex justify-center'>
        <button
          onClick={() => navigate('/seller/account/update-info')} // ✅ 오타 수정 (onCick → onClick)
          className='flex mt-2 items-center bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400'
        >
          개인정보 수정
        </button>
      </div>
    </div>
  )
}

export default Info
