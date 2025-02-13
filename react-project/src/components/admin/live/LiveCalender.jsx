import React, { useState, useEffect } from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import moment from 'moment'
import 'moment/locale/ko'
import dayjs from 'dayjs'
import Breadcrumb from '../common/Breadcrumb'
import API from '../../../utils/API'
import LiveDetailModal from './LiveModalDetail/' //✅ 모달 컴포넌트 추가

moment.locale('ko') // 한글 설정
const localizer = momentLocalizer(moment)

const LiveCalendar = () => {
  const breadcrumbPaths = [
    { name: 'Home' },
    { name: '라이브커머스 관리' },
    { name: '라이브커머스 일정관리' },
  ]

  const [selectedBroadcast, setSelectedBroadcast] = useState(null) // ✅ 선택한 방송 정보
  const [isModalOpen, setIsModalOpen] = useState(false) // ✅ 모달 상태 추가
  const [events, setEvents] = useState([]) // 캘린더 이벤트

  // ✅ "등록"과 "거절" 상태 제외하고 데이터 가져오기
  useEffect(() => {
    const fetchBroadcasts = async () => {
      try {
        const response = await API.get('/cast')
        console.log('📌 방송 데이터:', response.data)

        const allBroadcasts = response.data?.result?.data || []

        // "등록"과 "거절" 상태를 제외한 방송 필터링
        const filteredBroadcasts = allBroadcasts.filter(
          (broadcast) => !['등록', '거절'].includes(broadcast.castStatus),
        )

        // ✅ 캘린더 이벤트로 변환
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

  // ✅ 방송 클릭 시 모달 열기
  const handleSelectEvent = (event) => {
    setSelectedBroadcast(event.broadcast)
    setIsModalOpen(true) // ✅ 모달 열기
  }

  // ✅ 상태별 색상 적용
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

  // ✅ `eventPropGetter`를 사용하여 이벤트 스타일 적용
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
      <h2 className='text-2xl font-bold mb-5'>📅 라이브커머스 일정</h2>

      <Calendar
        localizer={localizer}
        events={events}
        startAccessor='start'
        endAccessor='end'
        style={{ height: 1000, width: '100%' }}
        views={['month']}
        defaultView='month'
        defaultDate={new Date()}
        onSelectEvent={handleSelectEvent} // ✅ 모달 열기 추가
        eventPropGetter={eventPropGetter}
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

      {/* ✅ 방송 상세 모달 추가 */}
      {isModalOpen && (
        <LiveDetailModal broadcast={selectedBroadcast} onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  )
}

export default LiveCalendar
