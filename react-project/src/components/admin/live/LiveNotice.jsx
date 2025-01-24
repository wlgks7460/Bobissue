import React from 'react'
import Breadcrumb from '../common/Breadcrumb'

const LiveNotice = () => {
  // Breadcrumb에 사용할 경로 데이터
  const breadcrumbPaths = [
    { name: 'Home' }, // 홈
    { name: '라이브커머스 관리' },
    { name: '라이브공지관리' }, // 현재 페이지
  ]
  return (
    <div className='p-6'>
      {/* Breadcrumb */}
      <Breadcrumb paths={breadcrumbPaths} />
      <h2 className='text-2xl font-bold mb-6'>라이브 공지 관리</h2>
      <p>여기에 라이브 공지 관리를 위한 내용이 들어갑니다.</p>
    </div>
  )
}

export default LiveNotice
