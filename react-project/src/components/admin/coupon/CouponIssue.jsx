import React from 'react'
import Breadcrumb from '../common/Breadcrumb'

const CouponIssueComponent = () => {
  // Breadcrumb에 사용할 경로 데이터
  const breadcrumbPaths = [
    { name: 'Home', link: '/' }, // 홈
    { name: '컨텐츠관리', link: '/content' },
    { name: '쿠폰관리', link: '/content/coupons' },
    { name: '쿠폰발급' },
  ]

  return (
    <div className='p-6'>
      {/* Breadcrumb */}
      <Breadcrumb paths={breadcrumbPaths} />
      <h1 className='text-2xl font-bold mb-6'>쿠폰 발급</h1>

      {/* 입력란 */}
      <div className='mb-6'>
        <h2 className='text-lg font-semibold mb-4'>| 신규 쿠폰 발급</h2>
        <form>
          <div className='grid grid-cols-2 gap-4'>
            {/* 쿠폰 번호 */}
            <div>
              <label className='block text-sm font-medium mb-1'>쿠폰 번호</label>
              <input
                type='text'
                placeholder='예: 12345'
                className='w-full border border-gray-300 rounded px-3 py-2'
              />
            </div>
            {/* 쿠폰 이름 */}
            <div>
              <label className='block text-sm font-medium mb-1'>쿠폰 이름</label>
              <input
                type='text'
                placeholder='예: 신규 가입 10% 할인'
                className='w-full border border-gray-300 rounded px-3 py-2'
              />
            </div>
            {/* 할인률 */}
            <div>
              <label className='block text-sm font-medium mb-1'>할인률</label>
              <input
                type='text'
                placeholder='예: 10%'
                className='w-full border border-gray-300 rounded px-3 py-2'
              />
            </div>
            {/* 할인 카테고리 */}
            <div>
              <label className='block text-sm font-medium mb-1'>할인 카테고리</label>
              <input
                type='text'
                placeholder='예: 다이어트 식품'
                className='w-full border border-gray-300 rounded px-3 py-2'
              />
            </div>
            {/* 적용 기간 */}
            <div>
              <label className='block text-sm font-medium mb-1'>적용 기간</label>
              <input
                type='text'
                placeholder='예: 2025-01-01 ~ 2025-12-31'
                className='w-full border border-gray-300 rounded px-3 py-2'
              />
            </div>
            {/* 지급 대상자 */}
            <div>
              <label className='block text-sm font-medium mb-1'>지급 대상자</label>
              <input
                type='text'
                placeholder='예: 신규 가입자'
                className='w-full border border-gray-300 rounded px-3 py-2'
              />
            </div>
            {/* 기타 */}
            <div className='col-span-2'>
              <label className='block text-sm font-medium mb-1'>기타</label>
              <textarea
                placeholder='추가 정보를 입력하세요.'
                className='w-full border border-gray-300 rounded px-3 py-2'
              ></textarea>
            </div>
          </div>
        </form>
      </div>

      {/* 신규 쿠폰 발급하기 버튼 */}
      <div className='mt-6'>
        <button className='border border-blue-500 text-blue-500 px-6 py-2 rounded hover:bg-blue-500 hover:text-white transition'>
          <i className='fa-solid fa-plus mr-2'></i>
          발급하기
        </button>
      </div>
    </div>
  )
}

export default CouponIssueComponent
