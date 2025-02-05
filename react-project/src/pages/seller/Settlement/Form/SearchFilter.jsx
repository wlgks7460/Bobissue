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
      companyName: companyName,
      status: productState,
      startDate: customStartDate,
      endDate: customEndDate,
    }

    onSearch(filters)
  }

  return (
    <div className='w-[400px] p-4 bg-white border border-gray-300 rounded-lg'>
      {/* 검색어 입력 */}
      <div className='flex flex-col border-b pb-3 mb-3 space-y-2'>
        <div>
          <label className='block text-gray-700 font-medium text-sm'>📌 등록상품명</label>
          <input
            className='w-full p-2 border border-gray-300 rounded text-sm'
            type='text'
            placeholder='등록상품명'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div>
          <label className='block text-gray-700 font-medium text-sm'>🏢 회사명</label>
          <input
            className='w-full p-2 border border-gray-300 rounded text-sm'
            type='text'
            placeholder='회사명'
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />
        </div>
      </div>

      {/* 판매 상태 */}
      <div className='border-b pb-3 mb-3'>
        <label className='block text-gray-700 font-medium text-sm'>📦 판매 상태</label>
        <select
          className='w-full p-2 border border-gray-300 rounded text-sm'
          value={productState}
          onChange={(e) => setProductState(e.target.value)}
        >
          <option value=''>정산 상태 선택</option>
          <option value='판매중'>정산중</option>
          <option value='판매완료'>정산완료</option>
        </select>
      </div>

      {/* 기간 선택 */}
      <div className='border-b pb-3 mb-3'>
        <label className='block text-gray-700 font-medium text-sm'>📅 기간 선택</label>
        <div className='grid grid-cols-3 gap-2'>
          {[0, 7, 30, 180, 365].map((days) => (
            <button
              key={days}
              className={`px-2 py-1 text-sm rounded border border-gray-300 ${
                selectedDateRange === days ? 'bg-blue-500 text-white' : 'bg-gray-200'
              }`}
              onClick={() => handleDateRangeClick(days)}
            >
              {days === 0 ? '오늘' : `${days}일`}
            </button>
          ))}
        </div>
      </div>

      {/* 특정 기간 설정 */}
      <div className='flex space-x-2 border-b pb-3 mb-3'>
        <div>
          <label className='block text-gray-700 font-medium text-sm'>📆 시작</label>
          <input
            className='w-[100px] p-2 border border-gray-300 rounded text-sm'
            type='date'
            value={customStartDate}
            onChange={(e) => setCustomStartDate(e.target.value)}
          />
        </div>

        <div>
          <label className='block text-gray-700 font-medium text-sm'>📆 종료</label>
          <input
            className='w-[100px] p-2 border border-gray-300 rounded text-sm'
            type='date'
            value={customEndDate}
            onChange={(e) => setCustomEndDate(e.target.value)}
          />
        </div>
      </div>

      {/* 검색 버튼 */}
      <button
        className='w-full p-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600'
        onClick={handleInquirySubmit}
      >
        🔍 검색하기
      </button>
    </div>
  )
}

export default SearchFilter
