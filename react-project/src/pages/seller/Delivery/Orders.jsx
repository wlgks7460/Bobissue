import React, { useState, useEffect } from 'react'
import { FaAngleDoubleLeft, FaAngleLeft, FaAngleRight, FaAngleDoubleRight } from 'react-icons/fa'
import OrderPopup from './Popup/OrderPopup'
import API from '../../../utils/API'

const Orders = () => {
  const [orderList, setOrderList] = useState([])
  const [filteredOrders, setFilteredOrders] = useState([])
  const [selectedTab, setSelectedTab] = useState('all')
  const [popupData, setPopupData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isOpenPopup, setIsOpenPopup] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
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
    const filtered =
      selectedTab === 'all' ? orderList : orderList.filter((order) => order.status === selectedTab)
    setFilteredOrders(filtered)
  }, [selectedTab, orderList])

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage)
  const startPage = Math.floor((currentPage - 1) / pagesPerGroup) * pagesPerGroup + 1
  const endPage = Math.min(startPage + pagesPerGroup - 1, totalPages)

  const displayedOrders = filteredOrders.slice(
    (currentPage - 1) * ordersPerPage,
    currentPage * ordersPerPage,
  )

  return (
    <div className='min-h-screen flex flex-col bg-white py-10 px-5 sm:px-10'>
      <div className='flex-grow max-w-7xl mx-auto'>
        <div className='text-center mb-8'>
          <h1 className='text-4xl font-bold text-gray-900'>주문 관리</h1>
          <p className='mt-2 text-lg text-gray-700'>주문 현황을 한눈에 확인하고 관리하세요.</p>
        </div>

        <div className='flex justify-center gap-3 mb-6'>
          {['all', 'orderComplete', 'orderConfirm', 'refundRequest', 'refundComplete'].map(
            (status) => (
              <button
                key={status}
                onClick={() => setSelectedTab(status)}
                className={`px-5 py-2 rounded-md text-lg font-medium transition duration-300 ${
                  selectedTab === status
                    ? 'bg-gray-500 text-white shadow-md'
                    : 'bg-white text-gray-500 border border-gray-300 hover:bg-gray-400 hover:text-white'
                }`}
              >
                {status === 'all' ? '전체' : status}
              </button>
            ),
          )}
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
          {displayedOrders.length === 0 ? (
            <div className='col-span-3 text-center text-gray-500 text-lg'>
              해당 분류의 주문이 없습니다.
            </div>
          ) : (
            displayedOrders.map((order) => (
              <div
                key={order.orderId}
                className='bg-white p-5 rounded-lg shadow border border-gray-300 hover:scale-105 transition duration-200 cursor-pointer'
                onClick={() => setPopupData(order)}
              >
                <h3 className='text-lg font-semibold text-gray-900'>{order.orderId}</h3>
                <p className='text-gray-700 mt-1 font-medium'>
                  상품명: {order.productName || '상품 정보 없음'}
                </p>
                <div className='mt-3 text-sm text-gray-600'>
                  옵션: {order.option} / 수량: {order.quantity}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {totalPages > 1 && (
        <div className='flex justify-center mt-auto py-6'>
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className='mx-1 px-3 py-2 rounded-md bg-white text-gray-700 border border-gray-300 hover:bg-gray-500 hover:text-white'
          >
            <FaAngleDoubleLeft />
          </button>
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className='mx-1 px-3 py-2 rounded-md bg-white text-gray-700 border border-gray-300 hover:bg-gray-500 hover:text-white'
          >
            <FaAngleLeft />
          </button>
          {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`mx-1 px-4 py-2 rounded-md text-lg font-medium transition ${
                currentPage === page
                  ? 'bg-gray-500 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-400 hover:text-white'
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className='mx-1 px-3 py-2 rounded-md bg-white text-gray-700 border border-gray-300 hover:bg-gray-500 hover:text-white'
          >
            <FaAngleRight />
          </button>
          <button
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            className='mx-1 px-3 py-2 rounded-md bg-white text-gray-700 border border-gray-300 hover:bg-gray-500 hover:text-white'
          >
            <FaAngleDoubleRight />
          </button>
        </div>
      )}
      {isOpenPopup && <OrderPopup order={popupData} onClose={() => setIsOpenPopup(false)} />}
    </div>
  )
}

export default Orders
