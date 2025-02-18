import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Breadcrumb from '../common/Breadcrumb'
import API from '../../../utils/API'

const OrderDetail = () => {
  const { orderNo } = useParams()
  const [order, setOrder] = useState(null)

  const breadcrumbPaths = [{ name: 'Home' }, { name: '주문 관리' }, { name: '주문 상세' }]

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        const response = await API.get(`/orders/${orderNo}`)
        if (response.data.status === 'OK') {
          setOrder(response.data.result.data)
        }
      } catch (error) {
        console.error('주문 상세 정보를 가져오는 중 오류 발생:', error)
      }
    }

    fetchOrderDetail()
  }, [orderNo])

  if (!order) {
    return <div className='p-6 text-center text-primary'>로딩 중...</div>
  }

  return (
    <div className='p-6'>
      <Breadcrumb paths={breadcrumbPaths} />
      <h1 className='text-3xl font-extrabold mb-6 text-[#3E2723]'>주문 상세페이지</h1>

      <div className='mb-6 bg-white shadow-lg rounded-xl p-6 border border-[#6D4C41]'>
        <h2 className='text-2xl font-semibold mb-4 text-[#4E342E]'>주문 정보</h2>
        <ul className='space-y-3 text-[#3E2723]'>
          <li>
            <strong>주문 번호:</strong> {order.orderNo}
          </li>
          <li>
            <strong>사용자 번호:</strong> {order.userNo}
          </li>
          <li>
            <strong>주소 번호:</strong> {order.addressNo}
          </li>
          <li>
            <strong>결제 방식:</strong> {order.payment}
          </li>
          <li>
            <strong>총 가격:</strong> {order.totalPrice.toLocaleString()}원
          </li>
          <li>
            <strong>요청사항:</strong> {order.requests || '없음'}
          </li>
          <li>
            <strong>주문 상태:</strong> {order.orderStatus}
          </li>
          <li>
            <strong>배송 상태:</strong> {order.deliveryStatus}
          </li>
          <li>
            <strong>주문 일시:</strong> {order.createdAt}
          </li>
        </ul>
      </div>

      <div className='bg-white shadow-lg rounded-xl p-6 border border-[#6D4C41]'>
        <h2 className='text-2xl font-semibold mb-4 text-[#4E342E]'>주문 항목</h2>
        <table className='w-full border-collapse border border-[#6D4C41] text-center rounded-lg overflow-hidden'>
          <thead className='bg-[#FFF3E0] text-[#3E2723]'>
            <tr>
              <th className='border border-[#6D4C41] p-3'>상품명</th>
              <th className='border border-[#6D4C41] p-3'>수량</th>
              <th className='border border-[#6D4C41] p-3'>가격</th>
            </tr>
          </thead>
          <tbody>
            {order.orderItems.map((item) => (
              <tr key={item.itemNo} className='hover:bg-[#F5F5F5]'>
                <td className='border border-[#6D4C41] p-3'>{item.itemName}</td>
                <td className='border border-[#6D4C41] p-3'>{item.count}</td>
                <td className='border border-[#6D4C41] p-3'>{item.price.toLocaleString()}원</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default OrderDetail
