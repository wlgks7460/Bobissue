import React, { useState } from 'react'
import dayjs from 'dayjs'

const SearchFilter = ({ onSearch }) => {
  const [name, setName] = useState('')
  const [categoryNo, setCategoryNo] = useState('')
  const [companyNo, setCompanyNo] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState(dayjs().format('YYYY-MM-DD'))

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
    <div className='w-[1000px] p-6 bg-white border border-gray-300 rounded-lg'>
      {/* 카테고리 선택 */}
      <div className='flex flex-col mb-4'>
        <label className='text-center block text-gray-700 font-medium mb-1'>📂 상품 카테고리</label>
        <select
          name='categoryNo'
          value={categoryNo}
          onChange={(e) => setCategoryNo(e.target.value)}
          className='w-[250px] p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400'
        >
          <option value=''>분류별 찾기</option>
          <option value='1'>상품명</option>
          <option value='2'>상품카테고리리</option>
          <option value='3'>카테고리 3</option>
          <option value='4'>카테고리 4</option>
        </select>
      </div>

      {/* 검색어 입력 */}
      <div className='flex flex-wrap border-b pb-4 mb-4 gap-6'>
        <div className='flex flex-col'>
          <label className='text-center block text-gray-700 font-medium mb-1'>상품명</label>
          <input
            className='w-[250px] p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400'
            type='text'
            placeholder='상품명을 입력하세요'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className='flex flex-col'>
          <label className='block text-gray-700 font-medium mb-1'>회사 번호</label>
          <input
            className='w-[250px] p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400'
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
