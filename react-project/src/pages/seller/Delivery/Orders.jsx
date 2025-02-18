import React, { useState, useEffect } from 'react'
import { FaAngleDoubleLeft, FaAngleLeft, FaAngleRight, FaAngleDoubleRight } from 'react-icons/fa'
import OrderPopup from './Popup/OrderPopup'
import API from '@/utils/API'

const Orders = () => {
  const [orderList, setOrderList] = useState([])
  const [filteredOrders, setFilteredOrders] = useState([])
  const [selectedOrderStatus, setSelectedOrderStatus] = useState('all')
  const [popupOrderNo, setPopupOrderNo] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [trackingInfo, setTrackingInfo] = useState({})
  const [deliveryStatus, setDeliveryStatus] = useState({}) // 🚚 배송 상태 저장

  const ordersPerPage = 10

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
      (order) => selectedOrderStatus === 'all' || order.orderStatus === selectedOrderStatus,
    )
    setFilteredOrders(filtered)
    setCurrentPage(1)
  }, [selectedOrderStatus, orderList])

  return (
    <div className='w-full mx-auto px-8 py-10 min-h-screen bg-warmBeige/20'>
      {/* 헤더 */}
      <header className='text-center mb-12'>
        <h1 className='text-4xl font-extrabold text-espressoBlack'>📦 주문 관리</h1>
        <p className='text-lg text-coffeeBrown mt-3'>주문부터 배송까지 쉽게 관리하세요.</p>
      </header>

      {/* 주문 상태 필터 */}
      <div className='flex gap-4 justify-center mb-6'>
        {['all', '결제 완료', '주문 확인중', '주문 완료', '취소됨'].map((status) => (
          <button
            key={status}
            onClick={() => setSelectedOrderStatus(status)}
            className={`px-4 py-2 rounded-lg text-md font-medium transition-all shadow-md ${
              selectedOrderStatus === status
                ? 'bg-espressoBlack text-warmBeige'
                : 'bg-latteBeige text-coffeeBrown hover:bg-coffeeBrown hover:text-warmBeige'
            }`}
          >
            {status === 'all' ? '전체' : status}
          </button>
        ))}
      </div>

      {/* 주문 목록 테이블 */}
      <div className='bg-white p-6 shadow-lg rounded-xl'>
        <table className='w-full border border-gray-300 text-md'>
          <thead className='bg-espressoBlack text-warmBeige'>
            <tr>
              <th className='py-3 px-4'>주문번호</th>
              <th className='py-3 px-4'>결제 방식</th>
              <th className='py-3 px-4'>주문 상태</th>
              <th className='py-3 px-4'>주문 일자</th>
              <th className='py-3 px-4'>총 금액</th>
              <th className='py-3 px-4'>배송 상태</th>
              <th className='py-3 px-4'>송장번호</th>
              <th className='py-3 px-4'>택배사</th>
              <th className='py-3 px-4'>관리</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders
              .slice((currentPage - 1) * ordersPerPage, currentPage * ordersPerPage)
              .map((order) => (
                <tr key={order.orderNo} className='hover:bg-latteBeige transition-all'>
                  <td
                    className='cursor-pointer text-blue-600 hover:underline py-3 px-4'
                    onClick={() => setPopupOrderNo(order.orderNo)}
                  >
                    {order.orderNo}
                  </td>
                  <td className='py-3 px-4'>{order.payment}</td>
                  <td className='py-3 px-4'>{order.orderStatus}</td>
                  <td className='py-3 px-4'>{order.createdAt}</td>
                  <td className='py-3 px-4'>{order.totalPrice.toLocaleString()} 원</td>
                  <td className='py-3 px-4 text-green-500 font-semibold'>
                    {deliveryStatus[order.orderNo] || '-'}
                  </td>
                  <td className='py-3 px-4'>
                    <input
                      type='text'
                      value={trackingInfo[order.orderNo]?.trackingNumber || ''}
                      className='border px-2 py-1 w-28 rounded-md bg-warmBeige text-espressoBlack'
                      placeholder='송장번호'
                    />
                  </td>
                  <td className='py-3 px-4'>
                    <input
                      type='text'
                      value={trackingInfo[order.orderNo]?.deliveryCompany || ''}
                      className='border px-2 py-1 w-28 rounded-md bg-warmBeige text-espressoBlack'
                      placeholder='택배사'
                    />
                  </td>
                  <td className='py-3 px-4'>
                    <button className='bg-espressoBlack text-warmBeige px-3 py-1 rounded-lg shadow-md hover:bg-coffeeBrown'>
                      저장
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {popupOrderNo && <OrderPopup orderNo={popupOrderNo} onClose={() => setPopupOrderNo(null)} />}
    </div>
  )
}

export default Orders
