import React, { useEffect } from 'react'

const OrderPopup = ({ order, onClose }) => {
  useEffect(() => {
    // ESC 키를 누르면 팝업 닫기
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose])

  return (
    <div className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-30'>
      <div className='bg-white w-full max-w-md md:max-w-lg rounded-lg shadow-lg p-6 relative'>
        {/* 닫기 버튼 */}
        <button
          className='absolute top-3 right-3 text-gray-500 hover:text-gray-800'
          onClick={onClose}
        >
          ✖
        </button>

        {/* 타이틀 */}
        <h2 className='text-2xl font-bold mb-4 text-center'>📦 상품 상세 정보</h2>

        {/* 상품 정보 섹션 */}
        <div className='mb-4'>
          <h3 className='text-lg font-semibold border-b pb-2 mb-2'>🛍️ 상품 정보</h3>
          <div className='space-y-2'>
            <p>
              <span className='font-semibold'>상품명:</span> {order.productName}
            </p>
            <p>
              <span className='font-semibold'>옵션:</span> {order.option}
            </p>
            <p>
              <span className='font-semibold'>판매가:</span>{' '}
              {order.price ? `${order.price.toLocaleString()}원` : '가격 정보 없음'}
            </p>
            <p>
              <span className='font-semibold'>수량:</span> {order.quantity} 개
            </p>
            <p>
              <span className='font-semibold'>상태:</span> {order.status}
            </p>
          </div>
        </div>

        {/* 닫기 버튼 */}
        <div className='flex justify-center'>
          <button
            onClick={onClose}
            className='w-full py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-200'
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  )
}

export default OrderPopup
