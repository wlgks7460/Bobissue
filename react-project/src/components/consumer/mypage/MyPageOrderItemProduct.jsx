import React from 'react'
import itemDefaultImg from '../../../assets/consumer/itemDefault.webp'

const MyPageOrderItemProduct = ({ itemNo, price, quantity }) => {
  // const
  return (
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
  )
}

export default MyPageOrderItemProduct
