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
const debug_mode = localStorage.getItem('debug_mode')

const LiveHome = () => {
  const [liveSchedules, setLiveSchedules] = useState([])
  const [selectedEvent, setSelectedEvent] = useState(null) // 모달용 상태

  // 📌 useEffect: API에서 확정된 라이브 일정 가져오기
  useEffect(() => {
    console.log(debug_mode)
    const fetchLiveSchedules = async () => {
      if (debug_mode) {
        // ✅ 디버그 모드일 경우 더미 데이터 사용
        setLiveSchedules([
          {
            id: 1,
            title: '🎨 미술 전시 라이브',
            description: '최신 미술 트렌드를 소개하는 라이브 방송입니다.',
            category: '예술',
            date: '2025-02-20',
            time: '14:00-15:30',
            duration: 90,
            host: '이아트',
            thumbnail: 'https://example.com/images/art-live.jpg',
          },
          {
            id: 2,
            title: '📚 신간 도서 소개 라이브',
            description: '인기 작가들의 신간을 소개하는 북 라이브!',
            category: '도서',
            date: '2025-02-25',
            time: '19:00-20:30',
            duration: 90,
            host: '김작가',
            thumbnail: 'https://example.com/images/book-live.jpg',
          },
        ])
        return
      }

      try {
        const response = await API.get('/api/seller/live-schedules')
        setLiveSchedules(response.data.result)
      } catch (error) {
        console.error('라이브 일정 불러오기 실패:', error)
      }
    }

    fetchLiveSchedules()
  }, [debug_mode])

  // 📌 캘린더 이벤트로 변환
  const events = liveSchedules.map((schedule) => {
    const start = moment(`${schedule.date}T${schedule.time.split('-')[0]}`, 'YYYY-MM-DDTHH:mm')
    const end = start.clone().add(schedule.duration, 'minutes')

    return {
      title: schedule.title,
      start: start.toDate(),
      end: end.toDate(),
      id: schedule.id,
      time: schedule.time,
      description: schedule.description,
      category: schedule.category,
      host: schedule.host,
      thumbnail: schedule.thumbnail,
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
                  <FaCalendarAlt className='text-blue-500' /> <span>방송 일정이 있습니다.</span>
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
              📂 <strong>카테고리:</strong> {selectedEvent.category || '미선택'}
            </p>
            <p className='text-sm text-gray-600 flex items-center mt-2'>
              <FaUser className='mr-2 text-green-500' />
              <strong>방송 신청자:</strong> {selectedEvent.host || '정보 없음'}
            </p>
            <p className='text-sm text-gray-600 mt-2'>
              📅 <strong>방송 날짜:</strong> {selectedEvent.date}
            </p>
            <p className='text-sm text-gray-600'>
              ⏰ <strong>방송 시간:</strong> {selectedEvent.time}
            </p>

            {selectedEvent.thumbnail && (
              <div className='mt-3'>
                <img
                  src={selectedEvent.thumbnail}
                  alt='썸네일'
                  className='w-full h-[200px] object-cover rounded-lg shadow'
                />
              </div>
            )}

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
