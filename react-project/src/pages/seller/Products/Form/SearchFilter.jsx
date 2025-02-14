import React, { useState } from 'react'
import dayjs from 'dayjs'

const SearchFilter = ({ onSearch }) => {
  const [name, setName] = useState('')
  const [categoryNo, setCategoryNo] = useState('')
  const [companyNo, setCompanyNo] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState(dayjs().format('YYYY-MM-DD'))
  const [searchType, setSearchType] = useState('name') // 'name' or 'category'
  const [searchQuery, setSearchQuery] = useState('')

  const handleQuickDateSelect = (days) => {
    setStartDate(dayjs().subtract(days, 'day').format('YYYY-MM-DD'))
    setEndDate(dayjs().format('YYYY-MM-DD'))
  }

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
    <div className=' p-6 bg-white border border-gray-300 rounded-lg'>
      {/* 카테고리 선택 */}
      <div className='flex flex-row mb-4 w-full'>
        {/* 검색 타입 선택 (상품명, 상품카테고리) */}
        <select
          name='searchType'
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          className='w-[250px] p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400'
        >
          <option value='name'>상품명</option>
          <option value='category'>상품카테고리</option>
        </select>

        {/* 검색어 입력 */}
        <input
          type='text'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={searchType === 'name' ? '상품명을 입력하세요' : '카테고리 번호를 입력하세요'}
          className='w-[250px] p-2 border border-gray-300 rounded ml-4 focus:ring-2 focus:ring-blue-400'
        />
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
          <div className='flex flex-col'>
            <label className='block text-gray-700 font-medium mb-1'>시작 날짜</label>
            <input
              className='w-[200px] p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400'
              type='date'
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

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
