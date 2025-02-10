import React from 'react'
import faq from '../../../assets/consumer/faq.json'
import BoardFAQItem from '../../../components/consumer/board/BoardFAQItem'

const BoardFAQ = () => {
  return (
    <div className='p-5'>
      <h2 className='text-2xl text-center mb-10'>자주 묻는 질문</h2>
      <div className='flex flex-col gap-10'>
        {faq.faq.map((category) => (
          <BoardFAQItem key={category.id} category={category} />
        ))}
      </div>
    </div>
  )
}

export default BoardFAQ
