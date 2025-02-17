import React from 'react'
import MyPageOrderItemProduct from './MyPageOrderItemProduct'
import { Link } from 'react-router-dom'

const MyPageOrderItem = ({ orderItem }) => {
  const orderStatus = ['', '상품 준비 중', '배송 중', '배송 완료']
  return (
    <div className='w-full border border-[#6F4E37] rounded p-3'>
      <h3 className='font-bold text-lg'>{orderStatus[orderItem.orderStatus]}</h3>
      {/* 상품 내역 */}
      <div className='flex flex-col gap-3 my-5'>
        {orderItem.orderDetail?.map((v) => (
          <MyPageOrderItemProduct
            key={`detail-${v.orderDetailNo}`}
            itemNo={v.itemNo}
            price={v.price}
            quantity={v.quantity}
            orderStatus={orderItem.orderStatus}
          />
        ))}
      </div>
      <div className='flex gap-3 mb-5'>
        <span className='text-gray-400'>요청 사항</span>
        <span>{orderItem.request}</span>
      </div>
      {/* 주문 취소 */}
      {orderItem.orderStatus === 1 && (
        <div>
          <button className='w-full h-[40px] border border-[#6F4E37] hover:bg-[#6F4E37] hover:text-white rounded'>
            주문 취소
          </button>
        </div>
      )}
      {orderItem.orderStatus === 2 && (
        <div className='w-full'>
          <Link to={`/board/question?order=${orderItem.orderNo}`}>
            <button className='w-full h-[40px] border border-[#6F4E37] hover:bg-[#6F4E37] hover:text-white rounded'>
              문의하기
            </button>
          </Link>
        </div>
      )}
      {orderItem.orderStatus === 3 && (
        <div className='grid grid-cols-3 gap-2'>
          <button className='w-full h-[40px] border border-[#6F4E37] hover:bg-[#6F4E37] hover:text-white rounded'>
            구매 확정
          </button>
          <Link to={`/board/question?order=${orderItem.orderNo}`}>
            <button className='w-full h-[40px] border border-[#6F4E37] hover:bg-[#6F4E37] hover:text-white rounded'>
              문의하기
            </button>
          </Link>
          <Link to={`/board/question?order=${orderItem.orderNo}&category=refund`}>
            <button className='w-full h-[40px] border border-[#6F4E37]  hover:bg-[#6F4E37] hover:text-white rounded'>
              환불
            </button>
          </Link>
        </div>
      )}
    </div>
  )
}

export default MyPageOrderItem
