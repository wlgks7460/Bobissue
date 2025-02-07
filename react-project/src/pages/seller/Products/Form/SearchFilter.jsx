import React, { useState } from 'react'
import dayjs from 'dayjs' // 날짜 계산을 위한 라이브러리

const SearchFilter = ({ onSearch }) => {
  const [name, setName] = useState('')
  const [categoryNo, setCategoryNo] = useState('')
  const [companyNo, setCompanyNo] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState(dayjs().format('YYYY-MM-DD')) // 오늘 날짜 기본값

  // 🏷️ 기간 선택 버튼 클릭 시 자동 날짜 설정
  const handleQuickDateSelect = (days) => {
    setStartDate(dayjs().subtract(days, 'day').format('YYYY-MM-DD'))
    setEndDate(dayjs().format('YYYY-MM-DD')) // 오늘 날짜로 설정
  }

  // 🔍 검색 버튼 클릭 시 부모 컴포넌트로 검색 조건 전달
  const handleInquirySubmit = () => {
    const filters = {
      name,
      categoryNo,
      companyNo,
      startDate,
      endDate,
    }

    onSearch(filters)
  }

  return (
    <div className='w-[1000px] p-6 bg-white border border-gray-300 rounded-lg'>
      {/* 검색어 입력 */}
      <div className='flex flex-wrap border-b pb-4 mb-4 gap-6'>
        {/* 상품명 입력 */}
        <div className='flex flex-col'>
          <label className='block text-gray-700 font-medium mb-1'>📌 상품명</label>
          <input
            className='w-[250px] p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400'
            type='text'
            placeholder='상품명을 입력하세요'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* 카테고리 입력 */}
        <div className='flex flex-col'>
          <label className='block text-gray-700 font-medium mb-1'>📂 상품 카테고리</label>
          <input
            className='w-[250px] p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400'
            type='number'
            placeholder='카테고리 번호 입력'
            value={categoryNo}
            onChange={(e) => setCategoryNo(e.target.value)}
          />
        </div>

        {/* 회사 번호 입력 */}
        <div className='flex flex-col'>
          <label className='block text-gray-700 font-medium mb-1'>🏢 회사 번호</label>
          <input
            className='w-[250px] p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400'
            type='number'
            placeholder='회사 번호 입력'
            value={companyNo}
            onChange={(e) => setCompanyNo(e.target.value)}
          />
        </div>
      </div>

      {/* 기간 설정 (시작일 & 종료일) */}
      <div className='border-b pb-4 mb-4'>
        <label className='block text-gray-700 font-medium mb-1'>📅 검색 기간</label>
        <div className='flex flex-wrap gap-3 mb-3'>
          <button
            className='px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300'
            onClick={() => handleQuickDateSelect(1)}
          >
            1일
          </button>
          <button
            className='px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300'
            onClick={() => handleQuickDateSelect(7)}
          >
            7일
          </button>
          <button
            className='px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300'
            onClick={() => handleQuickDateSelect(30)}
          >
            30일
          </button>
          <button
            className='px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300'
            onClick={() => handleQuickDateSelect(90)}
          >
            90일
          </button>
          <button
            className='px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300'
            onClick={() => handleQuickDateSelect(180)}
          >
            180일
          </button>
          <button
            className='px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300'
            onClick={() => handleQuickDateSelect(365)}
          >
            1년
          </button>
        </div>

        <div className='flex gap-4'>
          {/* 시작일 입력 */}
          <div className='flex flex-col'>
            <label className='block text-gray-700 font-medium mb-1'>시작 날짜</label>
            <input
              className='w-[200px] p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400'
              type='date'
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          {/* 종료일 입력 */}
          <div className='flex flex-col'>
            <label className='block text-gray-700 font-medium mb-1'>종료 날짜</label>
            <input
              className='w-[200px] p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400'
              type='date'
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* 검색 버튼 */}
      <button
        className='w-[200px] p-3 bg-blue-500 text-white rounded hover:bg-blue-600'
        onClick={handleInquirySubmit}
      >
        🔍 검색하기
      </button>
    </div>
  )
}

export default SearchFilter
