import React from 'react'
import { useNavigate } from 'react-router-dom'

const Info = ({ userInfo }) => {
  const navigate = useNavigate()

  const handleEditPassword = () => {
    navigate('/seller/account/update-password') // 비밀번호 수정 페이지로 이동
  }

  return (
    <div className='p-6 bg-white rounded-lg w-[600px] border border-gray-300'>
      <h2 className='text-[28px] font-bold mb-6'>판매자 정보</h2>

      <div className='space-y-3 border border-gray-200 p-4 rounded-md'>
        <div className='flex justify-between items-center border-b pb-3'>
          <span className='font-medium text-gray-700'>비밀번호</span>
          <button
            className='py-2 bg-white border border-gray-300 text-gray-700 px-4 rounded-md hover:bg-gray-100 transition'
            onClick={handleEditPassword}
          >
            비밀번호 수정하기
          </button>
        </div>

        <div className='flex justify-between border-b py-3'>
          <span className='font-medium text-gray-700'>이름</span>
          <span className='text-gray-900'>{userInfo?.name || '정보 없음'}</span>
        </div>

        <div className='flex justify-between border-b py-3'>
          <span className='font-medium text-gray-700'>이메일</span>
          <span className='text-gray-900'>{userInfo?.email || '정보 없음'}</span>
        </div>

        <div className='flex justify-between border-b py-3'>
          <span className='font-medium text-gray-700'>회사명</span>
          <span className='text-gray-900'>{userInfo.company?.name || '정보 없음'}</span>
        </div>

        <div className='flex justify-between border-b py-3'>
          <span className='font-medium text-gray-700'>사업자번호</span>
          <span className='text-gray-900'>{userInfo.company?.license || '정보 없음'}</span>
        </div>

        <div className='flex justify-between py-3'>
          <span className='font-medium text-gray-700'>전화번호</span>
          <span className='text-gray-900'>{userInfo?.callNumber || '정보 없음'}</span>
        </div>
      </div>
    </div>
  )
}

export default Info
