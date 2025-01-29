import React, { useEffect, useState } from 'react'
import ItemDetailReviewCard from './ItemDetailReviewCard'

const ItemDetailReview = () => {
  // 리뷰 데이터
  const [reviews, setReviews] = useState()

  // 데이터 불러오기
  useEffect(() => {
    // mount

    // unmount
    return () => {}
  }, [])
  return (
    <div>
      <div>
        {reviews ? (
          reviews.map((v) => <ItemDetailReviewCard key={v.reviewNo} />)
        ) : (
          <p>리뷰가 없습니다 ㅠㅠ</p>
        )}
      </div>
    </div>
  )
}

export default ItemDetailReview
