import React, { useEffect, useState } from 'react'
import MyPageOrderItemProduct from './MyPageOrderItemProduct'
import { Link } from 'react-router-dom'
import API from '../../../utils/API'

const MyPageOrderItem = ({ orderNo, userNo, getOrderData, removeOrder }) => {
  const [orderItem, setOrderItem] = useState({})
  const delivery = ['', '주문 확인 중', '상품 준비 중', '배송 출발', '배송 완료']

  // 주문 취소
  const cancelOrder = () => {
    API.get(`/orders/cancel/${orderNo}`)
      .then((res) => {
        console.log(res)
        if (res.data.message.code === 'SUCCESS_FIND_CANCEL_ORDERS') {
          removeOrder(orderNo)
          getOrderData()
        }
      })
      .catch((err) => {
        console.error(err)
      })
  }

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
      <h3 className='font-bold text-lg'>{delivery[orderItem.orderStatus]}</h3>
      {/* 상품 내역 */}
      <div className='flex flex-col gap-3 my-5'>
        {orderItem.orderItems?.map((v) => (
          <MyPageOrderItemProduct
            key={`detail-${v.itemNo}`}
            itemNo={v.itemNo}
            price={v.price}
            count={v.count}
            deliveryStatus={orderItem.deliveryStatus}
          />
        ))}
      </div>
      <div className='flex gap-3 mb-5'>
        <span className='text-gray-400'>요청 사항</span>
        <span>{orderItem.requests}</span>
      </div>
      {/* 주문 취소 */}
      {orderItem.deliveryStatus === 1 && (
        <div>
          <button
            className='w-full h-[40px] border border-[#6F4E37] hover:bg-[#6F4E37] hover:text-white rounded'
            onClick={cancelOrder}
          >
            주문 취소
          </button>
        </div>
      )}
      {orderItem.deliveryStatus === 2 && (
        <div className='w-full'>
          <Link to={`/board/question?order=${orderItem.orderNo}`}>
            <button className='w-full h-[40px] border border-[#6F4E37] hover:bg-[#6F4E37] hover:text-white rounded'>
              문의하기
            </button>
          </Link>
        </div>
      )}
      {orderItem.deliveryStatus === 3 && orderItem.orderStatus === 2 && (
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
