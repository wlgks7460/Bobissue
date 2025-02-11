import React, { useState, useEffect } from 'react'
import OrderPopup from './Popup/OrderPopup'
import API from '../../../utils/API'

const Orders = () => {
  const debugMode = true

  const [selectedOrders, setSelectedOrders] = useState([])
  const [popupData, setPopupData] = useState(null)
  const [orderList, setOrderList] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const dummyOrders = [
    {
      orderId: '10001',
      productName: '무선충전기',
      option: '블랙',
      quantity: 1,
      status: '결제완료',
    },
    {
      orderId: '10002',
      productName: '게이밍 키보드',
      option: '청축',
      quantity: 1,
      status: '결제완료',
    },
    {
      orderId: '10003',
      productName: '노트북 거치대',
      option: '알루미늄',
      quantity: 2,
      status: '배송중',
    },
    {
      orderId: '10004',
      productName: '무선 마우스',
      option: '화이트',
      quantity: 1,
      status: '결제완료',
    },
    {
      orderId: '10005',
      productName: '스탠드 조명',
      option: 'LED',
      quantity: 1,
      status: '배송완료',
    },
  ]

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true)

      if (debugMode) {
        console.log('📢 [디버그 모드] 더미 데이터 사용 중...')
        setOrderList(dummyOrders)
        setIsLoading(false)
        return
      }

      try {
        const response = await API.get('/orders')
        if (response.data.status === 'OK') {
          setOrderList(response.data.result.data)
        } else {
          throw new Error(response.data.message.label)
        }
      } catch (err) {
        console.error('API 요청 실패:', err)
        setError('주문 목록을 불러오는 중 오류가 발생했습니다.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrders()
  }, [])

  const handleSelectOrder = (orderId) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId],
    )
  }

  const handleOpenPopup = (order) => {
    if (order.status === '결제완료') {
      setPopupData(order)
    }
  }

  const handleClosePopup = () => {
    setPopupData(null)
  }

  return (
    <div className='p-6 w-full bg-gradient-to-b from-gray-100 to-gray-50 min-h-screen'>
      <h1 className='text-3xl font-bold text-gray-800 mb-6'>🛒 주문 관리</h1>

      {isLoading ? (
        <p className='text-gray-500 text-lg'>로딩 중...</p>
      ) : error ? (
        <p className='text-red-500 text-lg'>{error}</p>
      ) : (
        <div className='overflow-hidden border border-gray-300 rounded-xl bg-white'>
          <table className='w-full text-left border-collapse'>
            <thead className='bg-gray-100 text-gray-700'>
              <tr>
                <th className='p-4 border-b'>선택</th>
                <th className='p-4 border-b'>주문 번호</th>
                <th className='p-4 border-b'>상품명</th>
                <th className='p-4 border-b'>옵션 / 수량</th>
                <th className='p-4 border-b'>주문 상태</th>
              </tr>
            </thead>
            <tbody>
              {orderList.map((order) => (
                <tr key={order.orderId} className='border-b hover:bg-gray-100 transition'>
                  <td className='p-4'>
                    <label className='flex items-center cursor-pointer'>
                      <input
                        type='checkbox'
                        checked={selectedOrders.includes(order.orderId)}
                        onChange={() => handleSelectOrder(order.orderId)}
                        disabled={order.status !== '결제완료'}
                        className='peer hidden'
                      />
                      <span
                        className={`w-5 h-5 inline-block border-2 rounded-md ${
                          selectedOrders.includes(order.orderId)
                            ? 'bg-blue-500 border-blue-500'
                            : 'border-gray-400'
                        }`}
                      ></span>
                    </label>
                  </td>
                  <td className='p-4'>
                    {order.status === '결제완료' ? (
                      <button
                        onClick={() => handleOpenPopup(order)}
                        className='text-blue-600 hover:text-blue-800 font-medium transition'
                      >
                        {order.orderId}
                      </button>
                    ) : (
                      <span className='text-gray-600'>{order.orderId}</span>
                    )}
                  </td>
                  <td className='p-4 text-gray-800'>{order.productName}</td>
                  <td className='p-4 text-gray-700'>
                    {order.option} / {order.quantity}
                  </td>
                  <td className='p-4'>
                    <span
                      className={`px-3 py-1 text-sm font-semibold rounded-full 
                      ${
                        order.status === '결제완료'
                          ? 'bg-green-100 text-green-700 border border-green-300'
                          : order.status === '배송중'
                            ? 'bg-yellow-100 text-yellow-700 border border-yellow-300'
                            : 'bg-gray-200 text-gray-700 border border-gray-300'
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {popupData && <OrderPopup order={popupData} onClose={handleClosePopup} />}
    </div>
  )
}

export default Orders
