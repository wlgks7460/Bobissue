import React from 'react'
import Breadcrumb from '../common/Breadcrumb'

const ViewerManagement = () => {
  // Breadcrumb에 사용할 경로 데이터
  const breadcrumbPaths = [
    { name: 'Home' }, // 홈
    { name: '라이브커머스 관리' },
    { name: '라이브운영' }, // 현재 페이지
    { name: '시청자관리' },
  ]

  // 시청자 데이터
  const viewers = [
    { id: 1, name: '홍길동', stream: '가맹점몰 라이브', watchTime: '30분', actions: '경고' },
    { id: 2, name: '김철수', stream: '한글몰 라이브', watchTime: '15분', actions: '정상' },
  ]

  // 제재받은 시청자 데이터
  const restrictedViewers = [
    {
      id: 1,
      name: '홍길동',
      username: 'hong123',
      reason: '라이브 중 욕설',
      penalty: '라이브 채팅 금지 6개월',
    },
    {
      id: 2,
      name: '이영희',
      username: 'younglee',
      reason: '부적절한 닉네임 사용',
      penalty: '닉네임 변경 요청',
    },
  ]

  return (
    <div className='p-6'>
      {/* Breadcrumb */}
      <Breadcrumb paths={breadcrumbPaths} />
      <h2 className='text-2xl font-bold mb-6'>시청자 관리</h2>

      {/* 제재받은 시청자 목록 */}
      <h3 className='text-md font-semibold mb-4'>| 제재받은 시청자 목록</h3>
      <table className='table-auto w-full border'>
        <thead>
          <tr className='bg-red-100'>
            <th className='border px-4 py-2'>번호</th>
            <th className='border px-4 py-2'>이름</th>
            <th className='border px-4 py-2'>아이디</th>
            <th className='border px-4 py-2'>제재 사유</th>
            <th className='border px-4 py-2'>제재 내용</th>
          </tr>
        </thead>
        <tbody>
          {restrictedViewers.map((viewer) => (
            <tr key={viewer.id}>
              <td className='border px-4 py-2 text-center'>{viewer.id}</td>
              <td className='border px-4 py-2'>{viewer.name}</td>
              <td className='border px-4 py-2 text-center'>{viewer.username}</td>
              <td className='border px-4 py-2'>{viewer.reason}</td>
              <td className='border px-4 py-2'>{viewer.penalty}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ViewerManagement
