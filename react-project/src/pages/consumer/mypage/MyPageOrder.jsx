import React, { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import API from '../../../utils/API'
import MyPageOrderItem from '../../../components/consumer/mypage/MyPageOrderItem'

const MyPageOrder = () => {
  const [orders, setOrders] = useState([]) // 전체 주문 목록
  const [filteredOrders, setFilteredOrders] = useState([]) // 필터된 주문 목록
  const [filter, setFilter] = useState('1개월') // 필터
  const filteres = [
    // 필터 목록
    { filterNo: 0, value: '1개월' },
    { filterNo: 1, value: '3개월' },
    { filterNo: 2, value: '6개월' },
    { filterNo: 3, value: '1년' },
    { filterNo: 4, value: '3년' },
  ]
  /** 필터 변경 함수 */
  const handleFilter = (value) => {
    setFilter(value)
    setFilteredOrders(filterOrdersByDate(orders, value))
  }

  /** 날짜에 맞게 필터링 함수 */
  const filterOrdersByDate = (orders, period) => {
    const now = dayjs()
    let cutoffDate

    switch (period) {
      case '1개월':
        cutoffDate = now.subtract(1, 'month')
        break
      case '3개월':
        cutoffDate = now.subtract(3, 'month')
        break
      case '6개월':
        cutoffDate = now.subtract(6, 'month')
        break
      case '1년':
        cutoffDate = now.subtract(1, 'year')
        break
      case '3년':
        cutoffDate = now.subtract(3, 'year')
        break
      default:
        return orders
    }

    return orders.filter((order) => {
      const orderDate = dayjs(order.createAt, 'YYYYMMDD HHmmss')
      return orderDate.isAfter(cutoffDate)
    })
  }

  useEffect(() => {
    const res = [
      {
        orderNo: 1,
        payment_method: 'Credit Card',
        totalPrice: 45000,
        request: '문 앞에 두고 가주세요.',
        createAt: '20250206 101530',
        orderDetail: [
          { orderDetailNo: 1, itemNo: 101, quantity: 2, price: 15000 },
          { orderDetailNo: 2, itemNo: 102, quantity: 1, price: 15000 },
        ],
      },
      {
        orderNo: 2,
        payment_method: 'PayPal',
        totalPrice: 78000,
        request: '연락 후 배달 부탁드립니다.',
        createAt: '20241106 112045',
        orderDetail: [{ orderDetailNo: 3, itemNo: 103, quantity: 3, price: 26000 }],
      },
      {
        orderNo: 3,
        payment_method: 'Bank Transfer',
        totalPrice: 62000,
        request: '포장 단단히 부탁드립니다.',
        createAt: '20240806 121015',
        orderDetail: [{ orderDetailNo: 4, itemNo: 104, quantity: 2, price: 31000 }],
      },
      {
        orderNd: 4,
        payment_method: 'Cash on Delivery',
        totalPrice: 53000,
        request: '빠른 배송 부탁드립니다.',
        createAt: '20240206 134550',
        orderDetail: [{ orderDetailNo: 5, itemNo: 105, quantity: 1, price: 53000 }],
      },
      {
        orderNd: 5,
        payment_method: 'Credit Card',
        totalPrice: 91000,
        request: '배달 전에 문자 주세요.',
        createAt: '20220206 143025',
        orderDetail: [{ orderDetailNo: 6, itemNo: 106, quantity: 2, price: 45500 }],
      },
    ]
    setOrders(res)
    setFilteredOrders(filterOrdersByDate(res, filter))
  }, [])
  return (
    <div className='p-5'>
      <h2 className='text-center text-xl mb-5'>주문 내역</h2>
      {/* 주문 내역 필터 */}
      <div className='border-b-2 border-black flex justify-center gap-5'>
        {filteres.map((v) => (
          <button
            key={v.filterNo}
            className={`w-[100px] text-center ${filter === v.value ? 'bg-[#6F4E37] text-white' : 'bg-gray-300'} m-3 p-1 rounded-full`}
            onClick={() => handleFilter(v.value)}
          >
            {v.value}
          </button>
        ))}
      </div>
      {/* 주문 내역 목록 */}
      <div className='p-5 flex flex-col gap-3'>
        {filteredOrders.map((v) => (
          <MyPageOrderItem key={`order-${v.orderNo}`} orderItem={v} />
        ))}
      </div>
    </div>
  )
}

export default MyPageOrder
