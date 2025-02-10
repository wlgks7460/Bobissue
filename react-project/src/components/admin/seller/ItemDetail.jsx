import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Breadcrumb from '../common/Breadcrumb'
import API from '../../../utils/API'

const MonitorItemDetail = () => {
  const { itemNo } = useParams()
  const [item, setItem] = useState(null)

  const breadcrumbPaths = [
    { name: 'Home' },
    { name: '판매자 관리' },
    { name: '모니터링' },
    { name: '상품상세' },
  ]

  useEffect(() => {
    fetchItemDetails()
  }, [])

  const fetchItemDetails = async () => {
    try {
      const response = await API.get(`/item/${itemNo}`)
      if (response.data.status === 'OK') {
        setItem(response.data.result.data)
      }
    } catch (error) {
      console.error('상품 상세 조회 오류:', error)
    }
  }

  // 날짜 변환 함수 (20250210 004119 -> 2025년 02월 10일)
  const formatDate = (dateString) => {
    if (!dateString) return '정보 없음'
    const year = dateString.substring(0, 4)
    const month = dateString.substring(4, 6)
    const day = dateString.substring(6, 8)
    return `${year}년 ${month}월 ${day}일`
  }

  if (!item) {
    return (
      <div className='p-6'>
        <Breadcrumb paths={breadcrumbPaths} />
        <h1 className='text-2xl font-bold mb-6'>상품 상세</h1>
        <p>로딩 중...</p>
      </div>
    )
  }

  return (
    <div className='p-6'>
      <Breadcrumb paths={breadcrumbPaths} />
      <h1 className='text-2xl font-bold mb-6'>상품 상세</h1>

      <div className='flex flex-col lg:flex-row gap-8'>
        {/* 상품 이미지 */}
        <div className='flex self-start lg:mr-auto'>
          <img
            src={
              item.images.length > 0 ? item.images[0].imageUrl : 'https://via.placeholder.com/400'
            }
            alt={item.name}
            className='w-full max-w-lg rounded-lg shadow-md'
          />
        </div>

        {/* 상품 정보 */}
        <div className='space-y-6 lg:w-2/3'>
          {/* 상품명 & 카테고리 */}
          <div>
            <h2 className='text-3xl font-semibold'>🏷 {item.name}</h2>
            <p className='text-sm text-gray-500 mt-3'>
              🛍 카테고리: {item.category.parentName ? `${item.category.parentName} > ` : ''}
              {item.category.name}
            </p>
          </div>

          {/* 가격 정보 */}
          <div className='bg-gray-100 p-4 rounded-lg'>
            <p className='text-lg text-gray-700 line-through'>
              정가: {item.price.toLocaleString()}원
            </p>
            <p className='text-2xl text-red-600 font-bold'>
              🔥 할인가: {item.salePrice.toLocaleString()}원
            </p>
            <p className='text-sm text-green-600 mt-1'>
              💸 {(((item.price - item.salePrice) / item.price) * 100).toFixed(0)}% 할인 중!
            </p>
          </div>

          {/* 재고 & 날짜 정보 */}
          <div className='border-b pb-3 space-y-2'>
            <p className='text-xl font-semibold text-gray-700'>
              📦 재고 현황: <span>{item.stock}개</span>
            </p>
            <p className='text-sm text-gray-500'>- 작성일: {formatDate(item.createdAt)}</p>
            <p className='text-sm text-gray-500'>- 수정일: {formatDate(item.updatedAt)}</p>
          </div>

          {/* 판매자 정보 */}
          <div className='bg-gray-100 p-4 rounded-lg'>
            <p className='text-lg font-semibold'>🏢 판매자: {item.companyNo.name}</p>
            <p className='text-sm text-gray-600'>사업자 등록번호: {item.companyNo.license}</p>
          </div>

          {/* 상품 설명 */}
          <div>
            <h3 className='text-lg font-bold'>| 상품 설명</h3>
            <p className='text-gray-700 mt-2'>{item.description}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MonitorItemDetail
