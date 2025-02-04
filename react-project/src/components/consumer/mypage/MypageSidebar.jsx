import React, { useState } from 'react'

const MypageSidebar = ({ userInfo }) => {
  const userGradeIcon = ['🍚', '🍙', '🍛', '🍱']
  const userGrade = ['일반 회원', '우수 회원', 'VIP', 'VVIP']
  const [showUserGradeTooltip, setShowUserGradeTooltip] = useState(false)
  return (
    <div className='flex-none w-[300px]'>
      <div className='w-full p-3 border border-gray-300 rounded'>
        <div className='flex gap-2  items-center'>
          <h3 className='text-lg'>반갑습니다! {userInfo.name}님!</h3>
          <div className='relative'>
            <span
              onMouseOver={() => setShowUserGradeTooltip(true)}
              onMouseOut={() => setShowUserGradeTooltip(false)}
            >
              {userGradeIcon[userInfo.gradeNo]}
            </span>
            {showUserGradeTooltip && (
              <div className='absolute w-[80px] text-center bg-black/30 rounded'>
                <span className='text-white'>{userGrade[userInfo.gradeNo]}</span>
              </div>
            )}
          </div>
        </div>
        <hr className='my-2' />
        <div className='grid grid-cols-2'>
          <div>
            <p className='text-sm text-gray-500'>발급된 쿠폰</p>
            <button>
              <span className='text-lg font-bold'>1</span> 장
            </button>
          </div>
          <div className='border-s border-gray-300 ps-2'>
            <p className='text-sm text-gray-500'>포인트</p>
            <p className='text-lg font-bold'>00000</p>
          </div>
        </div>
      </div>
      <div className='w-full'></div>
    </div>
  )
}

export default MypageSidebar
