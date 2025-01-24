import React from 'react'
import Breadcrumb from '../common/Breadcrumb'

const LiveEnded = () => {
  // Breadcrumb에 사용할 경로 데이터
  const breadcrumbPaths = [
    { name: 'Home' }, // 홈
    { name: '라이브커머스 관리' },
    { name: '라이브운영' },
    { name: '종료된라이브' },
  ]
  const endedStreams = [
    { id: 1, title: '가맹점몰 라이브', viewers: 300, replayLink: '#' },
    { id: 2, title: '한글몰 라이브', viewers: 250, replayLink: '#' },
  ]

  return (
    <div className='p-6'>
      {/* Breadcrumb */}
      <Breadcrumb paths={breadcrumbPaths} />
      <h2 className='text-2xl font-bold mb-6'>종료된 라이브</h2>
      <table className='table-auto w-full border'>
        <thead>
          <tr className='bg-gray-100'>
            <th className='border px-4 py-2'>번호</th>
            <th className='border px-4 py-2'>제목</th>
            <th className='border px-4 py-2'>총 시청자 수</th>
            <th className='border px-4 py-2'>작업</th>
          </tr>
        </thead>
        <tbody>
          {endedStreams.map((stream) => (
            <tr key={stream.id}>
              <td className='border px-4 py-2 text-center'>{stream.id}</td>
              <td className='border px-4 py-2'>{stream.title}</td>
              <td className='border px-4 py-2 text-center'>{stream.viewers}</td>
              <td className='border px-4 py-2 text-center'>
                <a href={stream.replayLink} className='text-blue-500 underline hover:text-blue-700'>
                  다시보기
                </a>
                <button className='bg-gray-500 text-white px-3 py-1 ml-2 rounded hover:bg-gray-600'>
                  통계 보기
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default LiveEnded
