import React from 'react'

const ProductDate = ({ product, setProduct }) => {
  // 날짜 값을 `YYYY-MM-DD` 형식으로 변환하는 함수
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
    <div className='mt-5'>
      <h2 className='text-[16px] font-bold'>판매 종료일</h2>
      <input
        className='w-[200px] mt-3 p-1 border-b  border-black'
        type='date'
        value={formatDate(product.expiredAt)} // 날짜 변환 후 표시
        onChange={(e) => setProduct((prev) => ({ ...prev, expiredAt: e.target.value }))} // 상태 업데이트
      />
    </div>
  )
}

export default ProductDate
