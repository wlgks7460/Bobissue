import React from 'react'
import Breadcrumb from '../common/Breadcrumb'

const LiveRegisterDetail = () => {
  // Breadcrumb에 사용할 경로 데이터
  const breadcrumbPaths = [
    { name: 'Home' }, // 홈
    { name: '라이브커머스 관리' },
    { name: '라이브커머스 신청관리' },
    { name: '라이브커머스 신청 상세' },
  ]
  return (
    <div className='p-6'>
      {/* Breadcrumb */}
      <Breadcrumb paths={breadcrumbPaths} />
      <h2 className='text-2xl font-bold mb-6'>📅 라이브커머스 신청 상세</h2>
    </div>
  )
}
export default LiveRegisterDetail
