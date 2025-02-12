import React, { useState } from 'react'
import Breadcrumb from '../common/Breadcrumb'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import moment from 'moment'
import 'moment/locale/ko'
import API from '../../../utils/API'

moment.locale('ko') // 한국어 설정
const localizer = momentLocalizer(moment)

const LiveCalender = () => {
  // Breadcrumb에 사용할 경로 데이터
  const breadcrumbPaths = [
    { name: 'Home' }, // 홈
    { name: '라이브커머스 관리' },
    { name: '라이브커머스 일정관리' },
  ]
  const [events, setEvents] = useState([
    // ✅ 캘린더에 표시할 임시 이벤트 데이터
    {
      title: '테스트 라이브 방송',
      start: new Date(2025, 1, 15, 10, 0), // 2025년 2월 15일 10:00 시작
      end: new Date(2025, 1, 15, 12, 0), // 2025년 2월 15일 12:00 종료
    },
  ])
  // ✅ 이벤트 클릭 시 상세 정보 알림
  const handleSelectEvent = (event) => {
    alert(
      `📢 방송 제목: ${event.title}\n⏰ 시작 시간: ${moment(event.start).format('YYYY-MM-DD HH:mm')}`,
    )
  }
  return (
    <div className='p-6'>
      {/* Breadcrumb */}
      <Breadcrumb paths={breadcrumbPaths} />
      <h2 className='text-2xl font-bold mb-6'>📅 라이브커머스 일정관리</h2>

      {/* 캘린더 컴포넌트 */}
      <div className='bg-white border rounded-lg shadow-md p-4'>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor='start'
          endAccessor='end'
          style={{ height: 1000 }}
          views={['month', 'week', 'day']}
          defaultView='month'
          onSelectEvent={handleSelectEvent} // 클릭 이벤트 핸들러
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
            noEventsInRange: '등록된 방송이 없습니다.',
          }}
        />
      </div>
    </div>
  )
}

export default LiveCalender
