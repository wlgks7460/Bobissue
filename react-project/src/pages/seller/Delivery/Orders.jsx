import React, { useState, useEffect } from 'react'
import { FaList, FaCheckCircle, FaClipboardCheck, FaTimesCircle } from 'react-icons/fa'
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
  const [isOpenPopup, setIsOpenPopup] = useState(false)

  const dummyOrders = [
    {
      orderId: '10001',
      productId: 2,
      option: '블랙',
      quantity: 1,
      status: 'orderComplete',
      price: 15000,
    },
    {
      orderId: '10002',
      productId: 52,
      option: '청축',
      quantity: 1,
      status: 'orderConfirm',
      price: 120000,
    },
    {
      orderId: '10003',
      productId: 53,
      option: '알루미늄',
      quantity: 2,
      status: 'orderComplete',
      price: 80000,
    },
    {
      orderId: '10004',
      productId: 102,
      option: '화이트',
      quantity: 1,
      status: 'refundRequest',
      price: 45000,
    },
    {
      orderId: '10005',
      productId: 152,
      option: 'LED',
      quantity: 1,
      status: 'refundComplete',
      price: 30000,
    },
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

  const handleOrderClick = async (orderId) => {
    if (debugMode) {
      const order = dummyOrders.find((order) => order.orderId === orderId)
      if (order) {
        const product = dummyProducts.find((p) => p.itemNo === order.productId)
        setPopupData({ ...order, productName: product ? product.name : '상품 정보 없음' })
        setIsOpenPopup(true)
      }
    } else {
      try {
        setIsLoading(true)
        const response = await API.get(`/orders/${orderId}`)
        if (response.data.status === 'OK') {
          setPopupData(response.data.result)
          setIsOpenPopup(true)
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

  return (
    <div className='p-6 w-full bg-gray-50 min-h-screen'>
      <h1 className='text-2xl text-center font-bold text-gray-800 mb-6'>주문 관리</h1>
      {isOpenPopup && <OrderPopup order={popupData} onClose={() => setIsOpenPopup(false)} />}
      {isLoading ? (
        <p className='text-gray-500 text-lg'>로딩 중...</p>
      ) : error ? (
        <p className='text-red-500 text-lg'>{error}</p>
      ) : (
        <>
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
                {filteredOrders.map((order) => (
                  <tr key={order.orderId} className='border-b hover:bg-gray-100 transition'>
                    <td
                      className='p-4 cursor-pointer text-blue-600 hover:underline'
                      onClick={() => handleOrderClick(order.orderId)}
                    >
                      {order.orderId}
                    </td>
                    <td className='p-4'>
                      {allProducts.find((p) => p.itemNo === order.productId)?.name ||
                        '상품 정보 없음'}
                    </td>
                    <td className='p-4'>
                      {order.option} / {order.quantity}
                    </td>
                    <td className='p-4'>{order.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}

export default Orders
