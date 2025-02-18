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
    <div className='min-h-screen flex flex-col bg-warmBeige/20 py-10 px-5 sm:px-10'>
      <div className='flex-grow max-w-7xl mx-auto'>
        <div className='text-center mb-8'>
          <h1 className='text-4xl font-bold text-espressoBlack'>주문 관리</h1>
          <p className='mt-2 text-lg text-hazelnutBrown'>주문 현황을 한눈에 확인하고 관리하세요.</p>
        </div>

        {/* 필터 버튼 */}
        <div className='flex justify-center gap-3 mb-6'>
          {['all', 'orderComplete', 'orderConfirm', 'refundRequest', 'refundComplete'].map(
            (status) => (
              <button
                key={status}
                onClick={() => setSelectedTab(status)}
                className={`px-5 py-2 rounded-md text-lg font-medium transition duration-300 ${
                  selectedTab === status
                    ? 'bg-mochaBrown text-white shadow-md'
                    : 'bg-latteBeige text-espressoBlack border border-caramelTan hover:bg-coffeeBrown hover:text-white'
                }`}
              >
                {status === 'all' ? '전체' : status}
              </button>
            ),
          )}
        </div>

        {/* 주문 목록 테이블 */}
        <div className='bg-latteBeige/40 rounded-lg min-h-screen shadow-md border border-caramelTan p-6'>
          <h2 className='text-xl text-center font-semibold text-espressoBlack mb-4'>주문 목록</h2>

          <div className='overflow-x-auto w-full'>
            <table className='w-full bg-white border border-roastedCocoa'>
              {/* 테이블 헤더 */}
              <thead className='bg-coffeeBrown text-white'>
                <tr>
                  <th className='py-3 px-4 text-left'>주문번호</th>
                  <th className='py-3 px-4 text-left'>상품명</th>
                  <th className='py-3 px-4 text-left'>상품정보</th>
                  <th className='py-3 px-4 text-left'>옵션/수량</th>
                  <th className='py-3 px-4 text-left'>주문상태</th>
                  <th className='py-3 px-4 text-left'>운송장번호</th>
                </tr>
              </thead>

              {/* 테이블 본문 */}
              <tbody className='divide-y divide-roastedCocoa min-h-screen'>
                {displayedOrders.length === 0 ? (
                  <tr>
                    <td colSpan='6' className='py-4 text-center text-hazelnutBrown text-lg'>
                      해당 분류의 주문이 없습니다.
                    </td>
                  </tr>
                ) : (
                  displayedOrders.map((order) => (
                    <tr
                      key={order.orderId}
                      className='hover:bg-warmBeige transition cursor-pointer'
                      onClick={() => setPopupData(order)}
                    >
                      <td className='py-3 px-4'>{order.orderId}</td>
                      <td className='py-3 px-4'>{order.productName || '상품 정보 없음'}</td>
                      <td className='py-3 px-4'>{order.productDetails || '상세 정보 없음'}</td>
                      <td className='py-3 px-4'>
                        옵션: {order.option} / 수량: {order.quantity}
                      </td>
                      <td className='py-3 px-4 text-center'>{order.status || '상태 없음'}</td>
                      <td className='py-3 px-4 text-center'>{order.trackingNumber || '미등록'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className='flex justify-center mt-auto py-6'>
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className='mx-1 px-3 py-2 rounded-md bg-latteBeige text-espressoBlack border border-caramelTan hover:bg-mochaBrown hover:text-white'
          >
            <FaAngleDoubleLeft />
          </button>
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className='mx-1 px-3 py-2 rounded-md bg-latteBeige text-espressoBlack border border-caramelTan hover:bg-mochaBrown hover:text-white'
          >
            <FaAngleLeft />
          </button>
          <button
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            className='mx-1 px-3 py-2 rounded-md bg-latteBeige text-espressoBlack border border-caramelTan hover:bg-mochaBrown hover:text-white'
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
