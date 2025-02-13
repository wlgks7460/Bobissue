import React, { useState, useEffect } from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import moment from 'moment'
import 'moment/locale/ko'
import dayjs from 'dayjs'
import Breadcrumb from '../common/Breadcrumb'
import API from '../../../utils/API'

moment.locale('ko') // 한글 설정
const localizer = momentLocalizer(moment)

const LiveCalendar = () => {
  const breadcrumbPaths = [
    { name: 'Home' },
    { name: '라이브커머스 관리' },
    { name: '라이브커머스 일정관리' },
  ]

  const [selectedBroadcast, setSelectedBroadcast] = useState(null) // 클릭한 방송 정보
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

        // ✅ 캘린더 이벤트로 변환 (시간 강조, 줄바꿈 가능하도록 설정)
        const formattedEvents = filteredBroadcasts.map((broadcast) => ({
          title: `${broadcast.title}\n📅 ${moment(broadcast.startAt, 'YYYYMMDD HHmmss').format('HH:mm')} ~ ${moment(broadcast.endAt, 'YYYYMMDD HHmmss').format('HH:mm')}`, // 방송 제목 + 시간
          start: moment(broadcast.startAt, 'YYYYMMDD HHmmss').toDate(),
          end: moment(broadcast.endAt, 'YYYYMMDD HHmmss').toDate(),
          status: broadcast.castStatus, // 방송 상태 (한글 그대로)
          broadcast, // 방송 객체 전체 저장
        }))

        console.log('📌 변환된 캘린더 데이터:', formattedEvents)
        setEvents(formattedEvents) // 상태 업데이트
      } catch (error) {
        console.error('❌ 방송 일정 불러오기 실패:', error)
        setEvents([]) // 오류 발생 시 빈 배열 유지
      }
    }

    fetchBroadcasts()
  }, [])

  // ✅ 상태별 파스텔 톤 색상 적용
  const getStatusColor = (status) => {
    switch (status) {
      case '대기':
        return '#FDE68A' // 부드러운 연노랑
      case '방송중':
        return '#A7F3D0' // 부드러운 민트색
      case '종료':
        return '#D1D5DB' // 연한 회색
      default:
        return '#E5E7EB' // 기본 회색 (연한 그레이)
    }
  }

  // ✅ `eventPropGetter`를 사용하여 이벤트 스타일을 조정 (더 깔끔하게 정리)
  const eventPropGetter = (event) => {
    return {
      style: {
        backgroundColor: getStatusColor(event.status),
        color: 'black',
        borderRadius: '8px',
        border: 'none',
        padding: '6px 8px', // 여백 추가
        fontSize: '12px', // 폰트 크기 조정
        fontWeight: 'bold', // 강조
        whiteSpace: 'pre-line', // 줄바꿈 가능하도록 설정
        textAlign: 'center', // 중앙 정렬
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
    }
  }

  // ✅ 방송 클릭 시 상세 정보 토글
  const handleSelectEvent = (event) => {
    setSelectedBroadcast(
      selectedBroadcast?.castNo === event.broadcast.castNo ? null : event.broadcast,
    )
  }

  return (
    <div className='p-5 max-w-7xl mx-auto'>
      {' '}
      {/* 가로 최대 크기 조정 */}
      <Breadcrumb paths={breadcrumbPaths} />
      <h2 className='text-2xl font-bold text-center mb-6'>📅 라이브커머스 일정</h2>
      <Calendar
        localizer={localizer}
        events={events} // 📌 API에서 변환된 데이터를 여기에 전달
        startAccessor='start' // 이벤트의 시작 시간
        endAccessor='end' // 이벤트의 종료 시간
        style={{ height: 1000, width: '100%' }} // ✅ 가로 폭을 전체 너비로 조정
        views={['month']}
        defaultView='month'
        defaultDate={new Date()} // 기본 날짜를 현재 날짜로 설정
        onSelectEvent={handleSelectEvent} // 클릭 시 상세 정보 표시
        eventPropGetter={eventPropGetter} // ✅ 이벤트 스타일 적용 (겹침 해결)
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
      {/* 방송 상세 정보 (토글 적용) */}
      {selectedBroadcast && (
        <div className='bg-white border rounded-lg shadow-md p-6 mt-6 max-w-2xl mx-auto'>
          <h3 className='text-lg font-bold mb-4'>📢 방송 상세 정보</h3>
          <p>
            <strong>방송 제목:</strong> {selectedBroadcast.title}
          </p>
          <p>
            <strong>설명:</strong> {selectedBroadcast.content}
          </p>
          <p>
            <strong>방송 시간:</strong>{' '}
            {moment(selectedBroadcast.startAt, 'YYYYMMDD HHmmss').format('YYYY-MM-DD HH:mm')} ~{' '}
            {moment(selectedBroadcast.endAt, 'YYYYMMDD HHmmss').format('YYYY-MM-DD HH:mm')}
          </p>
          <p>
            <strong>판매자:</strong> {selectedBroadcast.createdUser.split(' ')[1]}
          </p>
          <p
            className='inline-block px-3 py-1 rounded-md text-white'
            style={{ backgroundColor: getStatusColor(selectedBroadcast.castStatus) }}
          >
            <strong>상태:</strong> {selectedBroadcast.castStatus}
          </p>
        </div>
      )}
    </div>
  )
}

export default LiveCalendar
