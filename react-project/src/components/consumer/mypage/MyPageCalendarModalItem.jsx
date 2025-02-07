import React, { useState } from 'react'

const MyPageCalendarModalItem = ({ meal }) => {
  const [mode, setMode] = useState('read')
  return (
    <div>
      {mode === 'read' && (
        <div className='flex items-center space-x-4 mb-4'>
          <div className='border border-gray-300 rounded'>
            <img
              src={meal.image}
              alt={meal.title}
              className='w-[80px] h-[80px] object-cover rounded'
            />
          </div>
          <div>
            <h4 className='font-bold'>{meal.title}</h4>
            <div>
              <span className='me-5'>{meal.time}</span>
              <span className='text-sm text-gray-500'>{meal.calories} kcal</span>
            </div>
            <div className='flex gap-3'>
              <button className='p-1 text-indigo-600' onClick={() => setMode('update')}>
                수정
              </button>
              <button className='p-1 text-red-600'>삭제</button>
            </div>
          </div>
        </div>
      )}
      {mode === 'update' && (
        <div>
          <div className='flex items-center space-x-4 mb-1'>
            <div className='border border-gray-300 rounded'>
              <img
                src={meal.image}
                alt={meal.title}
                className='w-[80px] h-[80px] object-cover rounded'
              />
            </div>
            <div>
              <h4 className='font-bold'>{meal.title}</h4>
              <div>
                <span className='me-5'>{meal.time}</span>
                <span className='text-sm text-gray-500'>{meal.calories} kcal</span>
              </div>
              <div className='flex gap-3'>
                <button className='p-1 text-indigo-600'>수정</button>
                <button className='p-1 text-red-600' onClick={() => setMode('read')}>
                  취소
                </button>
              </div>
            </div>
          </div>
          <input type='file' name='' id='' accept='image/*' />
        </div>
      )}
    </div>
  )
}

export default MyPageCalendarModalItem
