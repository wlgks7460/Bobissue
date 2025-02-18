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
  const [trackingNumbers, setTrackingNumbers] = useState({})
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
      selectedTab === 'all'
        ? orderList
        : orderList.filter((order) => order.orderStatus === selectedTab)

    setFilteredOrders(filtered)
  }, [selectedTab, orderList])

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage)
  const startPage = Math.floor((currentPage - 1) / pagesPerGroup) * pagesPerGroup + 1
  const endPage = Math.min(startPage + pagesPerGroup - 1, totalPages)

  const displayedOrders = filteredOrders.slice(
    (currentPage - 1) * ordersPerPage,
    currentPage * ordersPerPage,
  )

  // 송장번호 입력 핸들러
  const handleTrackingNumberChange = (orderNo, value) => {
    setTrackingNumbers((prev) => ({
      ...prev,
      [orderNo]: value,
    }))
  }

  // 송장번호 저장 API 요청
  const handleTrackingNumberSubmit = async (orderNo) => {
    const trackingNumber = trackingNumbers[orderNo]
    if (!trackingNumber) {
      alert('송장번호를 입력해주세요.')
      return
    }

    try {
      const response = await API.post('/orders/tracking', {
        orderNo,
        trackingNumber,
      })

      if (response.data.status === 'OK') {
        alert('송장번호가 저장되었습니다.')

        // 데이터 갱신 (레디스에서 다시 불러오기)
        const updatedOrders = orderList.map((order) =>
          order.orderNo === orderNo ? { ...order, trackingNumber } : order,
        )
        setOrderList(updatedOrders)
      } else {
        throw new Error(response.data.message.label)
      }
    } catch (err) {
      alert('송장번호 저장 중 오류가 발생했습니다.')
    }
  }

  return (
    <div className='min-h-screen flex flex-col bg-warmBeige/20 py-10 px-5 sm:px-10'>
      <div className='flex-grow mx-auto'>
        <div className='text-center mb-8'>
          <h1 className='text-4xl font-bold text-espressoBlack'>주문 관리</h1>
          <p className='mt-2 text-lg text-hazelnutBrown'>주문 현황을 한눈에 확인하고 관리하세요.</p>
        </div>

        {/* 필터 버튼 */}
        <div className='flex justify-center gap-3 mb-6'>
          {['all', '결제 완료', '주문 확인중', '주문 완료'].map((status) => (
            <button
              key={status}
              onClick={() => setSelectedTab(status)}
              className={`px-5 py-2 rounded-md text-lg font-medium transition duration-300 ${
                selectedTab === status
                  ? 'bg-caramelTan/60 text-white shadow-md border border-white'
                  : 'bg-latteBeige text-espressoBlack border border-caramelTan hover:bg-white hover:text-caramelTan'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* 주문 목록 테이블 */}
        <div className='bg-latteBeige/40 rounded-lg w-full shadow-md border border-caramelTan p-6'>
          <h2 className='text-xl text-center font-semibold text-espressoBlack mb-4'>주문 목록</h2>

          <div className='w-full'>
            <table className='w-full bg-white border border-roastedCocoa table-fixed'>
              {/* 테이블 헤더 */}
              <thead className='bg-coffeeBrown text-white'>
                <tr>
                  <th className='py-3 px-4 w-1/6 text-left whitespace-nowrap'>주문번호</th>
                  <th className='py-3 px-4 w-1/4 text-left whitespace-nowrap'>결제 방식</th>
                  <th className='py-3 px-4 w-1/4 text-left whitespace-nowrap'>주문 상태</th>
                  <th className='py-3 px-4 w-1/6 text-left whitespace-nowrap'>배송 상태</th>
                  <th className='py-3 px-4 w-1/6 text-left whitespace-nowrap'>주문 일자</th>
                  <th className='py-3 px-4 w-1/5 text-left whitespace-nowrap'>총 금액</th>
                  <th className='py-3 px-4 w-1/5 text-left whitespace-nowrap'>운송장번호</th>
                </tr>
              </thead>

              {/* 테이블 본문 */}
              <tbody className='divide-y divide-roastedCocoa'>
                {displayedOrders.length === 0 ? (
                  <tr>
                    <td colSpan='7' className='py-4 text-center text-hazelnutBrown text-lg'>
                      해당 분류의 주문이 없습니다.
                    </td>
                  </tr>
                ) : (
                  displayedOrders.map((order) => (
                    <tr
                      key={order.orderNo}
                      className='hover:bg-warmBeige transition cursor-pointer'
                    >
                      <td className='py-3 px-4 text-blue-600 underline cursor-pointer'>
                        {order.orderNo}
                      </td>
                      <td className='py-3 px-4'>{order.payment}</td>
                      <td className='py-3 px-4'>{order.orderStatus}</td>
                      <td className='py-3 px-4'>{order.deliveryStatus}</td>
                      <td className='py-3 px-4'>{order.createdAt}</td>
                      <td className='py-3 px-4'>{order.totalPrice.toLocaleString()} 원</td>
                      <td className='py-3 px-4'>
                        {order.orderStatus === '결제 완료' ? (
                          <>
                            <input
                              type='text'
                              value={trackingNumbers[order.orderNo] || ''}
                              onChange={(e) =>
                                handleTrackingNumberChange(order.orderNo, e.target.value)
                              }
                              className='border p-1 mr-2'
                            />
                            <button onClick={() => handleTrackingNumberSubmit(order.orderNo)}>
                              등록
                            </button>
                          </>
                        ) : (
                          order.trackingNumber || '미등록'
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Orders
