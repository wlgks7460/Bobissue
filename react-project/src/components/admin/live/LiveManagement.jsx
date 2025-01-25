import React, { useState } from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import moment from 'moment'
import 'moment/locale/ko'
import Breadcrumb from '../common/Breadcrumb'

moment.locale('ko') // 한글 버전
const localizer = momentLocalizer(moment)

const LiveApplicationManagement = () => {
  // Breadcrumb에 사용할 경로 데이터
  const breadcrumbPaths = [
    { name: 'Home' }, // 홈
    { name: '라이브커머스관리' },
    { name: '라이브관리(신청/일정)' },
  ]
  // 신청 데이터
  const [applications, setApplications] = useState([
    { id: 1, seller: '가맹점몰', date: '2025-02-01', time: '10:00-12:00', status: '대기' },
    { id: 2, seller: '한글몰', date: '2025-02-03', time: '14:00-16:00', status: '대기' },
  ])

  // 스케줄러 데이터
  const [events, setEvents] = useState([])

  // 스케줄러에 추가 핸들러
  const handleAddToSchedule = (application) => {
    const newEvent = {
      title: `${application.seller} - ${application.time}`,
      start: new Date(`${application.date}T${application.time.split('-')[0]}`),
      end: new Date(`${application.date}T${application.time.split('-')[1]}`),
    }
    setEvents((prevEvents) => [...prevEvents, newEvent])

    // 상태 업데이트
    setApplications((prevApplications) =>
      prevApplications.map((app) =>
        app.id === application.id ? { ...app, status: '승인됨' } : app,
      ),
    )

    // 메일 통보 (가상 함수)
    alert(`${application.seller}님에게 라이브 승인 메일을 보냈습니다.`)
  }

  // 사용자 정의 이벤트 스타일
  const CustomEvent = ({ event }) => <span className='text-xs text-white-700'>{event.title}</span>

  return (
    <div className='p-6'>
      {/* Breadcrumb */}
      <Breadcrumb paths={breadcrumbPaths} />
      <h2 className='text-2xl font-bold mb-6'>라이브관리</h2>

      {/* 스케줄러 */}
      <div className='mb-6'>
        <h3 className='text-lg font-semibold mb-4'>| 라이브 일정</h3>
        <div className='bg-white border rounded-lg shadow-md p-4'>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor='start'
            endAccessor='end'
            style={{ height: 500 }}
            views={['month', 'week', 'day']} // 월, 주, 일 뷰 활성화
            defaultView='month' // 기본 뷰 설정
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
              event: CustomEvent, // 사용자 정의 이벤트 스타일
            }}
          />
        </div>
      </div>

      {/* 신청 목록 */}
      <div>
        <h3 className='text-lg font-semibold mb-4'>| 신청 목록</h3>
        <table className='table-auto w-full border'>
          <thead>
            <tr className='bg-gray-100'>
              <th className='border px-4 py-2'>번호</th>
              <th className='border px-4 py-2'>판매자</th>
              <th className='border px-4 py-2'>날짜</th>
              <th className='border px-4 py-2'>시간대</th>
              <th className='border px-4 py-2'>상태</th>
              <th className='border px-4 py-2'>작업</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((application) => (
              <tr key={application.id}>
                <td className='border px-4 py-2 text-center'>{application.id}</td>
                <td className='border px-4 py-2'>{application.seller}</td>
                <td className='border px-4 py-2 text-center'>{application.date}</td>
                <td className='border px-4 py-2 text-center'>{application.time}</td>
                <td className='border px-4 py-2 text-center'>{application.status}</td>
                <td className='border px-4 py-2 text-center'>
                  {application.status === '대기' && (
                    <button
                      onClick={() => handleAddToSchedule(application)}
                      className='bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600'
                    >
                      승인하기
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default LiveApplicationManagement
