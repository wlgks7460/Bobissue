import React, { useEffect, useState } from 'react'
import MyPageReviewItem from '../../../components/consumer/mypage/MyPageReviewItem'
import { ExclamationCircleIcon } from '@heroicons/react/24/outline'
import API from '../../../utils/API'

const MyPageReview = () => {
  const [reviews, setReviews] = useState([])

  // 리뷰 데이터 불러오기
  const getReviewData = () => {}

  useEffect(() => {
    // mount
    setReviews([
      {
        reviewNo: 1,
        images: [],
        itemNo: 2,
        content: '재구매했는데 역시 맛있네요. 포장도 꼼꼼하게 잘 되어있어서 좋았습니다!',
        rating: 4,
        createdAt: '20250130 210854',
        createdUser: 1,
        updatedAt: '20250130 210947',
      },
      {
        reviewNo: 2,
        images: [
          {
            imageNo: 1,
            imageUrl:
              'data:image/jpeg;base64,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',
          },
        ],
        itemNo: 1,
        content: '맛있고 신선한 재료였어요. 배송도 빨랐습니다. 다음에도 구매하고 싶네요!',
        rating: 5,
        createdAt: '20250130 212204',
        createdUser: 1,
        updatedAt: '20250130 212204',
      },
    ])
  }, [])
  return (
    <div className='p-5'>
      <h3 className='text-center text-xl mb-10'>내 상품 후기</h3>
      {/* 리뷰 목록 */}
      <div className='overflow-y-auto'>
        {reviews.length > 0 ? (
          <div className='flex flex-col gap-5'>
            {reviews.map((v) => (
              <MyPageReviewItem key={v.reviewNo} review={v} />
            ))}
          </div>
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

export default MyPageReview
