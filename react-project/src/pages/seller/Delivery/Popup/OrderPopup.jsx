import React, { useEffect, useState } from 'react'
import API from '@/utils/API'
import { FaBoxOpen, FaTruck, FaCheckCircle, FaTimesCircle } from 'react-icons/fa'

const statusLabels = {
  1: { label: '결제 완료', color: 'text-healthyGreen', icon: <FaCheckCircle /> },
  2: { label: '주문 확인중', color: 'text-goldenAmber', icon: <FaBoxOpen /> },
  3: { label: '주문 완료', color: 'text-oceanBlue', icon: <FaCheckCircle /> },
  4: { label: '취소됨', color: 'text-warmRed', icon: <FaTimesCircle /> },
}

const deliveryLabels = {
  1: { label: '배송 준비중', color: 'text-charcoal', icon: <FaBoxOpen /> },
  2: { label: '배송중', color: 'text-cobalt-500', icon: <FaTruck /> },
  3: { label: '배송 완료', color: 'text-healthyGreen', icon: <FaCheckCircle /> },
}

const OrderPopup = ({ orderNo, onClose }) => {
  const [order, setOrder] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await API.get(`/orders/${orderNo}`)
        if (response.data.status === 'OK') {
          setOrder(response.data.result.data)
        } else {
          throw new Error(response.data.message.label)
        }
      } catch (err) {
        setError('주문 정보를 불러오는 중 오류가 발생했습니다.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrderDetails()
  }, [orderNo])

  useEffect(() => {
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
    <div className='fixed inset-0 flex items-center justify-center bg-espressoBlack/50 z-50'>
      <div className='bg-warmBeige w-full max-w-2xl rounded-xl shadow-2xl p-6 border border-latteBeige relative'>
        {/* 닫기 버튼 */}
        <button
          className='absolute top-3 right-3 text-coffeeBrown hover:text-darkSlate text-xl'
          onClick={onClose}
        >
          ✖
        </button>

        {/* 로딩 중 */}
        {isLoading && <p className='text-center text-darkSlate'>주문 정보를 불러오는 중...</p>}

        {/* 오류 발생 시 */}
        {error && <p className='text-center text-warmRed'>{error}</p>}

        {/* 주문 상세 정보 */}
        {order && (
          <>
            <h2 className='text-2xl font-bold text-espressoBlack text-center mb-6'>
              🛒 주문 상세 정보
            </h2>

            {/* 주문 기본 정보 */}
            <div className='bg-latteBeige p-4 rounded-xl shadow-md mb-4'>
              <p className='text-coffeeBrown font-medium'>주문번호: {order.orderNo}</p>
              <p className='text-coffeeBrown'>결제 방식: {order.payment}</p>
              <p className='text-coffeeBrown'>
                총 결제 금액:{' '}
                <span className='font-semibold'>{order.totalPrice.toLocaleString()} 원</span>
              </p>
              <p className='text-coffeeBrown'>주문 일자: {order.createdAt}</p>
              <p className='text-coffeeBrown'>요청 사항: {order.requests || '요청 사항 없음'}</p>
            </div>

            {/* 주문 및 배송 상태 */}
            <div className='grid grid-cols-2 gap-4 mb-4'>
              <div className='flex items-center p-4 bg-background border rounded-lg shadow-sm'>
                <span className={`mr-2 text-lg ${statusLabels[order.orderStatus]?.color}`}>
                  {statusLabels[order.orderStatus]?.icon}
                </span>
                <p className='text-espressoBlack font-semibold'>
                  주문 상태: {statusLabels[order.orderStatus].label || '정보 없음'}
                </p>
              </div>
              <div className='flex items-center p-4 bg-background border rounded-lg shadow-sm'>
                <span className={`mr-2 text-lg ${deliveryLabels[order.deliveryStatus]?.color}`}>
                  {deliveryLabels[order.deliveryStatus]?.icon}
                </span>
                <p className='text-espressoBlack font-semibold'>
                  배송 상태: {deliveryLabels[order.deliveryStatus].label || '정보 없음'}
                </p>
              </div>
            </div>

            {/* 상품 리스트 */}
            <h3 className='text-lg font-semibold text-coffeeBrown mb-3'>📦 주문 상품</h3>
            <div className='space-y-3'>
              {order.orderItems && order.orderItems.length > 0 ? (
                order.orderItems.map((item) => (
                  <div
                    key={item.itemNo}
                    className='p-4 border rounded-lg flex justify-between items-center bg-white shadow-sm'
                  >
                    <div>
                      <p className='font-semibold text-coffeeBrown'>{item.itemName}</p>
                      <p className='text-sm text-textSecondary'>수량: {item.count}개</p>
                    </div>
                    <p className='font-semibold text-coffeeBrown'>
                      {item.price.toLocaleString()} 원
                    </p>
                  </div>
                ))
              ) : (
                <p className='text-textSecondary'>주문한 상품 정보가 없습니다.</p>
              )}
            </div>

            {/* 닫기 버튼 */}
            <div className='mt-6 flex justify-center'>
              <button
                onClick={onClose}
                className='w-full py-3 bg-cobalt-500 text-white font-semibold rounded-lg hover:bg-cobalt-700 transition duration-200 shadow-md'
              >
                닫기
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default OrderPopup
