import React, { useEffect, useState } from 'react'
import ItemDetailReviewCard from './ItemDetailReviewCard'
import API from '../../../utils/API'
import { ExclamationCircleIcon } from '@heroicons/react/24/outline'

const ItemDetailReview = ({ itemNo }) => {
  // 리뷰 데이터
  const [reviews, setReviews] = useState([])

  // 리뷰 불러오기
  const getReviews = () => {
    API.get(`/item/${itemNo}/review`)
      .then((res) => {
        console.log(res)
        setReviews(res.data.result.data)
      })
      .catch((err) => {
        console.error(err)
      })
  }

  // 데이터 불러오기
  useEffect(() => {
    // mount
    getReviews()
    // unmount
    return () => {}
  }, [])
  return (
    <div>
      <div className='p-3 flex flex-col gap-3'>
        {reviews.length > 0 ? (
          reviews.map((v) => <ItemDetailReviewCard key={v.reviewNo} review={v} />)
        ) : (
          <div className='flex flex-col gap-3 items-center'>
            <p className='text-center'>
              <ExclamationCircleIcon className='w-20 text-gray-400' />
            </p>
            <p className='text-center text-xl text-gray-600'>리뷰가 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ItemDetailReview
