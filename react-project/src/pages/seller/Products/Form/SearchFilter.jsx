import React, { useState } from 'react'

const SearchFilter = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [selectedDateRange, setSelectedDateRange] = useState('')
  const [customStartDate, setCustomStartDate] = useState('')
  const [customEndDate, setCustomEndDate] = useState('')
  const [productState, setProductState] = useState('')

  // 기간 설정 버튼 핸들러
  const handleDateRangeClick = (days) => {
    const today = new Date()
    const pastDate = new Date()
    pastDate.setDate(today.getDate() - days)

    setCustomStartDate(pastDate.toISOString().split('T')[0])
    setCustomEndDate(today.toISOString().split('T')[0])
    setSelectedDateRange(days)
  }

  // 검색 버튼 클릭 시 부모 컴포넌트로 검색 조건 전달
  const handleInquirySubmit = () => {
    const filters = {
      search: searchTerm,
      companyName: companyName,
      status: productState,
      startDate: customStartDate,
      endDate: customEndDate,
    }

    onSearch(filters)
  }

  return (
    <div className='w-[800px]  p-6 bg-white border border-gray-300 rounded-lg'>
      {/* 검색어 입력 */}
      <div className='flex border-b pb-4 mb-4'>
        <div className='mr-6'>
          <label className='block text-gray-700 font-medium mb-1'>📌 등록상품명</label>
          <input
            className='w-[350px] p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400'
            type='text'
            placeholder='등록상품명을 입력하세요'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div>
          <label className='block text-gray-700 font-medium mb-1'>🏢 회사명</label>
          <input
            className='w-[350px] p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400'
            type='text'
            placeholder='회사명을 입력하세요'
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />
        </div>
      </div>

      {/* 판매 상태 */}
      <div className='border-b pb-4 mb-4'>
        <label className='block text-gray-700 font-medium mb-1'>📦 판매 상태</label>
        <select
          className='w-[400px] p-3 border border-gray-300 rounded'
          value={productState}
          onChange={(e) => setProductState(e.target.value)}
        >
          <option value=''>판매 상태 선택</option>
          <option value='판매중'>판매중</option>
          <option value='판매완료'>판매완료</option>
        </select>
      </div>

      {/* 기간 선택 */}
      <div className='border-b pb-4 mb-4'>
        <label className='block text-gray-700 font-medium mb-1'>📅 기간 선택</label>
        <div className='flex space-x-2'>
          <button
            className={`px-4 py-2 w-[120px] rounded border border-gray-300 ${
              selectedDateRange === 0 ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
            onClick={() => handleDateRangeClick(0)}
          >
            오늘
          </button>
          <button
            className={`px-4 py-2 w-[120px] rounded border border-gray-300 ${
              selectedDateRange === 7 ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
            onClick={() => handleDateRangeClick(7)}
          >
            7일
          </button>
          <button
            className={`px-4 py-2 w-[120px] rounded border border-gray-300 ${
              selectedDateRange === 30 ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
            onClick={() => handleDateRangeClick(30)}
          >
            30일
          </button>
          <button
            className={`px-4 py-2 w-[120px] rounded border border-gray-300 ${
              selectedDateRange === 180 ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
            onClick={() => handleDateRangeClick(180)}
          >
            180일
          </button>
          <button
            className={`px-4 py-2 w-[120px] rounded border border-gray-300 ${
              selectedDateRange === 365 ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
            onClick={() => handleDateRangeClick(365)}
          >
            1년
          </button>
        </div>
      </div>

      {/* 특정 기간 설정 */}
      <div className='flex space-x-4 border-b pb-4 mb-4'>
        <div>
          <label className='block text-gray-700 font-medium mb-1'>📆 시작 날짜</label>
          <input
            className='w-[180px] p-2 border border-gray-300 rounded'
            type='date'
            value={customStartDate}
            onChange={(e) => setCustomStartDate(e.target.value)}
          />
        </div>

        <div>
          <label className='block text-gray-700 font-medium mb-1'>📆 종료 날짜</label>
          <input
            className='w-[180px] p-2 border border-gray-300 rounded'
            type='date'
            value={customEndDate}
            onChange={(e) => setCustomEndDate(e.target.value)}
          />
        </div>
      </div>

      {/* 검색 버튼 */}
      <button
        className='w-full p-3 bg-blue-500 text-white rounded hover:bg-blue-600'
        onClick={handleInquirySubmit}
      >
        🔍 검색하기
      </button>
    </div>
  )
}

export default SearchFilter
