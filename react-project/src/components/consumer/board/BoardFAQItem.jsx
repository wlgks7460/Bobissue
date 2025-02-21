import React, { useState } from 'react'
import { PlayIcon } from '@heroicons/react/24/solid'

const BoardFAQItem = ({ category }) => {
  const [showQuestions, setShowQuestions] = useState(false)
  return (
    <div>
      <h3
        className='flex items-center gap-2 cursor-pointer'
        onClick={() => setShowQuestions(!showQuestions)}
      >
        <PlayIcon className='w-8 text-[#6F4E37]' />
        <span className='text-xl'>{category.category}</span>
      </h3>
      {showQuestions && (
        <div className='flex flex-col gap-10 px-10 py-5'>
          {category.questions.map((question) => (
            <div key={question.id}>
              <div className='text-xl mb-3 text-gray-500'>Q. {question.question}</div>
              <div className='text-lg'>A. {question.answer}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default BoardFAQItem
