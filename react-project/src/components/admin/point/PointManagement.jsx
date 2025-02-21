import React, { useState } from 'react'
import Breadcrumb from '../common/Breadcrumb'

const PointManagement = () => {
  // Breadcrumb에 사용할 경로 데이터
  const breadcrumbPaths = [{ name: 'Home' }, { name: '포인트관리' }]

  // 상태 관리
  const [searchType, setSearchType] = useState('아이디')
  const [searchInput, setSearchInput] = useState('')
  const [dateRange, setDateRange] = useState({ start: '', end: '' })

  return (
    <div className='p-6'>
      {/* Breadcrumb */}
      <Breadcrumb paths={breadcrumbPaths} />

      <h1 className='text-2xl font-bold mb-6'>포인트 관리</h1>

      {/* 기본검색 섹션 */}
      <section className='mb-6'>
        <h2 className='text-lg font-semibold mb-4'>| 기본검색</h2>

        {/* 검색어 */}
        <div className='flex items-center mb-4 space-x-4'>
          <div>
            <label className='block text-sm font-medium mb-1'>검색어</label>
            <select
              className='border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500'
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
            >
              <option value='아이디'>아이디</option>
            </select>
          </div>
          <div className='flex-1'>
            <label className='block text-sm font-medium mb-1'>검색 입력</label>
            <input
              type='text'
              className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500'
              placeholder='검색어를 입력하세요'
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
        </div>

        {/* 기간 검색 */}
        <div className='flex items-center mb-4 space-x-4'>
          <div>
            <label className='block text-sm font-medium mb-1'>시작 날짜</label>
            <input
              type='date'
              className='border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500'
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
            />
          </div>
          <span className='text-gray-500'>~</span>
          <div>
            <label className='block text-sm font-medium mb-1'>종료 날짜</label>
            <input
              type='date'
              className='border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500'
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
            />
          </div>
        </div>

        {/* 조회 버튼 */}
        <div>
          <button className='bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600'>
            조회
          </button>
        </div>
      </section>

      {/* 조회 결과 섹션 */}
      <section>
        <h2 className='text-lg font-semibold mb-4'>조회 결과</h2>
        <div className='w-full h-64 bg-gray-200 flex items-center justify-center'>
          <span className='text-gray-500'>조회 결과를 여기에 표시합니다.</span>
        </div>
      </section>
    </div>
  )
}

export default PointManagement
