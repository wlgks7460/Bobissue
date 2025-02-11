import React from 'react'
import Breadcrumb from '../common/Breadcrumb'

const SellerDetail = () => {
  // Breadcrumb에 사용할 경로 데이터
  const breadcrumbPaths = [
    { name: 'Home' }, // 홈
    { name: '판매자 관리' },
    { name: '판매자 상세' },
  ]
  return (
    <div className='p-6'>
      {/* Breadcrumb */}
      <Breadcrumb paths={breadcrumbPaths} />
      <h1 className='text-2xl font-bold mb-6'>판매자 상세조회</h1>
    </div>
  )
}

export default SellerDetail
