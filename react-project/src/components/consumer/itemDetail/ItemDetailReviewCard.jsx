import React, { useEffect, useState } from 'react'
import { StarIcon } from '@heroicons/react/24/solid'
const ItemDetailReviewCard = ({ review }) => {
  // 평점 별 개수 조정
  const [star, setStar] = useState([])

  // 이용자 이름 * 변경
  const handleUserName = (userName) => {
    const result = userName
      .split('')
      .map((v, index) => (v = index !== 0 ? '*' : v))
      .join('')
    return result
  }
  // 작성일 가공
  const handleCreateAt = (date) => {
    const result = date.split(' ')[0].replace(/(\d{4})(\d{2})(\d{2})/, '$1.$2.$3')
    return result
  }

  useEffect(() => {
    //mount
    const temp = [false, false, false, false, false]
    for (let i = 0; i < Number(review.rating); i++) {
      temp[i] = true
    }
    setStar(temp)
  }, [])

  return (
    <div className='w-full flex justify-between'>
      {/* 작성자 및 작성일 */}
      <div className='flex-none w-[200px]'>
        <p className='text-lg'>{handleUserName(review.userName)}</p>
        <p className='text-gray-400'>{handleCreateAt(review.createdAt)}</p>
      </div>
      {/* 리뷰 내용 */}
      <div className='grow flex flex-col gap-5'>
        <p>{review.content}</p>
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
          <p className=''>{review.rating}</p>
        </div>
        {/* 이미지 */}
        {review.imageNo && (
          <div className='flex gap-2'>
            <img src='' alt='' className='w-[100px] h-[100px] border border-gray-400 rounded-md' />
          </div>
        )}
      </div>
    </div>
  )
}

export default ItemDetailReviewCard
