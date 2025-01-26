import React from 'react'
import Breadcrumb from '../common/Breadcrumb'

const CouponStatusComponent = () => {
  // Breadcrumb에 사용할 경로 데이터
  const breadcrumbPaths = [
    { name: 'Home', link: '/' }, // 홈
    { name: '컨텐츠관리', link: '/content' },
    { name: '쿠폰관리', link: '/content/coupons' },
    { name: '쿠폰현황조회' },
  ]

  // 쿠폰 데이터 (샘플 데이터)
  const coupons = [
    {
      id: 1,
      name: '10% OFF',
      discountRate: '10%',
      category: '식단 관리',
      period: '2025-01-01 ~ 2025-12-31',
      usedCount: 120,
      issuedCount: 200,
    },
    {
      id: 2,
      name: '무료 배송 쿠폰',
      discountRate: '배송비 무료',
      category: '운동 용품',
      period: '2025-01-01 ~ 2025-06-30',
      usedCount: 50,
      issuedCount: 100,
    },
    {
      id: 3,
      name: '20% OFF 첫 구매',
      discountRate: '20%',
      category: '다이어트 식품',
      period: '2025-01-01 ~ 2025-12-31',
      usedCount: 300,
      issuedCount: 500,
    },
  ]

  // 수정 버튼 클릭 핸들러
  const handleEdit = (id) => {
    console.log(`쿠폰 수정: ${id}`)
    // 수정 로직 추가 (예: 모달창 열기 또는 별도 페이지로 이동)
  }

  // 삭제 버튼 클릭 핸들러
  const handleDelete = (id) => {
    console.log(`쿠폰 삭제: ${id}`)
    // 삭제 로직 추가 (예: API 호출 및 데이터 삭제 후 상태 업데이트)
  }

  return (
    <div className='p-6'>
      {/* Breadcrumb */}
      <Breadcrumb paths={breadcrumbPaths} />
      <h2 className='text-2xl font-bold mb-6'>쿠폰 현황조회</h2>

      {/* 운영 중인 쿠폰 목록 */}
      <h3 className='text-md font-semibold mb-4'>| 운영 중인 쿠폰 목록</h3>
      <table className='table-auto w-full border'>
        <thead>
          <tr className='bg-gray-100'>
            <th className='border px-4 py-2'>번호</th>
            <th className='border px-4 py-2'>쿠폰 이름</th>
            <th className='border px-4 py-2'>할인률</th>
            <th className='border px-4 py-2'>할인 카테고리</th>
            <th className='border px-4 py-2'>적용 기간</th>
            <th className='border px-4 py-2'>이용한 사람 수</th>
            <th className='border px-4 py-2'>지급된 사람 수</th>
            <th className='border px-4 py-2'>작업</th>
          </tr>
        </thead>
        <tbody>
          {coupons.map((coupon) => (
            <tr key={coupon.id}>
              <td className='border px-4 py-2 text-center'>{coupon.id}</td>
              <td className='border px-4 py-2'>{coupon.name}</td>
              <td className='border px-4 py-2 text-center'>{coupon.discountRate}</td>
              <td className='border px-4 py-2'>{coupon.category}</td>
              <td className='border px-4 py-2 text-center'>{coupon.period}</td>
              <td className='border px-4 py-2 text-center'>{coupon.usedCount}</td>
              <td className='border px-4 py-2 text-center'>{coupon.issuedCount}</td>
              <td className='border px-4 py-2 text-center'>
                <button
                  className='bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 mr-2'
                  onClick={() => handleEdit(coupon.id)}
                >
                  수정
                </button>
                <button
                  className='bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600'
                  onClick={() => handleDelete(coupon.id)}
                >
                  삭제
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default CouponStatusComponent
