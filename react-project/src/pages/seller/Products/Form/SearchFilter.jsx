import React, { useState } from 'react'
import dayjs from 'dayjs'

const SearchFilter = ({ onSearch }) => {
  const [searchType, setSearchType] = useState('name') // 기본 검색 타입: 상품명
  const [searchValue, setSearchValue] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState(dayjs().format('YYYY-MM-DD'))

  const handleQuickDateSelect = (days) => {
    setStartDate(dayjs().subtract(days, 'day').format('YYYY-MM-DD'))
    setEndDate(dayjs().format('YYYY-MM-DD'))
  }

  const handleInquirySubmit = () => {
    const filters = {
      [searchType]: searchValue, // 선택한 검색 유형에 따라 동적 필터 적용
      startDate,
      endDate,
    }
    onSearch(filters)
  }

  return (
    <div className='w-full p-6 bg-white border border-gray-400 rounded-lg shadow-md'>
      {/* ✅ 검색 기준 및 입력 필드 */}
      <div className='flex flex-col lg:flex-row items-center gap-4 mb-6'>
        {/* 검색 기준 선택 */}
        <div className='flex items-center gap-2'>
          <label className='text-gray-800 font-semibold'>검색 기준</label>
          <select
            name='searchType'
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            className='w-[200px] p-2 border border-gray-400 rounded focus:ring-2 focus:ring-blue-400'
          >
            <option value='name'>상품명</option>
            <option value='companyNo'>회사번호</option>
          </select>
        </div>

        {/* 검색 입력 */}
        <input
          className='w-full lg:w-[300px] p-2 border border-gray-400 rounded focus:ring-2 focus:ring-blue-400'
          type={searchType === 'companyNo' ? 'number' : 'text'}
          placeholder={searchType === 'name' ? '상품명을 입력하세요' : '회사 번호 입력'}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </div>

      {/* ✅ 기간 설정 */}
      <div className='mb-6'>
        <label className='block text-gray-800 font-semibold mb-2'>📅 검색 기간</label>
        <div className='flex flex-wrap gap-2 mb-3'>
          {[1, 7, 30, 90, 180, 365].map((days) => (
            <button
              key={days}
              className='px-4 py-2 bg-gray-100 text-gray-800 rounded hover:bg-gray-200'
              onClick={() => handleQuickDateSelect(days)}
            >
              {days === 1 ? '1일' : days === 365 ? '1년' : `${days}일`}
            </button>
          ))}
        </div>

        {/* 날짜 선택 필드 */}
        <div className='flex flex-col lg:flex-row gap-4'>
          <div className='flex flex-col'>
            <label className='block text-gray-800 font-semibold mb-1'>시작 날짜</label>
            <input
              className='w-[200px] p-3 border border-gray-400 rounded focus:ring-2 focus:ring-blue-400'
              type='date'
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div className='flex flex-col'>
            <label className='block text-gray-800 font-semibold mb-1'>종료 날짜</label>
            <input
              className='w-[200px] p-3 border border-gray-400 rounded focus:ring-2 focus:ring-blue-400'
              type='date'
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* ✅ 검색 버튼 (우측 정렬) */}
      <div className='flex justify-end'>
        <button
          className='w-[200px] px-4 py-3 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition'
          onClick={handleInquirySubmit}
        >
          🔍 검색하기
        </button>
      </div>
    </div>
  )
}

export default SearchFilter
