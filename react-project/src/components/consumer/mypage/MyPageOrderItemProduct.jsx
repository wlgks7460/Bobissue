import React, { useEffect, useState } from 'react'
import itemDefaultImg from '../../../assets/consumer/itemDefault.webp'
import { Link } from 'react-router-dom'
import API from '../../../utils/API'

const MyPageOrderItemProduct = ({ itemNo, price, count, deliveryStatus }) => {
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
            <span>{count}개</span>
          </div>
        </div>
      </div>
      {deliveryStatus === 3 && (
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
