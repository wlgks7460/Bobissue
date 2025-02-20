import React, { useEffect, useState } from 'react'
import MyPageCancelRefundItemProduct from './MyPageCancelRefundItemProduct'
import API from '../../../utils/API'

const MyPageCancelRefundItem = ({ orderNo, userNo }) => {
  const [orderItem, setOrderItem] = useState({})
  const orderStatus = [
    '',
    '결제 완료',
    '주문 확정',
    '주문 취소 요청',
    '주문 취소 완료',
    '환불 신청',
    '환불 완료',
  ]

  const getOrderDetail = () => {
    API.get(`/users/${userNo}/orders/${orderNo}`)
      .then((res) => {
        setOrderItem(res.data.result.data)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  useEffect(() => {
    getOrderDetail()
  }, [])
  return (
    <div className='w-full border border-[#6F4E37] rounded p-3'>
      <h3 className='font-bold text-lg'>{orderStatus[orderItem.orderStatus]}</h3>
      {/* 상품 내역 */}
      <div className='flex flex-col gap-3 my-5'>
        {orderItem.orderItems?.map((v) => (
          <MyPageCancelRefundItemProduct
            key={`detail-${v.itemNo}`}
            itemNo={v.itemNo}
            price={v.price}
            quantity={v.count}
          />
        ))}
      </div>
      <div className='flex gap-3 mb-5'>
        <span className='text-gray-400'>요청 사항</span>
        <span>{orderItem.requests}</span>
      </div>
    </div>
  )
}

export default MyPageCancelRefundItem
