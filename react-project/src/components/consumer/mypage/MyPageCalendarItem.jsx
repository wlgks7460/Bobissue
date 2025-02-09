import React, { useState } from 'react'
import dayjs from 'dayjs'
import MyPageCalendarModal from './MyPageCalendarModal'

const MyPageCalendarItem = ({ label, date }) => {
  const dayOfWeek = dayjs(date).format('ddd') // 달력 요일
  const [todayCal, setTodayCal] = useState(0) // 해당 날짜의 칼로리
  return (
    <div className='p-1 flex flex-col'>
      <div className='w-full flex justify-start'>
        <button
          className={`text-center ${dayOfWeek === 'Sat' && 'text-blue-500'} ${dayOfWeek === 'Sun' && 'text-red-500'}`}
        >
          {label}
        </button>
      </div>
      <div>
        <span className='text-sm text-gray-500'>{todayCal} kCal</span>
      </div>
    </div>
  )
}

export default MyPageCalendarItem
