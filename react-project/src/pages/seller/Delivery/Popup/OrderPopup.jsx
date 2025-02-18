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
    <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50'>
      <div className='bg-white w-full max-w-xl rounded-lg shadow-lg p-6 border border-caramelTan relative'>
        {/* 닫기 버튼 */}
        <button
          className='absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-xl'
          onClick={onClose}
        >
          ✖
        </button>

        {/* 타이틀 */}
        <h2 className='text-2xl font-bold text-espressoBlack text-center mb-5'>주문 상세 정보</h2>

        {/* 상품 정보 섹션 (2열 정렬) */}
        <div className='grid grid-cols-2 gap-4 text-espressoBlack text-md'>
          <p className='font-semibold'>상품명</p>
          <p className='text-right'>{order.productName || '정보 없음'}</p>

          <p className='font-semibold'>옵션</p>
          <p className='text-right'>{order.option || '옵션 없음'}</p>

          <p className='font-semibold'>판매가</p>
          <p className='text-right'>
            {order.price ? `${order.price.toLocaleString()}원` : '가격 정보 없음'}
          </p>

          <p className='font-semibold'>수량</p>
          <p className='text-right'>{order.quantity} 개</p>

          <p className='font-semibold'>배송 상태</p>
          <p className='text-right'>{order.status || '상태 없음'}</p>
        </div>

        {/* 닫기 버튼 */}
        <div className='mt-6 flex justify-center'>
          <button
            onClick={onClose}
            className='w-full py-2 bg-mochaBrown text-white font-semibold rounded-lg hover:bg-espressoBlack transition duration-200'
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  )
}

export default OrderPopup
