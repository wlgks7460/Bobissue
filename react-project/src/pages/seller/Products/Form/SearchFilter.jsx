import React, { useState } from 'react'

const SearchFilter = ({ onSearch }) => {
  const [name, setName] = useState('')
  const [categoryNo, setCategoryNo] = useState('')
  const [companyNo, setCompanyNo] = useState('')

  // 검색 버튼 클릭 시 부모 컴포넌트로 검색 조건 전달
  const handleInquirySubmit = () => {
    const filters = {
      name,
      categoryNo,
      companyNo,
    }

    onSearch(filters)
  }

  return (
    <div className='w-[1000px] p-6 bg-white border border-gray-300 rounded-lg'>
      {/* 검색어 입력 */}
      <div className='flex border-b pb-4 mb-4'>
        <div className='mr-6'>
          <label className='block text-gray-700 font-medium mb-1'>📌 상품명</label>
          <input
            className='w-[250px] p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400'
            type='text'
            placeholder='상품명을 입력하세요'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className='mr-6'>
          <label className='block text-gray-700 font-medium mb-1'>📂 상품 카테고리</label>
          <input
            className='w-[250px] p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400'
            type='number'
            placeholder='카테고리 번호 입력'
            value={categoryNo}
            onChange={(e) => setCategoryNo(e.target.value)}
          />
        </div>

        <div>
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
