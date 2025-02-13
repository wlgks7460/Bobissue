import React, { useState, useEffect } from 'react'
import OrderPopup from './Popup/OrderPopup'
import API from '../../../utils/API'

const Orders = () => {
  const debugMode = localStorage.getItem('debug_mode') === 'true'

  const [orderList, setOrderList] = useState([])
  const [allProducts, setAllProducts] = useState([])
  const [filteredOrders, setFilteredOrders] = useState([])
  const [selectedTab, setSelectedTab] = useState('all') // 기본값 '전체'
  const [popupData, setPopupData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const dummyOrders = [
    { orderId: '10001', productId: 2, option: '블랙', quantity: 1, status: 'orderComplete' },
    { orderId: '10002', productId: 52, option: '청축', quantity: 1, status: 'orderConfirm' },
    { orderId: '10003', productId: 53, option: '알루미늄', quantity: 2, status: 'orderComplete' },
    { orderId: '10004', productId: 102, option: '화이트', quantity: 1, status: 'refundRequest' },
    { orderId: '10005', productId: 152, option: 'LED', quantity: 1, status: 'refundComplete' },
  ]

  const dummyProducts = [
    { itemNo: 2, name: '무선 충전기' },
    { itemNo: 52, name: '게이밍 키보드' },
    { itemNo: 53, name: '노트북 거치대' },
    { itemNo: 102, name: '무선 마우스' },
    { itemNo: 152, name: '스탠드 조명' },
  ]

  useEffect(() => {
    if (debugMode) {
      console.log('📢 [디버그 모드] 더미 데이터 사용 중...')
      setOrderList(dummyOrders)
      setAllProducts(dummyProducts)
      return
    }

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
        console.error('API 요청 실패:', err)
        setError('주문 목록을 불러오는 중 오류가 발생했습니다.')
      } finally {
        setIsLoading(false)
      }
    }

    const fetchProducts = async () => {
      try {
        const response = await API.get('/products')
        if (response.data.status === 'OK') {
          setAllProducts(response.data.result.data)
        } else {
          throw new Error(response.data.message.label)
        }
      } catch (err) {
        console.error('상품 데이터 가져오기 실패:', err)
        setError('상품 정보를 불러오는 중 오류가 발생했습니다.')
      }
    }

    fetchOrders()
    fetchProducts()
  }, [])

  useEffect(() => {
    if (selectedTab === 'all') {
      setFilteredOrders(orderList)
    } else if (selectedTab === 'orderCancel') {
      setFilteredOrders(
        orderList.filter(
          (order) => order.status === 'refundRequest' || order.status === 'refundComplete',
        ),
      )
    } else {
      setFilteredOrders(orderList.filter((order) => order.status === selectedTab))
    }
  }, [selectedTab, orderList])

  const handleOpenPopup = async (order) => {
    if (debugMode) {
      setPopupData(order)
    } else {
      try {
        setIsLoading(true)
        const response = await API.get(`/orders/${order.orderId}`)
        if (response.data.status === 'OK') {
          setPopupData(response.data.result)
        } else {
          throw new Error(response.data.message.label)
        }
      } catch (err) {
        console.error('주문 상세 정보 가져오기 실패:', err)
        setError('주문 상세 정보를 불러오는 중 오류가 발생했습니다.')
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleClosePopup = () => {
    setPopupData(null)
  }

  return (
    <div className='p-6 w-full bg-gray-50 min-h-screen'>
      <h1 className='text-2xl text-center font-bold text-gray-800 mb-6'>주문 관리</h1>

      {isLoading ? (
        <p className='text-gray-500 text-lg'>로딩 중...</p>
      ) : error ? (
        <p className='text-red-500 text-lg'>{error}</p>
      ) : (
        <>
          <div className='flex space-x-4 justify-center text-lg font-medium my-6'>
            {[
              { key: 'all', label: '전체' },
              { key: 'orderComplete', label: '주문완료' },
              { key: 'orderConfirm', label: '주문확정' },
              { key: 'orderCancel', label: '주문취소' },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setSelectedTab(key)}
                className={`px-4 py-2 rounded-lg transition ${selectedTab === key ? 'bg-blue-600 text-white' : 'bg-gray-300 hover:bg-gray-400'}`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className='border border-gray-300 rounded-xl bg-white'>
            <table className='w-full text-left border-collapse'>
              <thead className='bg-gray-100 text-gray-700'>
                <tr>
                  <th className='p-4 border-b'>주문 번호</th>
                  <th className='p-4 border-b'>상품명</th>
                  <th className='p-4 border-b'>옵션 / 수량</th>
                  <th className='p-4 border-b'>주문 상태</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => {
                  const product = allProducts.find((p) => p.itemNo === order.productId)
                  return (
                    <tr key={order.orderId} className='border-b hover:bg-gray-100 transition'>
                      <td className='p-4'>{order.orderId}</td>
                      <td
                        className='p-4 text-blue-600 hover:underline cursor-pointer'
                        onClick={() => handleOpenPopup(order)}
                      >
                        {product ? product.name : '상품 정보 없음'}
                      </td>
                      <td className='p-4'>
                        {order.option} / {order.quantity}
                      </td>
                      <td className='p-4'>{order.status}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {popupData && (
        <div className='fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50'>
          <div className='bg-white p-6 rounded-lg shadow-lg w-[300px]'>
            <h2 className='text-xl font-bold mb-4'>주문 상세 정보</h2>
            <p className='text-gray-700'>주문 번호: {popupData.orderId}</p>
            <p className='text-gray-700'>옵션: {popupData.option}</p>
            <p className='text-gray-700'>수량: {popupData.quantity}</p>
            <button
              onClick={handleClosePopup}
              className='mt-4 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-800'
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Orders
