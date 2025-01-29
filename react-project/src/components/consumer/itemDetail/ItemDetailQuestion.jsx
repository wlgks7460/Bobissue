import React, { useEffect, useState } from 'react'
import ItemDetailQuestionCard from './ItemDetailQuestionCard'

const ItemDetailQuestion = () => {
  // 문의 데이터
  const [questions, setQuestions] = useState()

  // 데이터 불러오기
  useEffect(() => {
    // mount

    // unmount
    return () => {}
  }, [])
  return (
    <div>
      <div>
        <div>
          {questions ? (
            questions.map((v) => <ItemDetailQuestionCard key={v.questionNo} />)
          ) : (
            <p>문의가 없습니다 ㅠㅠ</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default ItemDetailQuestion
