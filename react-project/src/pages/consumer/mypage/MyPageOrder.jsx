import React, { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import API from '../../../utils/API'
import MyPageOrderItem from '../../../components/consumer/mypage/MyPageOrderItem'
import { ExclamationCircleIcon } from '@heroicons/react/24/outline'
import { useSelector } from 'react-redux'

const MyPageOrder = () => {
  const userNo = useSelector((state) => state.user.userInfo.userNo)

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

  // 주문 리스트 조회
  const getOrderData = () => {
    if (userNo && orders.length < 1) {
      API.get(`/users/${userNo}/orders`)
        .then((res) => {
          const result = res.data.result.data.filter((v) => v.orderStatus !== 4)
          setOrders(result)
          setFilteredOrders(filterOrdersByDate(result, filter))
        })
        .catch((err) => {
          console.error(err)
        })
    }
  }
  // 주문 삭제 함수
  const removeOrder = (orderNo) => {
    setFilteredOrders((prevOrders) => prevOrders.filter((order) => order.orderNo !== orderNo))
  }

  useEffect(() => {
    getOrderData()
  }, [userNo])
  return (
    <div className='p-5'>
      <h2 className='text-center text-xl mb-5'>주문 내역</h2>
      {/* 주문 내역 필터 */}
      <div className='border-b-2 border-[#6F4E37] flex justify-center gap-5 mb-10'>
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
      <div>
        {filteredOrders.length > 0 ? (
          <div className='p-5 flex flex-col gap-3'>
            {filteredOrders.map((v) => (
              <MyPageOrderItem
                key={`order-${v.orderNo}`}
                orderNo={v.orderNo}
                userNo={userNo}
                getOrderData={getOrderData}
                removeOrder={removeOrder}
              />
            ))}
          </div>
        ) : (
          <div className='flex flex-col gap-3 items-center'>
            <p className='text-center'>
              <ExclamationCircleIcon className='w-20 text-gray-400' />
            </p>
            <p className='text-center text-xl text-gray-600'>주문 내역이 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default MyPageOrder
