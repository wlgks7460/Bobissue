import React from 'react'
import Breadcrumb from '../common/Breadcrumb'

const CategoryAnalysisComponent = () => {
  // Breadcrumb에 사용할 경로 데이터
  const breadcrumbPaths = [{ name: 'Home' }, { name: '쇼핑몰 분석' }, { name: '카테고리별 분석' }]
  return (
    <div className='p-6'>
      <Breadcrumb paths={breadcrumbPaths} />
      <h2 className='text-2xl font-bold mb-6'>카테고리별 분석</h2>
    </div>
  )
}
export default CategoryAnalysisComponent
