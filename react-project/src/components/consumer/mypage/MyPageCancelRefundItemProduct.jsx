import React, { useEffect, useState } from 'react'
import itemDefaultImg from '../../../assets/consumer/itemDefault.webp'
import API from '../../../utils/API'

const MyPageCancelRefundItemProduct = ({ itemNo, price, quantity }) => {
  const [item, setItem] = useState({})

  const getItem = () => {
    API.get(`/item/${itemNo}`)
      .then((res) => {
        setItem(res.data.result.data)
      })
      .catch((err) => {
        console.error(err)
      })
  }
  useEffect(() => {
    getItem()
  }, [])
  return (
    <div className='flex flex-col gap-3'>
      <div className='flex gap-5'>
        <div className='border rounded'>
          <img
            src={item.images?.[0]?.imageUrl}
            alt=''
            className='w-[50px] h-[50px]'
            onError={(e) => {
              e.target.src = itemDefaultImg
            }}
          />
        </div>
        <div>
          <p>{item.name}</p>
          <div className='flex gap-3'>
            <span>{price}원</span>
            <span>{quantity}개</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyPageCancelRefundItemProduct
