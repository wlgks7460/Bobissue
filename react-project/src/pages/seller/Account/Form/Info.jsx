import React from 'react'
import { useNavigate } from 'react-router-dom'

const Info = ({ userInfo }) => {
  const navigate = useNavigate()

  const setIsEditing = () => {
    navigate('/seller/account/update-password') // 비밀번호 수정 페이지로 이동
  }

  return (
    <div className='p-6 bg-white rounded-lg w-[600px] border border-gray-300'>
      <h2 className='text-[28px] font-bold mb-6'>판매자 정보</h2>
      <div className='space-y-3 border border-gray-200 p-4 rounded-md'>
        <div className='flex justify-between'>
          <span className='font-medium text-gray-700 py-2'>비밀번호 </span>
          <button
            className='py-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-100'
            onClick={setIsEditing}
          >
            비밀번호 수정하기
          </button>
        </div>
        <div className='flex justify-between'>
          <span className='font-medium text-gray-700 py-2'>이름</span>
          <span className='text-gray-900 py-2'>{userInfo?.name}</span>
        </div>
        <div className='flex justify-between'>
          <span className='font-medium text-gray-700 py-2'>이메일</span>
          <span className='text-gray-900 py-2'>{userInfo?.email}</span>
        </div>
        <div className='flex justify-between'>
          <span className='font-medium text-gray-700 py-2'>회사명</span>
          <span className='text-gray-900 py-2'>{userInfo.company?.name}</span>
        </div>
        <div className='flex justify-between'>
          <span className='font-medium text-gray-700 py-2'>사업자번호</span>
          <span className='text-gray-900 py-2'>{userInfo.company?.license}</span>
        </div>
        <div className='flex justify-between'>
          <span className='font-medium text-gray-700 py-2'>전화번호</span>
          <span className='text-gray-900 py-2'>{userInfo?.callNumber}</span>
        </div>
      </div>
    </div>
  )
}

export default Info
