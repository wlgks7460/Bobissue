import React, { useState, useEffect } from 'react'
import { FaAngleDoubleLeft, FaAngleLeft, FaAngleRight, FaAngleDoubleRight } from 'react-icons/fa'
import OrderPopup from './Popup/OrderPopup'
import API from '../../../utils/API'

const Orders = () => {
  const [orderList, setOrderList] = useState([])
  const [filteredOrders, setFilteredOrders] = useState([])
  const [selectedOrderStatus, setSelectedOrderStatus] = useState('all')
  const [selectedDeliveryStatus, setSelectedDeliveryStatus] = useState('all')
  const [popupData, setPopupData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isOpenPopup, setIsOpenPopup] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [trackingNumbers, setTrackingNumbers] = useState({})
  const ordersPerPage = 10
  const pagesPerGroup = 5

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true)
      try {
        const response = await API.get('/orders')
        if (response.data.status === 'OK') {
          setOrderList(response.data.result.data)
        } else {
          throw new Error(response.data.message.label)
        }
      } catch (err) {
        setError('주문 목록을 불러오는 중 오류가 발생했습니다.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrders()
  }, [])

  useEffect(() => {
    const filtered = orderList.filter(
      (order) =>
        (selectedOrderStatus === 'all' || order.orderStatus === selectedOrderStatus) &&
        (selectedDeliveryStatus === 'all' || order.deliveryStatus === selectedDeliveryStatus),
    )
    setFilteredOrders(filtered)
    setCurrentPage(1)
  }, [selectedOrderStatus, selectedDeliveryStatus, orderList])

  const handleTrackingChange = (orderNo, value) => {
    setTrackingNumbers((prev) => ({ ...prev, [orderNo]: value }))
  }

  const handleSaveTrackingNumber = async (orderNo) => {
    try {
      await API.post(`/orders/${orderNo}/tracking`, { trackingNumber: trackingNumbers[orderNo] })
      alert('송장번호가 저장되었습니다.')
    } catch (error) {
      alert('송장번호 저장에 실패했습니다.')
    }
  }

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage)
  const displayedOrders = filteredOrders.slice(
    (currentPage - 1) * ordersPerPage,
    currentPage * ordersPerPage,
  )

  return (
    <div className='min-h-screen flex flex-col bg-cream/20 py-10 px-5 sm:px-10'>
      <div className='flex-grow mx-auto'>
        <h1 className='text-4xl font-bold text-center mb-4 text-gray-800'>주문 관리</h1>
        <div className='flex justify-between gap-3 mb-4'>
          <div className='flex gap-2'>
            <span className='font-semibold text-gray-700'>주문 상태:</span>
            {['all', '결제 완료', '주문 확인중', '주문 완료', '취소됨'].map((status) => (
              <button
                key={status}
                onClick={() => setSelectedOrderStatus(status)}
                className={`px-4 py-1 rounded-md text-sm shadow-sm transition ${
                  selectedOrderStatus === status
                    ? 'bg-sky-400 text-white'
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                {status === 'all' ? '전체' : status}
              </button>
            ))}
          </div>
          <div className='flex gap-2'>
            <span className='font-semibold text-gray-700'>배송 상태:</span>
            {['all', '주문 확인중', '배송 준비중', '배송중', '배송 완료'].map((status) => (
              <button
                key={status}
                onClick={() => setSelectedDeliveryStatus(status)}
                className={`px-4 py-1 rounded-md text-sm shadow-sm transition ${
                  selectedDeliveryStatus === status
                    ? 'bg-orange-300 text-white'
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                {status === 'all' ? '전체' : status}
              </button>
            ))}
          </div>
        </div>
        <div className='bg-white p-4 shadow-lg rounded-lg'>
          <table className='w-full border border-gray-300 text-sm'>
            <thead className='bg-lightYellow-300 text-gray-900'>
              <tr>
                <th>주문번호</th>
                <th>결제 방식</th>
                <th>주문 상태</th>
                <th>배송 상태</th>
                <th>주문 일자</th>
                <th>총 금액</th>
                <th>송장번호</th>
              </tr>
            </thead>
            <tbody>
              {displayedOrders.map((order) => (
                <tr key={order.orderNo} className='hover:bg-gray-100'>
                  <td
                    className='cursor-pointer text-blue-600 hover:underline'
                    onClick={() => {
                      setPopupData(order)
                      setIsOpenPopup(true)
                    }}
                  >
                    {order.orderNo}
                  </td>
                  <td>{order.payment}</td>
                  <td>{order.orderStatus}</td>
                  <td>{order.deliveryStatus}</td>
                  <td>{order.createdAt}</td>
                  <td>{order.totalPrice.toLocaleString()} 원</td>
                  <td>
                    {order.orderStatus === '결제 완료' ? (
                      <div className='flex items-center gap-2'>
                        <input
                          type='text'
                          value={trackingNumbers[order.orderNo] || ''}
                          onChange={(e) => handleTrackingChange(order.orderNo, e.target.value)}
                          className='border px-2 py-1 rounded-md text-sm shadow-sm'
                        />
                        <button
                          onClick={() => handleSaveTrackingNumber(order.orderNo)}
                          className='bg-green-400 text-white px-2 py-1 rounded-md text-xs shadow-md hover:bg-green-500'
                        >
                          저장
                        </button>
                      </div>
                    ) : (
                      order.trackingNumber || '-'
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {isOpenPopup && <OrderPopup order={popupData} onClose={() => setIsOpenPopup(false)} />}
      </div>
    </div>
  )
}

export default Orders
