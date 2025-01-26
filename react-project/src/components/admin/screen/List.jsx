import React from 'react'
import Breadcrumb from '../common/Breadcrumb'

const EventBannerListComponent = () => {
  // Breadcrumb에 사용할 경로 데이터
  const breadcrumbPaths = [
    { name: 'Home' }, // 홈
    { name: '컨텐츠관리' },
    { name: '화면관리' },
    { name: '이벤트배너조회' },
  ]

  // 배너 데이터 (샘플 데이터)
  const banners = [
    {
      id: 1,
      title: '새해 이벤트',
      startDate: '2025-01-01',
      endDate: '2025-01-31',
      content: '새해를 맞아 특별한 할인 이벤트를 제공합니다.',
      image: 'image1.jpg',
      remarks: '메인 페이지 상단 배너',
    },
    {
      id: 2,
      title: '봄맞이 할인',
      startDate: '2025-03-01',
      endDate: '2025-03-31',
      content: '따뜻한 봄을 맞아 전 상품 20% 할인!',
      image: 'image2.jpg',
      remarks: '봄 시즌 특별 배너',
    },
  ]

  return (
    <div className='p-6'>
      {/* Breadcrumb */}
      <Breadcrumb paths={breadcrumbPaths} />
      <h1 className='text-2xl font-bold mb-6'>이벤트배너 조회</h1>

      <h2 className='text-lg font-semibold mb-4'>| 이벤트 배너 목록</h2>
      <table className='table-auto w-full border'>
        <thead>
          <tr className='bg-gray-100'>
            <th className='border px-4 py-2'>번호</th>
            <th className='border px-4 py-2'>배너 제목</th>
            <th className='border px-4 py-2'>시작일</th>
            <th className='border px-4 py-2'>종료일</th>
            <th className='border px-4 py-2'>내용</th>
            <th className='border px-4 py-2'>이미지</th>
            <th className='border px-4 py-2'>비고</th>
          </tr>
        </thead>
        <tbody>
          {banners.map((banner) => (
            <tr key={banner.id}>
              <td className='border px-4 py-2 text-center'>{banner.id}</td>
              <td className='border px-4 py-2'>{banner.title}</td>
              <td className='border px-4 py-2 text-center'>{banner.startDate}</td>
              <td className='border px-4 py-2 text-center'>{banner.endDate}</td>
              <td className='border px-4 py-2'>{banner.content}</td>
              <td className='border px-4 py-2 text-center'>
                <img
                  src={banner.image}
                  alt={banner.title}
                  className='w-16 h-16 object-cover mx-auto'
                />
              </td>
              <td className='border px-4 py-2'>{banner.remarks}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default EventBannerListComponent
