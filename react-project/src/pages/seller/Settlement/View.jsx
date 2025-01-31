import React from 'react'
import { useLocation } from 'react-router-dom'

const SettlementDetail = () => {
  const location = useLocation()
  const query = new URLSearchParams(location.search)
  const settlementId = query.get('id')

  // 정산 ID로 세부 정보 가져오기 (가상 데이터)
  const settlementDetail = {
    id: settlementId,
    date: '2025-01-10',
    amount: 300000,
    type: '수익',
    status: '정산 완료',
    details: '해당 정산은 월별 매출에서 자동 계산되었습니다.',
  }

  return (
    <div className='p-6 bg-gray-100 min-h-screen'>
      <div className='mb-6'>
        <h1 className='text-2xl font-bold text-gray-800'>정산 상세 정보</h1>
        <p className='text-sm text-gray-600'>정산 ID: {settlementDetail.id}</p>
      </div>
      <div className='bg-white shadow rounded-md p-6'>
        <p>
          <strong>날짜:</strong> {settlementDetail.date}
        </p>
        <p>
          <strong>금액:</strong> ₩{settlementDetail.amount.toLocaleString()}
        </p>
        <p>
          <strong>유형:</strong> {settlementDetail.type}
        </p>
        <p>
          <strong>상태:</strong> {settlementDetail.status}
        </p>
        <p>
          <strong>세부 정보:</strong> {settlementDetail.details}
        </p>
      </div>
    </div>
  )
}

export default SettlementDetail
