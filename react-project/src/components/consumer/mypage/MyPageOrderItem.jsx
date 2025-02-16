import React from 'react'
import MyPageOrderItemProduct from './MyPageOrderItemProduct'

const MyPageOrderItem = ({ orderItem }) => {
  return (
    <div className='w-full border border-[#6F4E37] rounded p-3'>
      <h3 className='font-bold text-lg'>배송상태</h3>
      {/* 상품 내역 */}
      <div className='flex flex-col gap-3 my-5'>
        {orderItem.orderDetail?.map((v) => (
          <MyPageOrderItemProduct
            key={`detail-${v.orderDetailNo}`}
            itemNo={v.itemNo}
            price={v.price}
            quantity={v.quantity}
          />
        ))}
      </div>
      <div className='flex gap-3'>
        <span className='text-gray-400'>요청 사항</span>
        <span>{orderItem.request}</span>
      </div>
    </div>
  )
}

export default MyPageOrderItem
