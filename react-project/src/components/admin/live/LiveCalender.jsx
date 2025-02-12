import React, { useState, useEffect } from 'react'
import Breadcrumb from '../common/Breadcrumb'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import moment from 'moment'
import 'moment/locale/ko'
import API from '../../../utils/API'

moment.locale('ko') // 한국어 설정
const localizer = momentLocalizer(moment)

const LiveCalender = () => {
  // Breadcrumb 경로 설정
  const breadcrumbPaths = [
    { name: 'Home' },
    { name: '라이브커머스 관리' },
    { name: '라이브커머스 일정관리' },
  ]

  // ✅ 캘린더 이벤트 저장 (대기 상태 방송 + 더미 데이터)
  const [events, setEvents] = useState([])
  // ✅ 선택한 방송 상세 정보 저장
  const [selectedBroadcast, setSelectedBroadcast] = useState(null)

  // ✅ 더미 데이터 추가
  const dummyEvents = [
    {
      title: '더미 회사 A',
      start: new Date(2025, 1, 16, 14, 0), // 2025년 2월 16일 14:00 시작
      end: new Date(2025, 1, 16, 16, 0), // 2025년 2월 16일 16:00 종료
      broadcast: {
        title: '테스트 방송 A',
        content: '테스트용 방송 설명입니다.',
        startAt: '20250216 140000',
        endAt: '20250216 160000',
        createdUser: 'SELLER dummyA@company.com',
      },
    },
    {
      title: '더미 회사 B',
      start: new Date(2025, 1, 18, 18, 0), // 2025년 2월 18일 18:00 시작
      end: new Date(2025, 1, 18, 20, 0), // 2025년 2월 18일 20:00 종료
      broadcast: {
        title: '테스트 방송 B',
        content: '테스트용 방송 설명입니다.',
        startAt: '20250218 180000',
        endAt: '20250218 200000',
        createdUser: 'SELLER dummyB@company.com',
      },
    },
  ]

  // ✅ "대기" 상태인 방송 조회
  useEffect(() => {
    const fetchBroadcasts = async () => {
      try {
        const response = await API.get('/cast')
        console.log('📌 방송 데이터:', response.data)

        // "대기" 상태 방송 필터링
        const waitingBroadcasts =
          response.data?.result?.data.filter((broadcast) => broadcast.castStatus === '대기') || []

        // 캘린더 이벤트로 변환
        const formattedEvents = waitingBroadcasts.map((broadcast) => ({
          title: broadcast.createdUser.split(' ')[1], // 회사명 (SELLER 제외)
          start: moment(broadcast.startAt, 'YYYYMMDD HHmmss').toDate(), // 시작 시간
          end: moment(broadcast.endAt, 'YYYYMMDD HHmmss').toDate(), // 종료 시간
          broadcast, // 상세 정보를 저장하여 클릭 시 활용
        }))

        // ✅ 더미 데이터 + API 데이터 합치기
        setEvents([...formattedEvents, ...dummyEvents])
      } catch (error) {
        console.error('❌ 방송 일정 불러오기 실패:', error)
        // API 호출 실패 시 더미 데이터만 사용
        setEvents(dummyEvents)
      }
    }

    fetchBroadcasts()
  }, [])

  // ✅ 이벤트 클릭 시 상세 정보 표시
  const handleSelectEvent = (event) => {
    setSelectedBroadcast(event.broadcast)
  }

  return (
    <div className='p-6'>
      {/* Breadcrumb */}
      <Breadcrumb paths={breadcrumbPaths} />
      <h2 className='text-2xl font-bold mb-6'>📅 라이브커머스 일정관리</h2>

      {/* 캘린더 컴포넌트 */}
      <div className='bg-white border rounded-lg shadow-md p-4 mb-6'>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor='start'
          endAccessor='end'
          style={{ height: 800 }}
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

      {/* 방송 상세 정보 */}
      {selectedBroadcast && (
        <div className='bg-white border rounded-lg shadow-md p-4'>
          <h3 className='text-lg font-bold mb-2'>📢 방송 상세 정보</h3>
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
            <strong>회사명:</strong> {selectedBroadcast.createdUser.split(' ')[1]}
          </p>
        </div>
      )}
    </div>
  )
}

export default LiveCalender
