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

  // 신청 데이터 (상품 목록 포함, 신청 시간 추가)
  const [applications, setApplications] = useState([
    {
      id: 1,
      seller: '싸피몰',
      date: '2025-02-01',
      time: '10:00-12:00',
      status: '대기',
      castTime: 120,
      createdAt: '2025-01-20 14:30:00', // 신청한 시각
      products: [
        {
          id: 101,
          name: '닭가슴살 1kg',
          price: '15,000원',
          url: 'https://example.com/product/101',
        },
        {
          id: 102,
          name: '프로틴 쉐이크',
          price: '20,000원',
          url: 'https://example.com/product/102',
        },
      ],
    },
    {
      id: 2,
      seller: '멀티캠퍼스',
      date: '2025-02-03',
      time: '14:00-16:00',
      status: '대기',
      castTime: 120,
      createdAt: '2025-01-21 10:15:00',
      products: [
        { id: 201, name: '유기농 홍삼', price: '35,000원', url: 'https://example.com/product/201' },
      ],
    },
  ])

  // 승인된 라이브 일정 목록
  const [approvedApplications, setApprovedApplications] = useState([])
  // 스케줄러 데이터
  const [events, setEvents] = useState([])

  // 스케줄러에 추가 핸들러
  const handleAddToSchedule = (application) => {
    const start = moment(
      `${application.date}T${application.time.split('-')[0]}`,
      'YYYY-MM-DDTHH:mm',
    )
    const end = start.clone().add(application.castTime, 'minutes')

    const newEvent = {
      title: `${application.seller} - ${application.time}`,
      start: start.toDate(),
      end: end.toDate(),
      products: application.products,
    }

    setEvents((prevEvents) => [...prevEvents, newEvent])
    setApprovedApplications((prevApproved) => [
      ...prevApproved,
      { ...application, status: '승인됨' },
    ])

    // 상태 업데이트 (승인된 항목 제거)
    setApplications((prevApplications) =>
      prevApplications.filter((app) => app.id !== application.id),
    )

    alert(`${application.seller}님에게 라이브 승인 메일을 보냈습니다.`)
  }

  // 사용자 정의 이벤트 스타일 (상품 정보 포함)
  const CustomEvent = ({ event }) => (
    <div>
      <span className='text-xs text-white-700'>{event.title}</span>
      {event.products && (
        <ul className='mt-1 text-xs'>
          {event.products.map((product) => (
            <li key={product.id}>
              <a href={product.url} target='_blank' className='text-blue-400 underline'>
                {product.name}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  )

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
            views={['month', 'week', 'day']}
            defaultView='month'
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
              event: CustomEvent,
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
              <th className='border px-4 py-2'>신청 시각</th>
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
                <td className='border px-4 py-2 text-center'>{application.createdAt}</td>
                <td className='border px-4 py-2 text-center'>
                  <button
                    onClick={() => handleAddToSchedule(application)}
                    className='bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600'
                  >
                    승인하기
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 승인된 라이브 목록 */}
      <div className='mt-8'>
        <h3 className='text-lg font-semibold mb-4'>| 라이브 예정 목록</h3>
        <table className='table-auto w-full border'>
          <thead>
            <tr className='bg-gray-100'>
              <th className='border px-4 py-2'>번호</th>
              <th className='border px-4 py-2'>판매자</th>
              <th className='border px-4 py-2'>날짜</th>
              <th className='border px-4 py-2'>시간대</th>
            </tr>
          </thead>
          <tbody>
            {approvedApplications.map((application) => (
              <tr key={application.id}>
                <td className='border px-4 py-2 text-center'>{application.id}</td>
                <td className='border px-4 py-2'>{application.seller}</td>
                <td className='border px-4 py-2 text-center'>{application.date}</td>
                <td className='border px-4 py-2 text-center'>{application.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default LiveApplicationManagement
