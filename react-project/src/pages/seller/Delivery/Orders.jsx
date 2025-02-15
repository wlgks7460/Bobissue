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
    <div className='min-h-screen bg-gradient-to-r bg-blue-100 py-10 px-5 sm:px-10'>
      <div className='max-w-7xl mx-auto'>
        {/* 헤더 */}
        <div className='text-center mb-8'>
          <h1 className='text-5xl font-extrabold text-gray-900'>주문 관리</h1>
          <p className='mt-2 text-xl text-gray-600'>모든 주문을 한 곳에서 관리하세요.</p>
        </div>

        {/* 탭 UI */}
        <div className='flex justify-center mb-8'>
          {[
            { key: 'all', label: '전체' },
            { key: 'orderComplete', label: '주문 완료' },
            { key: 'orderConfirm', label: '주문 확인' },
            { key: 'refundRequest', label: '환불 요청' },
            { key: 'refundComplete', label: '환불 완료' },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setSelectedTab(key)}
              className={`px-5 py-1 mx-2 rounded-full text-xl font-semibold transition-all duration-300 transform ${
                selectedTab === key
                  ? 'bg-gray-600 text-white shadow-lg scale-105'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-500 hover:text-white'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* 주문 카드 UI */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
          {filteredOrders.length === 0 ? (
            <div className='col-span-3 text-center text-gray-500'>해당 분류의 주문이 없습니다.</div>
          ) : (
            filteredOrders.map((order) => (
              <div
                key={order.orderId}
                className='bg-white px-4 py-6 rounded-[18px] border-2 border-gray-400 hover:scale-95 transition-all duration-200'
                onClick={() => handleOrderClick(order.orderId)}
              >
                <h3 className='text-xl font-semibold text-gray-800'>{order.orderId}</h3>
                <p className='text-gray-600 mt-2'>
                  상품명:{' '}
                  {allProducts.find((p) => p.itemNo === order.productId)?.name || '상품 정보 없음'}
                </p>
                <div className='mt-4'>
                  <span className='text-sm text-gray-500'>옵션:</span> {order.option} /{' '}
                  {order.quantity}
                </div>
                <div className='mt-2'>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      order.status === 'orderComplete'
                        ? 'bg-green-200 text-green-700'
                        : order.status === 'orderConfirm'
                          ? 'bg-yellow-200 text-yellow-700'
                          : order.status === 'refundRequest'
                            ? 'bg-red-200 text-red-700'
                            : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 상품 상세 정보 팝업 */}
      {isOpenPopup && <OrderPopup order={popupData} onClose={() => setIsOpenPopup(false)} />}
    </div>
  )
}

export default Orders
