import React, { useState } from 'react'

const SearchFilter = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [selectedDateRange, setSelectedDateRange] = useState('')
  const [customStartDate, setCustomStartDate] = useState('')
  const [customEndDate, setCustomEndDate] = useState('')
  const [productState, setProductState] = useState('')

  const handleDateRangeClick = (days) => {
    const today = new Date()
    const pastDate = new Date()
    pastDate.setDate(today.getDate() - days)

    setCustomStartDate(pastDate.toISOString().split('T')[0])
    setCustomEndDate(today.toISOString().split('T')[0])
    setSelectedDateRange(days)
  }

  const handleInquirySubmit = () => {
    const filters = {
      search: searchTerm,
      startDate: customStartDate,
      endDate: customEndDate,
      productState,
    }

    onSearch(filters)
  }

  return (
    <div className=' p-6 bg-white border border-gray-200 rounded-md'>
      <div className='mb-4'>
        <label className='block text-sm text-gray-700 mb-1'>📦정산상태</label>
        <select
          className='w-full p-2 border border-gray-300 rounded-md text-sm'
          value={productState}
          onChange={(e) => setProductState(e.target.value)}
        >
          <option value=''>정산 상태 선택</option>
          <option value='판매중'>정산중</option>
          <option value='판매완료'>정산완료</option>
        </select>
      </div>

      {/* 기간 선택 */}
      <div className='mb-4'>
        <label className='block text-sm text-gray-700 mb-1'>기간 선택</label>
        <div className=' space-x-2'>
          {[0, 7, 30, 180, 365].map((days) => (
            <button
              key={days}
              className={`w-1/6 py-1 text-sm rounded-[10px] border border-gray-300 ${
                selectedDateRange === days ? 'bg-blue-500 text-white' : 'bg-stone-200'
              }`}
              onClick={() => handleDateRangeClick(days)}
            >
              {days === 0 ? '오늘' : `${days}일`}
            </button>
          ))}
        </div>
      </div>

      {/* 특정 기간 설정 */}
      <div className='mb-4 flex space-x-4'>
        <div className='flex-1'>
          <label className='block text-sm text-gray-700 mb-1'>📆 시작</label>
          <input
            className='w-full p-2 border border-gray-300 rounded-md text-sm'
            type='date'
            value={customStartDate}
            onChange={(e) => setCustomStartDate(e.target.value)}
          />
        </div>

        <div className='flex-1'>
          <label className='block text-sm text-gray-700 mb-1'>📆 종료</label>
          <input
            className='w-full p-2 border border-gray-300 rounded-md text-sm'
            type='date'
            value={customEndDate}
            onChange={(e) => setCustomEndDate(e.target.value)}
          />
        </div>
      </div>

      {/* 검색 버튼 */}
      <button
        className='w-full p-2 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600 transition-colors'
        onClick={handleInquirySubmit}
      >
        🔍 검색하기
      </button>
    </div>
  )
}

export default SearchFilter
