import React, { useState, useEffect } from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import moment from 'moment'
import 'moment/locale/ko'
import { Link } from 'react-router-dom'
import { FaCalendarAlt, FaTimes, FaVideo } from 'react-icons/fa'
import API from '@/utils/API'

moment.locale('ko')
const localizer = momentLocalizer(moment)
const debug_mode = localStorage.getItem('debug_mode') === 'true'

const LiveHome = () => {
  const [liveSchedules, setLiveSchedules] = useState([])
  const [selectedEvent, setSelectedEvent] = useState(null)

  useEffect(() => {
    const fetchLiveSchedules = async () => {
      if (debug_mode) {
        setLiveSchedules([
          {
            castNo: 1,
            title: '🎨 미술 전시 라이브',
            startAt: '20250220 140000',
            endAt: '20250220 153000',
          },
          {
            castNo: 2,
            title: '📚 신간 도서 소개 라이브',
            startAt: '20250225 190000',
            endAt: '20250225 203000',
          },
        ])
        return
      }

      try {
        const response = await API.get('/cast')
        setLiveSchedules(response.data.result.data)
      } catch (error) {
        console.error('라이브 일정 불러오기 실패:', error)
      }
    }

    fetchLiveSchedules()
  }, [debug_mode])

  const convertToCalendarEvents = (schedules) => {
    return schedules.map((schedule) => {
      const start = moment(schedule.startAt, 'YYYYMMDD HHmmss').toDate()
      const end = moment(schedule.endAt, 'YYYYMMDD HHmmss').toDate()

      return {
        id: schedule.castNo,
        title: schedule.title,
        start,
        end,
      }
    })
  }

  const events = convertToCalendarEvents(liveSchedules)

  const handleEventClick = (event) => {
    setSelectedEvent(event)
  }

  const closeModal = () => {
    setSelectedEvent(null)
  }

  return (
    <div className='p-6 relative bg-warmBeige/20 min-h-screen'>
      <h2 className='text-3xl font-bold text-espressoBlack mb-6'>라이브 홈</h2>

      <div className='mb-6'>
        <h3 className='text-lg font-semibold mb-4 flex items-center text-coffeeBrown'>
          <FaCalendarAlt className='mr-2 text-caramelTan' /> 확정된 라이브 일정
        </h3>
        <div className='bg-white border border-latteBeige rounded-lg shadow-md p-4'>
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
              today: '오늘',
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
                <div className='border border-roastedCocoa p-2 rounded-lg shadow-sm text-sm font-semibold text-darkGraphite'>
                  {event.title}
                </div>
              ),
            }}
            onSelectEvent={handleEventClick}
          />
        </div>
      </div>

      {/* 📌 모달 창 */}
      {selectedEvent && (
        <div className='fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50'>
          <div className='bg-white p-6 rounded-lg shadow-lg w-[400px] relative border border-coffeeBrown'>
            <button
              onClick={closeModal}
              className='absolute top-2 right-2 text-coffeeBrown hover:text-latteBeige'
            >
              <FaTimes size={20} />
            </button>

            <h3 className='text-xl font-bold flex items-center mb-3 text-espressoBlack'>
              <FaVideo className='mr-2 text-caramelTan' />
              {selectedEvent.title}
            </h3>

            <p className='text-sm text-darkGraphite mb-3'>
              📅 <strong>방송 시작:</strong>{' '}
              {moment(selectedEvent.start).format('YYYY-MM-DD HH:mm')}
            </p>
            <p className='text-sm text-darkGraphite'>
              ⏰ <strong>방송 종료:</strong> {moment(selectedEvent.end).format('YYYY-MM-DD HH:mm')}
            </p>

            <div className='mt-4 flex justify-end space-x-2'>
              <button
                onClick={closeModal}
                className='px-4 py-2 text-coffeeBrown border border-roastedCocoa rounded hover:bg-latteBeige'
              >
                닫기
              </button>
              <Link
                to='/seller/lives/livestream'
                className='px-4 py-2 bg-roastedCocoa text-white rounded hover:bg-mochaBrown flex items-center'
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
