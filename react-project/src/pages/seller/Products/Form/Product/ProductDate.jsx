import React from 'react'

const ProductDate = ({ product, setProduct }) => {
  // 📌 오늘 날짜를 `YYYY-MM-DD` 형식으로 반환하는 함수
  const getTodayDate = () => {
    const today = new Date()
    return today.toISOString().split('T')[0] // YYYY-MM-DD 형식으로 변환
  }

  // 📌 날짜 값을 `YYYY-MM-DD` 형식으로 변환하는 함수
  const formatDate = (dateString) => {
    if (!dateString || dateString === '2099-99-99') return '' // 잘못된 날짜 처리
    if (dateString.includes('-')) return dateString // 이미 YYYY-MM-DD 형식이면 그대로 반환

    // `YYYYMMDD` -> `YYYY-MM-DD` 변환
    if (dateString.length === 8) {
      return `${dateString.slice(0, 4)}-${dateString.slice(4, 6)}-${dateString.slice(6, 8)}`
    }

    return dateString // 변환할 수 없는 경우 원본 유지
  }

  return (
    <div className='w-full mx-auto p-6 shadow-md shadow-coffeeBrown/20 rounded-lg bg-white shadow-md'>
      <h2 className='text-lg font-bold text-gray-900 mb-2'>📆 판매 종료일</h2>
      <input
        className='w-full sm:w-[250px] p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all'
        type='date'
        value={formatDate(product.expiredAt)} // 날짜 변환 후 표시
        min={getTodayDate()} // 📌 오늘 날짜 이전 선택 불가
        onChange={(e) => setProduct((prev) => ({ ...prev, expiredAt: e.target.value }))} // 상태 업데이트
      />
    </div>
  )
}

export default ProductDate
