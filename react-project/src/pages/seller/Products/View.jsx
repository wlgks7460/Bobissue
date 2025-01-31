import React from 'react'
import { useNavigate, useLocation, Outlet } from 'react-router-dom'

const Details = () => {
  const navigate = useNavigate() // 올바른 훅 사용
  const location = useLocation() // useLocation을 통해 데이터 가져오기
  const product = location.state // 전달된 product 객체

  const handleUpdateClick = (pr) => {
    navigate('update', { state: pr }) // navigate로 이동 처리
  }

  const handleDeleteClick = (pr) => {
    navigate('delete', { state: pr }) // navigate로 이동 처리
  }

  if (!product) {
    return <p className='text-center text-gray-500'>상품이 존재하지 않습니다.</p>
  }

  return (
    <div className='p-6 bg-white rounded-lg  max-w-2xl mx-auto'>
      <h1 className='text-2xl font-bold mb-6 text-center'>상품 상세 정보</h1>
      <div className='mb-6'>
        <p className='mb-2'>
          <span className='font-semibold text-gray-700'>카테고리:</span> {product.category}
        </p>
        <p className='mb-2'>
          <span className='font-semibold text-gray-700'>가격:</span>{' '}
          {product.price.toLocaleString()}원
        </p>
        <p>
          <span className='font-semibold text-gray-700'>재고:</span> {product.stock || '정보 없음'}
          개
        </p>
      </div>

      <div className='flex justify-between'>
        <button
          onClick={() => handleUpdateClick(product)}
          className='bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:ring focus:ring-blue-300'
        >
          수정하기
        </button>
        <button
          onClick={() => handleDeleteClick(product)}
          className='bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 focus:ring focus:ring-red-300'
        >
          삭제하기
        </button>
      </div>

      <Outlet />
    </div>
  )
}

export default Details
