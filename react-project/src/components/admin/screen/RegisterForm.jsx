import React from 'react'
import Breadcrumb from '../common/Breadcrumb'

const EventBannerFormComponent = () => {
  // Breadcrumb에 사용할 경로 데이터
  const breadcrumbPaths = [
    { name: 'Home', link: '/' }, // 홈
    { name: '컨텐츠관리', link: '/content' },
    { name: '화면관리', link: '/screen-management' },
    { name: '이벤트배너등록' },
  ]

  return (
    <div className='p-6'>
      {/* Breadcrumb */}
      <Breadcrumb paths={breadcrumbPaths} />
      <h1 className='text-2xl font-bold mb-6'>이벤트배너 등록</h1>
      <h2 className='text-lg font-semibold mb-4'>| 신규 등록</h2>
      <form>
        <div className='grid grid-cols-2 gap-4'>
          {/* 배너 제목 */}
          <div>
            <label className='block text-sm font-medium mb-1'>배너 제목</label>
            <input
              type='text'
              placeholder='배너 제목을 입력하세요'
              className='w-full border border-gray-300 rounded px-3 py-2'
            />
          </div>
          {/* 시작일 */}
          <div>
            <label className='block text-sm font-medium mb-1'>시작일</label>
            <input type='date' className='w-full border border-gray-300 rounded px-3 py-2' />
          </div>
          {/* 종료일 */}
          <div>
            <label className='block text-sm font-medium mb-1'>종료일</label>
            <input type='date' className='w-full border border-gray-300 rounded px-3 py-2' />
          </div>
          {/* 이미지 업로드 */}
          <div className='col-span-2'>
            <label className='block text-sm font-medium mb-1'>이미지 업로드</label>
            <input type='file' className='w-full border border-gray-300 rounded px-3 py-2' />
          </div>
          {/* 배너 내용 */}
          <div className='col-span-2'>
            <label className='block text-sm font-medium mb-1'>배너 내용</label>
            <textarea
              placeholder='배너에 표시될 내용을 입력하세요'
              className='w-full border border-gray-300 rounded px-3 py-2'
              rows='4'
            ></textarea>
          </div>
          {/* 비고 */}
          <div className='col-span-2'>
            <label className='block text-sm font-medium mb-1'>비고</label>
            <textarea
              placeholder='비고 사항을 입력하세요'
              className='w-full border border-gray-300 rounded px-3 py-2'
              rows='3'
            ></textarea>
          </div>
        </div>
        <div className='mt-6'>
          <button className='border border-blue-500 text-blue-500 px-6 py-2 rounded hover:bg-blue-500 hover:text-white transition'>
            등록하기
          </button>
        </div>
      </form>
    </div>
  )
}

export default EventBannerFormComponent
