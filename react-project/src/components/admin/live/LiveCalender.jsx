import React, { useState, useEffect } from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import moment from 'moment'
import 'moment/locale/ko'
import dayjs from 'dayjs'
import Breadcrumb from '../common/Breadcrumb'
import API from '../../../utils/API'
import LiveDetailModal from './LiveModalDetail/'

moment.locale('ko')
const localizer = momentLocalizer(moment)

const LiveCalendar = () => {
  const breadcrumbPaths = [
    { name: 'Home' },
    { name: '라이브커머스 관리' },
    { name: '라이브커머스 일정관리' },
  ]

  const [selectedBroadcast, setSelectedBroadcast] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [events, setEvents] = useState([])

  useEffect(() => {
    const fetchBroadcasts = async () => {
      try {
        const response = await API.get('/cast')
        console.log('📌 방송 데이터:', response.data)

        const allBroadcasts = response.data?.result?.data || []

        const filteredBroadcasts = allBroadcasts.filter(
          (broadcast) => !['등록', '거절'].includes(broadcast.castStatus),
        )

        const formattedEvents = filteredBroadcasts.map((broadcast) => ({
          title: `${moment(broadcast.startAt, 'YYYYMMDD HHmmss').format('HH:mm')} ~ ${moment(
            broadcast.endAt,
            'YYYYMMDD HHmmss',
          ).format('HH:mm')} \n${broadcast.createdUser.split(' ')[1]}`,
          start: moment(broadcast.startAt, 'YYYYMMDD HHmmss').toDate(),
          end: moment(broadcast.endAt, 'YYYYMMDD HHmmss').toDate(),
          status: broadcast.castStatus,
          broadcast,
        }))

        console.log('📌 변환된 캘린더 데이터:', formattedEvents)
        setEvents(formattedEvents)
      } catch (error) {
        console.error('❌ 방송 일정 불러오기 실패:', error)
        setEvents([])
      }
    }

    fetchBroadcasts()
  }, [])

  const handleSelectEvent = (event) => {
    setSelectedBroadcast(event.broadcast)
    setIsModalOpen(true)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case '대기':
        return '#FDE68A'
      case '방송중':
        return '#A7F3D0'
      case '종료':
        return '#D1D5DB'
      default:
        return '#E5E7EB'
    }
  }

  const eventPropGetter = (event) => {
    return {
      style: {
        backgroundColor: getStatusColor(event.status),
        color: 'black',
        borderRadius: '8px',
        border: 'none',
        padding: '6px 8px',
        fontSize: '12px',
        fontWeight: 'bold',
        whiteSpace: 'pre-line',
        textAlign: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
    }
  }

  return (
    <div className='p-6'>
      <Breadcrumb paths={breadcrumbPaths} />
      <h2 className='text-2xl font-bold mb-10'>📅 라이브커머스 일정</h2>

      <Calendar
        localizer={localizer}
        events={events}
        startAccessor='start'
        endAccessor='end'
        style={{ height: 1000, width: '100%' }}
        views={['month']}
        defaultView='month'
        defaultDate={moment().add(1, 'month').toDate()}
        onSelectEvent={handleSelectEvent}
        eventPropGetter={eventPropGetter}
        messages={{
          next: '▶',
          previous: '◀',
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
        formats={{
          // 📆 월 이름 한글로 변경
          monthHeaderFormat: (date) =>
            new Intl.DateTimeFormat('ko-KR', { year: 'numeric', month: 'long' }).format(date),
          // 🗓️ 요일도 한글로 변경
          weekdayFormat: (date) =>
            new Intl.DateTimeFormat('ko-KR', { weekday: 'short' }).format(date),
        }}
        components={{
          toolbar: (props) => (
            <div className='flex items-center justify-between mb-4'>
              <button className='text-xl' onClick={() => props.onNavigate('PREV')}>
                ◀
              </button>
              <span className='text-xl font-bold'>
                {new Intl.DateTimeFormat('ko-KR', { year: 'numeric', month: 'long' }).format(
                  props.date,
                )}
              </span>
              <button className='text-xl' onClick={() => props.onNavigate('NEXT')}>
                ▶
              </button>
            </div>
          ),
        }}
      />

      {isModalOpen && (
        <LiveDetailModal broadcast={selectedBroadcast} onClose={() => setIsModalOpen(false)} />
      )}

      <style>{`
        .rbc-date-cell {
          text-align: left;
          padding-left: 7px;
          margin-top: 7px;
        }

        .rbc-month-view .rbc-header {
          justify-content: center;
          font-size: 1.3rem;
          font-weight: normal;
        }
      `}</style>
    </div>
  )
}

export default LiveCalendar
