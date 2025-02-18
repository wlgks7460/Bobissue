import React, { useState, useEffect } from 'react'
import { FaAngleDoubleLeft, FaAngleLeft, FaAngleRight, FaAngleDoubleRight } from 'react-icons/fa'
import OrderPopup from './Popup/OrderPopup'
import API from '../../../utils/API'

const Orders = () => {
  const [orderList, setOrderList] = useState([])
  const [filteredOrders, setFilteredOrders] = useState([])
  const [selectedOrderStatus, setSelectedOrderStatus] = useState('all')
  const [popupOrderNo, setPopupOrderNo] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [trackingInfo, setTrackingInfo] = useState({})

  const ordersPerPage = 10
  const pagesPerGroup = 5 // 한 번에 표시할 페이지 버튼 수

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true)
      try {
        const response = await API.get('/orders')
        console.log(response)
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

  const handleTrackingChange = (orderNo, field, value) => {
    setTrackingInfo((prev) => ({
      ...prev,
      [orderNo]: { ...prev[orderNo], [field]: value },
    }))
  }

  const handleSaveTrackingNumber = async (orderNo) => {
    try {
      const { trackingNumber, deliveryCompany } = trackingInfo[orderNo] || {}
      if (!trackingNumber || !deliveryCompany) {
        alert('송장번호와 택배사를 입력해주세요.')
        return
      }

      await API.post(`/orders/${orderNo}/tracking`, {
        trackingNumber,
        deliveryCompany,
      })
      alert('송장번호와 택배사가 저장되었습니다.')
    } catch (error) {
      alert('송장번호 저장에 실패했습니다.')
    }
  }

  // 페이지네이션 관련 계산
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage)
  const startIndex = (currentPage - 1) * ordersPerPage
  const displayedOrders = filteredOrders.slice(startIndex, startIndex + ordersPerPage)

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  return (
    <div className='min-h-screen flex flex-col bg-cream/20 py-10 px-5 sm:px-10'>
      <div className='flex-grow mx-auto'>
        <h1 className='text-4xl font-bold text-center mb-4 text-gray-800'>주문 관리</h1>
        <div className='flex gap-4 mb-4'>
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

        <div className='bg-white p-4 shadow-lg rounded-lg'>
          <table className='w-full border border-gray-300 text-sm'>
            <thead className='bg-lightYellow-300 text-gray-900'>
              <tr>
                <th>주문번호</th>
                <th>결제 방식</th>
                <th>주문 상태</th>
                <th>주문 일자</th>
                <th>총 금액</th>
                <th>송장번호</th>
                <th>택배사</th>
                <th>관리</th>
              </tr>
            </thead>
            <tbody>
              {displayedOrders.map((order) => (
                <tr key={order.orderNo} className='hover:bg-gray-100'>
                  <td
                    className='cursor-pointer text-blue-600 hover:underline'
                    onClick={() => setPopupOrderNo(order.orderNo)}
                  >
                    {order.orderNo}
                  </td>
                  <td>{order.payment}</td>
                  <td>{order.orderStatus}</td>
                  <td>{order.createdAt}</td>
                  <td>{order.totalPrice.toLocaleString()} 원</td>
                  <td>
                    {order.orderStatus === '결제 완료' ? (
                      <input
                        type='text'
                        value={trackingInfo[order.orderNo]?.trackingNumber || ''}
                        onChange={(e) =>
                          handleTrackingChange(order.orderNo, 'trackingNumber', e.target.value)
                        }
                        className='border px-2 py-1 w-24'
                        placeholder='송장번호'
                      />
                    ) : (
                      order.trackingNumber || '-'
                    )}
                  </td>
                  <td>
                    {order.orderStatus === '결제 완료' ? (
                      <input
                        type='text'
                        value={trackingInfo[order.orderNo]?.deliveryCompany || ''}
                        onChange={(e) =>
                          handleTrackingChange(order.orderNo, 'deliveryCompany', e.target.value)
                        }
                        className='border px-2 py-1 w-24'
                        placeholder='택배사'
                      />
                    ) : (
                      order.deliveryCompany || '-'
                    )}
                  </td>
                  <td>
                    {order.orderStatus === '결제 완료' && (
                      <button
                        onClick={() => handleSaveTrackingNumber(order.orderNo)}
                        className='bg-green-400 text-white px-2 py-1 rounded-md text-xs shadow-md hover:bg-green-500'
                      >
                        저장
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 페이지네이션 UI */}
        {totalPages > 1 && (
          <div className='flex justify-center items-center mt-6 gap-2'>
            <button
              className='px-2 py-1 border rounded-md hover:bg-gray-200'
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
            >
              <FaAngleDoubleLeft />
            </button>
            <button
              className='px-2 py-1 border rounded-md hover:bg-gray-200'
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <FaAngleLeft />
            </button>
            <span className='px-3 py-1 border rounded-md bg-gray-100'>
              {currentPage} / {totalPages}
            </span>
            <button
              className='px-2 py-1 border rounded-md hover:bg-gray-200'
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <FaAngleRight />
            </button>
            <button
              className='px-2 py-1 border rounded-md hover:bg-gray-200'
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
            >
              <FaAngleDoubleRight />
            </button>
          </div>
        )}

        {popupOrderNo && (
          <OrderPopup orderNo={popupOrderNo} onClose={() => setPopupOrderNo(null)} />
        )}
      </div>
    </div>
  )
}

export default Orders
