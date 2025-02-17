import React from 'react'
import itemDefaultImg from '../../../assets/consumer/itemDefault.webp'
import { Link } from 'react-router-dom'

const MyPageOrderItemProduct = ({ itemNo, price, quantity, orderStatus }) => {
  // const
  return (
    <div className='flex flex-col gap-3'>
      <div className='flex gap-5'>
        <div className='border rounded'>
          <img
            src=''
            alt=''
            className='w-[50px] h-[50px]'
            onError={(e) => {
              e.target.src = itemDefaultImg
            }}
          />
        </div>
        <div>
          <p>상품명</p>
          <div className='flex gap-3'>
            <span>{price}원</span>
            <span>{quantity}개</span>
          </div>
        </div>
      </div>
      {orderStatus === 3 && (
        <Link to={`/mypage/review/${itemNo}`}>
          <button className='w-full h-[40px] border border-[#6F4E37] hover:bg-[#6F4E37] hover:text-white rounded'>
            리뷰 작성
          </button>
        </Link>
      )}
    </div>
  )
}

export default MyPageOrderItemProduct
