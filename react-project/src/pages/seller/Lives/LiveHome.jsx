import React, { useState, useEffect } from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import moment from 'moment'
import 'moment/locale/ko'
import { Link } from 'react-router-dom'
import { FaCalendarAlt, FaTimes, FaVideo, FaUser } from 'react-icons/fa'
import API from '@/utils/API'

moment.locale('ko') // 한글 설정
const localizer = momentLocalizer(moment)
const debug_mode = localStorage.getItem('debug_mode') === 'true'

const LiveHome = () => {
  console.log(debug_mode)
  const [liveSchedules, setLiveSchedules] = useState([])
  const [selectedEvent, setSelectedEvent] = useState(null) // 모달용 상태

  // 📌 API에서 확정된 라이브 일정 가져오기
  useEffect(() => {
    console.log(debug_mode)
    const fetchLiveSchedules = async () => {
      if (debug_mode) {
        // ✅ 디버그 모드: 더미 데이터 사용
        setLiveSchedules([
          {
            castNo: 1,
            title: '🎨 미술 전시 라이브',
            content: '최신 미술 트렌드를 소개하는 라이브 방송입니다.',
            startAt: '20250220 140000',
            endAt: '20250220 153000',
            createdUser: '이아트',
          },
          {
            castNo: 2,
            title: '📚 신간 도서 소개 라이브',
            content: '인기 작가들의 신간을 소개하는 북 라이브!',
            startAt: '20250225 190000',
            endAt: '20250225 203000',
            createdUser: '김작가',
          },
        ])
        return
      }

      try {
        const response = await API.get('/cast')
        console.log(response.data.result.data)
        setLiveSchedules(response.data.result.data)
      } catch (error) {
        console.error('라이브 일정 불러오기 실패:', error)
      }
    }

    fetchLiveSchedules()
  }, [debug_mode])

  // 📌 캘린더 이벤트로 변환
  const convertToCalendarEvents = (schedules) => {
    return schedules.map((schedule) => {
      const start = moment(schedule.startAt, 'YYYYMMDD HHmmss').toDate()
      const end = moment(schedule.endAt, 'YYYYMMDD HHmmss').toDate()

      return {
        id: schedule.castNo,
        title: schedule.title,
        start,
        end,
        description: schedule.content,
        host: schedule.createdUser,
      }
    })
  }

  const events = convertToCalendarEvents(liveSchedules)

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
            views={['month']}
            defaultView='month'
            messages={{
              previous: '저번 달',
              next: '다음 달',
              today: '이번 달',
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
                  <FaCalendarAlt className='text-blue-500' /> <span>{event.title}</span>
                </span>
              ),
            }}
            onSelectEvent={handleEventClick}
          />
        </div>
      </div>

      {/* 📌 모달 창 */}
      {selectedEvent && (
        <div className='fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50'>
          <div className='bg-white p-6 rounded-lg shadow-lg w-[400px] relative'>
            {/* 닫기 버튼 */}
            <button
              onClick={closeModal}
              className='absolute top-2 right-2 text-gray-500 hover:text-gray-700'
            >
              <FaTimes size={20} />
            </button>

            {/* 모달 내용 */}
            <h3 className='text-xl font-bold flex items-center mb-3'>
              <FaVideo className='mr-2 text-red-500' />
              {selectedEvent.title}
            </h3>

            <p className='text-sm text-gray-700 mb-3'>
              📝 {selectedEvent.description || '방송 설명 없음'}
            </p>
            <p className='text-sm text-gray-600'>
              🎤 <strong>방송자:</strong> {selectedEvent.host || '정보 없음'}
            </p>
            <p className='text-sm text-gray-600'>
              📅 <strong>방송 시작:</strong>{' '}
              {moment(selectedEvent.start).format('YYYY-MM-DD HH:mm')}
            </p>
            <p className='text-sm text-gray-600'>
              ⏰ <strong>방송 종료:</strong> {moment(selectedEvent.end).format('YYYY-MM-DD HH:mm')}
            </p>

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
                state={{ event: selectedEvent }}
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
