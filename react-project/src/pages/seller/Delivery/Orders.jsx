import React, { useState, useEffect } from 'react'
import { FaAngleDoubleLeft, FaAngleLeft, FaAngleRight, FaAngleDoubleRight } from 'react-icons/fa'
import OrderPopup from './Popup/OrderPopup'
import API from '@/utils/API'
import { useOutletContext } from 'react-router-dom'

const ORDER_STATUS_MAP = {
  0: '전체',
  1: '주문 확인중',
  2: '상품 준비중',
  3: '배송 출발',
  4: '배송 완료',
}

const Orders = () => {
  const { companyNo } = useOutletContext()
  const [orderList, setOrderList] = useState([])
  const [filteredOrders, setFilteredOrders] = useState([])
  const [selectedOrderStatus, setSelectedOrderStatus] = useState(0)
  const [popupOrderNo, setPopupOrderNo] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [trackingInfo, setTrackingInfo] = useState({})
  const [deliveryStatus, setDeliveryStatus] = useState({})

  const ordersPerPage = 10 // 한 페이지당 주문 개수

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true)
      try {
        const response = await API.get(`/delivery/${companyNo}/${selectedOrderStatus}`)
        console.log(response.data.result.data)
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
  }, [selectedOrderStatus])

  useEffect(() => {
    const filtered = orderList.filter(
      (order) => selectedOrderStatus === 0 || order.orderStatus === selectedOrderStatus,
    )
    setFilteredOrders(filtered)
    setCurrentPage(1) // 상태 변경 시 첫 페이지로 이동
  }, [selectedOrderStatus, orderList])

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage) // 전체 페이지 개수

  const handleSubmit = async (orderNo) => {
    try {
      const response = await API.post(`/delivery/${orderNo}`)
      console.log(response)
    } catch (err) {}
  }

  // 페이지 이동 핸들러
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  return (
    <div className='w-full mx-auto px-8 py-10 min-h-screen bg-warmBeige/20'>
      {/* 헤더 */}
      <header className='text-center mb-12'>
        <h1 className='text-4xl font-extrabold text-espressoBlack'>주문 관리</h1>
        <p className='text-lg text-coffeeBrown mt-3'>주문부터 배송까지 쉽게 관리하세요.</p>
      </header>

      {/* 주문 상태 필터 */}
      <div className='flex gap-4 justify-center mb-6'>
        {Object.entries(ORDER_STATUS_MAP).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setSelectedOrderStatus(Number(key))}
            className={`px-4 py-2 rounded-lg text-md font-medium transition-all shadow-md ${
              selectedOrderStatus === Number(key)
                ? 'bg-espressoBlack text-warmBeige'
                : 'bg-latteBeige text-coffeeBrown hover:bg-coffeeBrown hover:text-warmBeige'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* 주문 목록 테이블 */}
      <div className='bg-white p-6 shadow-lg rounded-xl'>
        <table className='w-full border border-gray-300 text-md'>
          <thead className='bg-espressoBlack text-warmBeige'>
            <tr>
              <th className='py-3 px-4'>주문번호</th>
              <th className='py-3 px-4'>구매자</th>
              <th className='py-3 px-4'>전화번호</th>
              <th className='py-3 px-4'>주소</th>
              <th className='py-3 px-4'>상세주소</th>
              <th className='py-3 px-4'>주문량</th>

              <th className='py-3 px-4'>배송상태</th>
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
                  <td className='py-3 px-4'>{order.userInfo.userName}</td>
                  <td className='py-3 px-4'>{order.userInfo.userPhoneNumber}</td>
                  <td className='py-3 px-4'>{order.userInfo.address.address}</td>
                  <td className='py-3 px-4'>{order.userInfo.address.addressDetail}</td>
                  <td className='py-3 px-4 text-green-500 font-semibold'>{}</td>

                  <td className='py-3 px-4'>
                    <button
                      onClick={() => handleSubmit(order.orderNo)}
                      className='bg-espressoBlack text-warmBeige px-3 py-1 rounded-lg shadow-md hover:bg-coffeeBrown'
                    >
                      저장
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* 페이지네이션 */}
      <div className='flex justify-center items-center gap-2 mt-6'>
        <button onClick={() => handlePageChange(1)} disabled={currentPage === 1}>
          <FaAngleDoubleLeft />
        </button>
        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
          <FaAngleLeft />
        </button>

        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className={`${currentPage === index + 1 ? 'font-bold' : ''}`}
          >
            {index + 1}
          </button>
        ))}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <FaAngleRight />
        </button>
        <button onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages}>
          <FaAngleDoubleRight />
        </button>
      </div>

      {popupOrderNo && <OrderPopup orderNo={popupOrderNo} onClose={() => setPopupOrderNo(null)} />}
    </div>
  )
}

export default Orders
