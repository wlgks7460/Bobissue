import React from 'react'
import { useNavigate } from 'react-router-dom'
import './Overview.css' // 필요 시 사용자 정의 CSS 추가

const transactions = [
  {
    id: 1,
    date: '2025-01-10',
    amount: 300000,
    type: '수익',
    status: '정산 완료',
    statusColor: 'green',
  },
  {
    id: 2,
    date: '2025-01-12',
    amount: 200000,
    type: '지출',
    status: '검토 중',
    statusColor: 'yellow',
  },
  {
    id: 3,
    date: '2025-01-08',
    amount: 50000,
    type: '지출',
    status: '검토 중',
    statusColor: 'yellow',
  },
]

const Overview = () => {
  const navigate = useNavigate()

  // 14일 이내 데이터 필터링
  const recentTransactions = transactions.filter((transaction) => {
    const today = new Date()
    const transactionDate = new Date(transaction.date)
    const diffInDays = (today - transactionDate) / (1000 * 60 * 60 * 24)
    return diffInDays <= 14
  })

  // 정산 상태 클릭 이벤트
  const handleStatusClick = (id) => {
    navigate(`/seller/settlement/view?id=${id}`)
  }

  return (
    <div className='p-6 bg-gray-100 min-h-screen'>
      {/* Header */}
      <div className='mb-6'>
        <h1 className='text-2xl font-bold text-gray-800'>정산 관리</h1>
        <p className='text-sm text-gray-600'>최근 14일 동안의 정산 내역을 확인하고 관리하세요.</p>
      </div>

      {/* Summary Cards */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
        {/* Income Card */}
        <div className='bg-white shadow rounded-md p-6'>
          <h2 className='text-gray-600 text-sm font-semibold'>총 수익</h2>
          <p className='text-3xl font-bold text-green-500 mt-2'>₩3,200,000</p>
        </div>

        {/* Expense Card */}
        <div className='bg-white shadow rounded-md p-6'>
          <h2 className='text-gray-600 text-sm font-semibold'>총 지출</h2>
          <p className='text-3xl font-bold text-red-500 mt-2'>₩1,200,000</p>
        </div>

        {/* Pending Settlement Card */}
        <div className='bg-white shadow rounded-md p-6'>
          <h2 className='text-gray-600 text-sm font-semibold'>미정산 금액</h2>
          <p className='text-3xl font-bold text-yellow-500 mt-2'>₩500,000</p>
        </div>
      </div>

      {/* Transactions Table */}
      <div className='bg-white shadow rounded-md p-6'>
        <h2 className='text-lg font-semibold text-gray-800 mb-4'>정산 내역</h2>
        <div className='overflow-x-auto'>
          <table className='table-auto w-full text-sm'>
            <thead>
              <tr className='bg-gray-200 text-gray-700'>
                <th className='px-4 py-2'>날짜</th>
                <th className='px-4 py-2'>금액</th>
                <th className='px-4 py-2'>유형</th>
                <th className='px-4 py-2'>상태</th>
              </tr>
            </thead>
            <tbody>
              {recentTransactions.map((transaction) => (
                <tr key={transaction.id} className='border-b'>
                  <td className='px-4 py-2'>{transaction.date}</td>
                  <td className='px-4 py-2'>₩{transaction.amount.toLocaleString()}</td>
                  <td
                    className={`px-4 py-2 ${
                      transaction.type === '수익' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {transaction.type}
                  </td>
                  <td
                    className='px-4 py-2 cursor-pointer'
                    onClick={() => handleStatusClick(transaction.id)}
                  >
                    <span
                      className={`bg-${transaction.statusColor}-100 text-${transaction.statusColor}-600 px-2 py-1 rounded-full`}
                    >
                      {transaction.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Button */}
      <div className='mt-6 flex justify-end'>
        <button className='bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded shadow transition duration-150'>
          정산 요청
        </button>
      </div>
    </div>
  )
}

export default Overview
