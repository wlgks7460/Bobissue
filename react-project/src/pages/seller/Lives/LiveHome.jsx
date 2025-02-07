import React, { useState, useEffect } from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import moment from 'moment'
import 'moment/locale/ko'
import { Link } from 'react-router-dom'
import { FaCalendarAlt, FaTimes, FaVideo } from 'react-icons/fa' // FontAwesome 아이콘
import API from '@/utils/API' // 백엔드에서 데이터 가져오는 API

moment.locale('ko') // 한글 설정
const localizer = momentLocalizer(moment)

const LiveHome = () => {
  // 확정된 라이브 일정 목록
  const [liveSchedules, setLiveSchedules] = useState([])
  const [selectedEvent, setSelectedEvent] = useState(null) // 모달용 상태

  // 📌 useEffect: API에서 확정된 라이브 일정 가져오기
  useEffect(() => {
    const fetchLiveSchedules = async () => {
      try {
        const response = await API.get('/api/seller/live-schedules') // 백엔드 API 호출
        setLiveSchedules(response.data.result)
      } catch (error) {
        console.error('라이브 일정 불러오기 실패:', error)
        setLiveSchedules([
          {
            id: 1,
            title: '신상품 소개 라이브',
            date: '2025-02-10',
            time: '14:00-15:00',
            duration: 60,
          },
          {
            id: 2,
            title: '건강식품 라이브 방송',
            date: '2025-02-12',
            time: '10:00-11:30',
            duration: 90,
          },
        ])
      }
    }

    fetchLiveSchedules()
  }, [])

  // 📌 캘린더에 표시할 이벤트로 변환
  const events = liveSchedules.map((schedule) => {
    const start = moment(`${schedule.date}T${schedule.time.split('-')[0]}`, 'YYYY-MM-DDTHH:mm')
    const end = start.clone().add(schedule.duration, 'minutes')

    return {
      title: schedule.title,
      start: start.toDate(),
      end: end.toDate(),
      id: schedule.id,
      time: schedule.time,
    }
  })

  // 📌 이벤트 클릭 시 모달 열기
  const handleEventClick = (event) => {
    setSelectedEvent(event)
  }

  // 📌 모달 닫기
  const closeModal = () => {
    setSelectedEvent(null)
  }

  return (
    <div className='p-6 relative'>
      <h2 className='text-2xl font-bold mb-6'>📅 라이브 홈</h2>

      {/* 스케줄 캘린더 */}
      <div className='mb-6'>
        <h3 className='text-lg font-semibold mb-4 flex items-center'>
          <FaCalendarAlt className='mr-2 text-blue-500' /> 확정된 라이브 일정
        </h3>
        <div className='bg-white border rounded-lg shadow-md p-4'>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor='start'
            endAccessor='end'
            style={{ height: 500 }}
            views={['month']} // 📌 월별로만 표시
            defaultView='month'
            messages={{
              previous: '저번 달', // 📌 이전 달
              next: '다음 달', // 📌 다음 달
              today: '이번 달', // 📌 현재 달을 이번 달로 변경
              month: '월',
              week: '주',
              day: '일',
              agenda: '목록',
              date: '날짜',
              time: '시간',
              event: '이벤트',
              noEventsInRange: '확정된 라이브 일정이 없습니다.',
            }}
            components={{
              event: ({ event }) => (
                <span className='text-[10px] flex items-center space-x-1'>
                  <FaCalendarAlt className='text-blue-500' /> <span>방송 일정이 있습니다.</span>
                </span>
              ),
            }}
            onSelectEvent={handleEventClick} // 이벤트 클릭 시 모달 열기
          />
        </div>
      </div>

      {/* 📌 모달 창 (모든 요소의 최상위에 위치) */}
      {selectedEvent && (
        <div className='fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50'>
          <div className='bg-white p-6 rounded-lg shadow-lg w-[350px] relative'>
            {/* 닫기 버튼 */}
            <button
              onClick={closeModal}
              className='absolute top-2 right-2 text-gray-500 hover:text-gray-700'
            >
              <FaTimes size={20} />
            </button>

            {/* 모달 내용 */}
            <h3 className='text-lg font-semibold flex items-center'>
              <FaVideo className='mr-2 text-red-500' />
              {selectedEvent.title}
            </h3>
            <p className='text-sm text-gray-600 mt-2'>⏰ 방송 시간: {selectedEvent.time}</p>

            {/* 버튼 영역 */}
            <div className='mt-4 flex justify-end space-x-2'>
              <button
                onClick={closeModal}
                className='px-4 py-2 text-gray-500 border rounded hover:bg-gray-100'
              >
                닫기
              </button>
              <Link
                to='/seller/lives/livestream'
                className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center'
              >
                <FaVideo className='mr-2' />
                라이브 하러 가기
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default LiveHome
