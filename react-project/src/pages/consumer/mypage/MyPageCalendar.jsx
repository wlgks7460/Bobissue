import React, { useState } from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import moment from 'moment'
import 'moment/locale/ko'
import dayjs from 'dayjs'
import MyPageCalendarItem from '../../../components/consumer/mypage/MyPageCalendarItem'
import MyPageCalendarModal from '../../../components/consumer/mypage/MyPageCalendarModal'

moment.locale('ko') // 한글 버전
const localizer = momentLocalizer(moment)

const MyPageCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(null) // 클릭한 날짜
  const [modalOpen, setModalOpen] = useState(false) // 모달 상태

  // 날짜 클릭시 모달 출력
  const handleDateClick = (slotInfo) => {
    const clickedDate = dayjs(slotInfo.start).format('YYYY-MM-DD')
    setSelectedDate(clickedDate)
    setModalOpen(true) // 모달 열기
  }

  // 커스텀 툴바
  const CustomToolbar = (toolbar) => {
    const goToBack = () => toolbar.onNavigate('PREV')
    const goToNext = () => toolbar.onNavigate('NEXT')

    const formattedDate = dayjs(toolbar.date).format('YYYY년 M월')

    return (
      <div className='flex justify-between p-3'>
        <button onClick={goToBack} className='text-indigo-600'>
          이전
        </button>
        <span className='text-lg font-bold'>{formattedDate}</span>
        <button onClick={goToNext} className='text-indigo-600'>
          다음
        </button>
      </div>
    )
  }
  // 커스텀 헤더
  const CustomWeekdayHeader = ({ label, date }) => {
    const weekdays = ['일', '월', '화', '수', '목', '금', '토']
    const dayIndex = dayjs(date).day() // 0 = 일요일, 6 = 토요일
    return (
      <span className={`${dayIndex === 0 && 'text-red-500'} ${dayIndex === 6 && 'text-blue-500'}`}>
        {weekdays[dayIndex]}
      </span>
    )
  }

  return (
    <div className='p-5'>
      <h2 className='text-xl text-center mb-5'>내 식단 관리</h2>
      <Calendar
        localizer={localizer}
        startAccessor='start'
        endAccessor='end'
        style={{ height: 500 }}
        views={['month']}
        defaultView='month'
        selectable
        onSelectSlot={handleDateClick}
        messages={{
          next: '다음',
          previous: '이전',
          today: '오늘',
          month: '월',
          week: '주',
          day: '일',
          agenda: '목록',
          date: '날짜',
          time: '시간',
          event: '이벤트',
          noEventsInRange: '등록된 이벤트가 없습니다.',
        }}
        components={{
          month: {
            header: CustomWeekdayHeader,
            dateHeader: MyPageCalendarItem,
          },
          toolbar: CustomToolbar,
        }}
      />
      {modalOpen && <MyPageCalendarModal setModalOpen={setModalOpen} selectedDate={selectedDate} />}
    </div>
  )
}

export default MyPageCalendar
