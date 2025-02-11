import React from 'react'
import dayjs from 'dayjs'

const MyPageCalendarItem = ({ label, date, events }) => {
  const dayOfWeek = dayjs(date).format('ddd') // 요일 가져오기

  // 해당 날짜의 이벤트 찾기
  const event = events.find((event) => dayjs(event.start).isSame(dayjs(date), 'day'))
  const todayCal = event ? event.cal : null // 해당 날짜의 칼로리 (없으면 null)

  return (
    <div className='p-1 flex flex-col'>
      <div className='w-full flex justify-start'>
        <button
          className={`text-center ${dayOfWeek === 'Sat' && 'text-blue-500'} ${dayOfWeek === 'Sun' && 'text-red-500'}`}
        >
          {label}
        </button>
      </div>
      {/* 칼로리 값이 있을 때만 출력 */}
      {todayCal !== null && (
        <div>
          <span className='text-sm text-gray-500'>{todayCal} kCal</span>
        </div>
      )}
    </div>
  )
}

export default MyPageCalendarItem
