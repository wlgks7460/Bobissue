import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '@/utils/API'

const Overview = () => {
  const navigate = useNavigate()
  const [transactions, setTransactions] = useState([])
  const [category, setCategory] = useState('all') // ✅ 'all', '정산', '미정산' 필터 상태

  // ✅ 정산 상태 클릭 이벤트
  const handleStatusClick = (id) => {
    navigate(`/seller/settlement/view?id=${id}`)
  }

  // ✅ 정산/미정산 필터링
  const filteredTransactions = transactions.filter((transaction) => {
    if (category === 'all') return true
    if (category === '정산') return transaction.status === '정산 완료'
    if (category === '미정산') return transaction.status !== '정산 완료'
    return true
  })

  return (
    <div className='p-6 bg-gray-50 min-h-screen'>
      {/* Header */}
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-gray-800 text-center'>정산 관리</h1>
        <p className='text-sm text-gray-600 text-center'>
          최근 14일 동안의 정산 내역을 확인하고 관리하세요.
        </p>
      </div>

      {/* ✅ 정산 필터 버튼 */}
      <div className='flex justify-center space-x-6 mb-8'>
        <button
          className={`px-6 py-3 rounded-full font-semibold transition-all ${
            category === 'all' ? 'bg-sky-500 text-white' : 'bg-gray-200 text-gray-700'
          }`}
          onClick={() => setCategory('all')}
        >
          전체
        </button>
        <button
          className={`px-6 py-3 rounded-full font-semibold transition-all ${
            category === '정산' ? 'bg-lime-500 text-white' : 'bg-gray-200 text-gray-700'
          }`}
          onClick={() => setCategory('정산')}
        >
          정산 완료
        </button>
        <button
          className={`px-6 py-3 rounded-full font-semibold transition-all ${
            category === '미정산' ? 'bg-amber-300 text-white' : 'bg-gray-200 text-gray-700'
          }`}
          onClick={() => setCategory('미정산')}
        >
          미정산
        </button>
      </div>

      {/* Summary Cards */}
      <div className='flex justify-between mb-8'>
        <div className='bg-white rounded-lg shadow-md p-6 w-[280px]'>
          <h2 className='text-gray-600 text-sm font-semibold'>총 수익</h2>
          <p className='text-3xl font-bold text-green-500 mt-2'>₩3,200,000</p>
        </div>
        <div className='bg-white rounded-lg shadow-md p-6 w-[280px]'>
          <h2 className='text-gray-600 text-sm font-semibold'>총 지출</h2>
          <p className='text-3xl font-bold mt-2'>₩1,200,000</p>
        </div>
        <div className='bg-white rounded-lg shadow-md p-6 w-[280px]'>
          <h2 className='text-gray-600 text-sm font-semibold'>미정산 금액</h2>
          <p className='text-3xl font-bold mt-2'>₩500,000</p>
        </div>
      </div>

      {/* Transactions Table */}
      <div className='bg-white rounded-lg shadow-md p-6'>
        <h2 className='text-lg font-semibold text-gray-800 mb-4'>정산 내역</h2>
        <table className='table-fixed text-sm w-full'>
          <thead className='bg-gray-100 text-gray-700'>
            <tr>
              <th className='px-4 py-2 w-[180px]'>날짜</th>
              <th className='px-4 py-2 w-[200px]'>금액</th>
              <th className='px-4 py-2 w-[150px]'>유형</th>
              <th className='px-4 py-2 w-[180px]'>상태</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((transaction) => (
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
                      className={`bg-${
                        transaction.status === '정산 완료' ? 'green' : 'yellow'
                      }-100 text-${
                        transaction.status === '정산 완료' ? 'green' : 'yellow'
                      }-600 px-2 py-1 rounded-full`}
                    >
                      {transaction.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan='4' className='text-center py-4 text-gray-500'>
                  선택한 정산 내역이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Action Button */}
      <div className='mt-8 flex justify-end'>
        <button className='bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg'>
          정산 요청
        </button>
      </div>
    </div>
  )
}

export default Overview
