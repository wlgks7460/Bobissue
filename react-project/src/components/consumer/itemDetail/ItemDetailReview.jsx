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
    // setReviews([
    //   {
    //     reviewNo: 1,
    //     imageNo: 9876543210,
    //     content: '재구매했는데 역시 맛있네요. 포장도 꼼꼼하게 잘 되어있어서 좋았습니다!',
    //     rating: 4,
    //     createdAt: '20250130 210854',
    //     createdUser: 1,
    //     updatedAt: '20250130 210947',
    //   },
    //   {
    //     reviewNo: 2,
    //     imageNo: 1234567890,
    //     content: '맛있고 신선한 재료였어요. 배송도 빨랐습니다. 다음에도 구매하고 싶네요!',
    //     rating: 5,
    //     createdAt: '20250130 212204',
    //     createdUser: 1,
    //     updatedAt: '20250130 212204',
    //   },
    // ])
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
