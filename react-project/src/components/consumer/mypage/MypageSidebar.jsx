import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import MyPageCouponModal from './MyPageCouponModal'

const MypageSidebar = () => {
  const userInfo = useSelector((state) => state.user.userInfo)
  const userGradeIcon = {
    BRONZE: '🥉',
    SILVER: '🥈',
    GOLD: '🥇',
  }
  const [showUserGradeTooltip, setShowUserGradeTooltip] = useState(false)

  // 상품 가격 , 찍기
  const addComma = (price) => {
    return price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

  // modal
  const [showModal, setShowModal] = useState(false)

  const [coupons, setCoupons] = useState([
    {
      couponNo: 1,
      createdAt: '20250219 120000',
      createdUser: 'admin',
      delYn: 'N',
      updatedAt: '20250219 120000',
      updatedUser: 'admin',
      content: '첫 주문 10% 할인',
      deductedPrice: 5000,
      minDeliveryPrice: 20000,
      name: 'WELCOME10',
      term: '20250219 ~ 20250319',
      companyNo: 1001,
    },
    {
      couponNo: 2,
      createdAt: '20250219 120000',
      createdUser: 'admin',
      delYn: 'N',
      updatedAt: '20250219 120000',
      updatedUser: 'admin',
      content: '5만원 이상 구매 시 1만원 할인',
      deductedPrice: 10000,
      minDeliveryPrice: 50000,
      name: 'BIGSALE10K',
      term: '20250219 ~ 20250419',
      companyNo: 1002,
    },
  ])

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
            <button className='text-right' onClick={() => setShowModal(true)}>
              <span className='text-lg font-bold px-2'>1</span> 장
            </button>
          </div>
          <div className='border-s border-[#6F4E37]'></div>
          <div className='w-[140px]'>
            <p className='text-sm text-gray-500'>포인트</p>
            <p className='text-lg font-bold px-2'>{addComma(5000)}</p>
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
          <Link to={'/mypage/review'} className='text-left'>
            상품 후기
          </Link>
          <Link to={'/mypage/cancelRefund'} className='text-left'>
            취소 / 환불
          </Link>
          <Link to={'/mypage/question'} className='text-left'>
            상품 문의
          </Link>
        </div>
      </div>
      {showModal && <MyPageCouponModal setShowModal={setShowModal} coupons={coupons} />}
    </div>
  )
}
export default MypageSidebar
