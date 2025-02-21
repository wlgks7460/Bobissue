import React from 'react'
import { useNavigate } from 'react-router-dom'
import Breadcrumb from '../common/Breadcrumb'

const LiveInProgress = () => {
  const navigate = useNavigate()

  // Breadcrumb에 사용할 경로 데이터
  const breadcrumbPaths = [
    { name: 'Home' }, // 홈
    { name: '라이브커머스 관리' },
    { name: '라이브운영' }, // 현재 페이지
    { name: '진행중 라이브' },
  ]

  const liveStreams = [
    { id: 1, title: '가맹점몰 라이브', viewers: 150, status: '진행 중' },
    { id: 2, title: '한글몰 라이브', viewers: 200, status: '진행 중' },
  ]
  const handleMonitorClick = () => {
    navigate('/admin/live/monitor')
  }
  return (
    <div className='p-6'>
      {/* Breadcrumb */}
      <Breadcrumb paths={breadcrumbPaths} />
      <h2 className='text-2xl font-bold mb-6'>진행중 라이브</h2>
      <table className='table-auto w-full border'>
        <thead>
          <tr className='bg-gray-100'>
            <th className='border px-4 py-2'>번호</th>
            <th className='border px-4 py-2'>제목</th>
            <th className='border px-4 py-2'>시청자 수</th>
            <th className='border px-4 py-2'>상태</th>
            <th className='border px-4 py-2'>작업</th>
          </tr>
        </thead>
        <tbody>
          {liveStreams.map((stream) => (
            <tr key={stream.id}>
              <td className='border px-4 py-2 text-center'>{stream.id}</td>
              <td className='border px-4 py-2'>{stream.title}</td>
              <td className='border px-4 py-2 text-center'>{stream.viewers}</td>
              <td className='border px-4 py-2 text-center'>{stream.status}</td>
              <td className='border px-4 py-2 text-center'>
                <button className='bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600'>
                  종료
                </button>
                <button
                  className='bg-green-500 text-white px-3 py-1 ml-2 rounded hover:bg-green-600'
                  onClick={handleMonitorClick}
                >
                  모니터링
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default LiveInProgress
