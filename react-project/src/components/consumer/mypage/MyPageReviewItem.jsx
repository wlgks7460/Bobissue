import { StarIcon } from '@heroicons/react/24/solid'
import React, { useEffect, useState } from 'react'
import defaultImg from '../../../assets/consumer/itemDefault.webp'
import API from '../../../utils/API'

const MyPageReviewItem = ({ review }) => {
  const [item, setItem] = useState({})
  // 평점 별 개수 조정
  const [star, setStar] = useState([])

  // 작성일 가공
  const handleCreateAt = (date) => {
    const result = date.split(' ')[0].replace(/(\d{4})(\d{2})(\d{2})/, '$1.$2.$3')
    return result
  }

  const getItemData = () => {
    API.get(`/item/${review.itemNo}`)
      .then((res) => {
        setItem(res.data.result.data)
      })
      .catch((err) => {
        console.error(err)
      })
  }

  useEffect(() => {
    //mount
    const temp = [false, false, false, false, false]
    for (let i = 0; i < Number(review.rating); i++) {
      temp[i] = true
    }
    setStar(temp)
    getItemData()
  }, [])
  return (
    <div className='w-full flex justify-between border border-[#6F4E37] rounded p-3'>
      {/* 리뷰 내용 */}
      <div className='grow flex flex-col gap-2'>
        <div className='flex items-end gap-3'>
          <span className='text-lg'>{item.name}</span>
          <span className='text-gray-400 text-sm'>{handleCreateAt(review.createdAt)}</span>
        </div>
        {/* 평점 */}
        <div className='flex gap-2 items-center'>
          <div className='flex'>
            {star.map((v, i) => (
              <StarIcon
                className={`w-5 ${v ? 'text-yellow-400' : 'text-gray-400'}`}
                key={`star-${i}`}
              />
            ))}
          </div>
          <p className='mt-1'>{review.rating}</p>
        </div>
        <p>{review.content}</p>
        {/* 이미지 */}
        {review.images?.length > 0 && (
          <div className='flex gap-2'>
            <img
              src={review.images?.[0].imageUrl}
              alt=''
              className='w-[80px] h-[80px] border border-gray-400 rounded-md'
              onError={(e) => {
                e.target.src = defaultImg
              }}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default MyPageReviewItem
