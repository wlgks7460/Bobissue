import React, { useState, useEffect } from 'react'
import OrderPopup from './Popup/OrderPopup'
import API from '../../../utils/API'

const Orders = () => {
  const debug_mode = localStorage.getItem('debug_mode') === 'true'

  const [orderList, setOrderList] = useState([])
  const [allProducts, setAllProducts] = useState([])
  const [filteredOrders, setFilteredOrders] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [popupData, setPopupData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  // 더미 주문 데이터
  const dummyOrders = [
    { orderId: '10001', productId: 2, option: '블랙', quantity: 1, status: 'PayOk' },
    { orderId: '10002', productId: 52, option: '청축', quantity: 1, status: 'DeliverIn' },
    { orderId: '10003', productId: 53, option: '알루미늄', quantity: 2, status: 'DeliverOk' },
    { orderId: '10004', productId: 102, option: '화이트', quantity: 1, status: 'PayOk' },
    { orderId: '10005', productId: 152, option: 'LED', quantity: 1, status: 'refund' },
  ]

  // 더미 상품 데이터
  const dummyProducts = [
    {
      itemNo: 2,
      name: '무선 충전기',
      category: { categoryNo: 3, name: '카테고리3', parentName: '카테고리1' },
    },
    {
      itemNo: 52,
      name: '게이밍 키보드',
      category: { categoryNo: 1, name: '카테고리1', parentName: null },
    },
    {
      itemNo: 53,
      name: '노트북 거치대',
      category: { categoryNo: 1, name: '카테고리1', parentName: null },
    },
    {
      itemNo: 102,
      name: '무선 마우스',
      category: { categoryNo: 1, name: '카테고리1', parentName: null },
    },
    {
      itemNo: 152,
      name: '스탠드 조명',
      category: { categoryNo: 3, name: '카테고리3', parentName: '카테고리1' },
    },
  ]

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true)
      if (debug_mode) {
        console.log('📢 [디버그 모드] 더미 데이터 사용 중...')
        setOrderList(dummyOrders)
        setIsLoading(false)
        return
      }
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
      if (debugMode) {
        setAllProducts(dummyProducts)
        return
      }
      try {
        const response = await API.get('/items')
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
    if (selectedCategory) {
      const filtered = orderList.filter((order) =>
        allProducts.some(
          (product) =>
            product.itemNo === order.productId && product.category.categoryNo === selectedCategory,
        ),
      )
      setFilteredOrders(filtered)
    } else {
      setFilteredOrders(orderList)
    }
  }, [selectedCategory, orderList, allProducts])

  const handleOpenPopup = (order) => {
    if (order.status === 'PayOk') {
      setPopupData(order)
    }
  }

  const handleClosePopup = () => {
    setPopupData(null)
  }

  return (
    <div className='p-6 w-full bg-gradient-to-b from-gray-100 to-gray-50 min-h-screen'>
      <h1 className='text-[28px] text-center font-bold text-gray-800 mb-6'>주문 관리</h1>

      {isLoading ? (
        <p className='text-gray-500 text-lg'>로딩 중...</p>
      ) : error ? (
        <p className='text-red-500 text-lg'>{error}</p>
      ) : (
        <>
          <div className='mb-4'>
            <label className='mr-2 text-gray-700'>카테고리 필터:</label>
            <select
              onChange={(e) => setSelectedCategory(e.target.value ? Number(e.target.value) : null)}
              className='border px-3 py-2 rounded-md'
            >
              <option value=''>전체</option>
              {[...new Set(allProducts.map((product) => product.category.categoryNo))].map(
                (categoryNo) => {
                  const category = allProducts.find(
                    (product) => product.category.categoryNo === categoryNo,
                  )?.category
                  return (
                    <option key={categoryNo} value={categoryNo}>
                      {category?.parentName ? `${category.parentName} > ` : ''}
                      {category?.name}
                    </option>
                  )
                },
              )}
            </select>
          </div>

          <div className='overflow-hidden border border-gray-300 rounded-xl bg-white'>
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
                  const product = allProducts.find((product) => product.itemNo === order.productId)
                  return (
                    <tr key={order.orderId} className='border-b hover:bg-gray-100 transition'>
                      <td className='p-4'>
                        {order.status === 'PayOk' ? (
                          <button
                            onClick={() => handleOpenPopup(order)}
                            className='text-blue-600 hover:text-blue-800 font-medium transition'
                          >
                            {order.orderId}
                          </button>
                        ) : (
                          <span className='text-gray-600'>{order.orderId}</span>
                        )}
                      </td>
                      <td className='p-4 text-gray-800'>{product?.name || '상품 정보 없음'}</td>
                      <td className='p-4 text-gray-700'>
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

      {popupData && <OrderPopup order={popupData} onClose={handleClosePopup} />}
    </div>
  )
}

export default Orders
