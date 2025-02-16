import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

const MypageSidebar = () => {
  const userInfo = useSelector((state) => state.user.userInfo)
  const userGradeIcon = {
    BRONZE: '🥉',
    SILVER: '🥈',
    GOLD: '🥇',
  }
  useEffect
  const [showUserGradeTooltip, setShowUserGradeTooltip] = useState(false)
  return (
    <div className='flex-none w-[300px]'>
      {/* 회원등급, 쿠폰 / 포인트 */}
      <div className='w-full p-5 border border-[#6F4E37] rounded mb-5'>
        <div className='flex gap-2  items-center'>
          <h3 className='text-lg'>반갑습니다! {userInfo.name}님!</h3>
          <div className='relative'>
            <span
              onMouseOver={() => setShowUserGradeTooltip(true)}
              onMouseOut={() => setShowUserGradeTooltip(false)}
            >
              {userGradeIcon[userInfo.grade]}
            </span>
            {showUserGradeTooltip && (
              <div className='absolute w-[80px] text-center bg-black rounded '>
                <span className='text-white text-xs px-2 py-1'>{userInfo.grade}</span>
              </div>
            )}
          </div>
        </div>
        <hr className='my-2 border-[#6F4E37]' />
        <div className='flex justify-center gap-5'>
          <div className='w-[140px]'>
            <p className='text-sm text-gray-500'>발급된 쿠폰</p>
            <button>
              <span className='text-lg font-bold'>1</span> 장
            </button>
          </div>
          <div className='border-s border-[#6F4E37]'></div>
          <div className='w-[140px]'>
            <p className='text-sm text-gray-500'>포인트</p>
            <p className='text-lg font-bold'>00000</p>
          </div>
        </div>
      </div>
      {/* 마이페이지 내비게이션 */}
      <div className='w-full p-10 border border-[#6F4E37] rounded flex flex-col gap-5'>
        <div className='flex flex-col gap-3'>
          {/* 유저 정보 */}
          <h3 className='text-sm text-gray-400'>내 정보 관리</h3>
          <Link to={'/mypage/info'} className='text-left'>
            개인정보 수정
          </Link>
          <Link to={'/mypage/address'} className='text-left'>
            배송지관리
          </Link>
        </div>
        <hr className='border-[#6F4E37]' />
        <div className='flex flex-col gap-3'>
          {/* 식단 관련 */}
          <h3 className='text-sm text-gray-400'>식단</h3>
          <Link to={'/mypage/calender'} className='text-left'>
            식단 관리
          </Link>
          <Link to={'/mypage/recipe'} className='text-left'>
            내 레시피
          </Link>
        </div>
        <hr className='border-[#6F4E37]' />
        <div className='flex flex-col gap-3'>
          {/* 구매 관련 */}
          <h3 className='text-sm text-gray-400'>쇼핑</h3>
          <Link to={'/mypage/order'} className='text-left'>
            주문 내역
          </Link>
          <Link className='text-left'>상품 후기</Link>
          <Link className='text-left'>취소 / 환불</Link>
          <Link className='text-left'>상품 문의</Link>
        </div>
      </div>
    </div>
  )
}
export default MypageSidebar
