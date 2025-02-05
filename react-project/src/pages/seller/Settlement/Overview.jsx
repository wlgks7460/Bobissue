import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '@/utils/API'

const Overview = () => {
  const navigate = useNavigate()
  const [transactions, setTransactions] = useState([])
  const [category, setCategory] = useState('all') // ✅ 'all', '정산', '미정산' 필터 상태

  // ✅ API 요청: 최근 14일 내 정산 데이터 가져오기
  useEffect(() => {
    const fetchSettlements = async () => {
      try {
        const response = await API.get('/sellers/settlements', {
          params: { day: 14 }, // 기본적으로 14일 이내 데이터 요청
        })
        if (response.status === 200) {
          setTransactions(response.data.result) // API 응답 데이터 저장
        }
      } catch (error) {
        console.error('정산 데이터를 불러오는 중 오류 발생:', error)
      }
    }

    fetchSettlements()
  }, [])

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
    <div className='p-6 bg-gray-100 min-h-screen w-[1000px]'>
      {/* Header */}
      <div className='mb-6'>
        <h1 className='text-2xl font-bold text-gray-800'>정산 관리</h1>
        <p className='text-sm text-gray-600'>최근 14일 동안의 정산 내역을 확인하고 관리하세요.</p>
      </div>

      {/* ✅ 정산 필터 버튼 */}
      <div className='flex space-x-4 mb-4'>
        <button
          className={`px-4 py-2 rounded border ${
            category === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
          onClick={() => setCategory('all')}
        >
          전체
        </button>
        <button
          className={`px-4 py-2 rounded border ${
            category === '정산' ? 'bg-green-500 text-white' : 'bg-gray-200'
          }`}
          onClick={() => setCategory('정산')}
        >
          정산 완료
        </button>
        <button
          className={`px-4 py-2 rounded border ${
            category === '미정산' ? 'bg-yellow-500 text-white' : 'bg-gray-200'
          }`}
          onClick={() => setCategory('미정산')}
        >
          미정산
        </button>
      </div>

      {/* Summary Cards */}
      <div className='flex space-x-6 mb-8'>
        <div className='bg-white border border-gray-300 rounded-md p-6 w-[280px]'>
          <h2 className='text-gray-600 text-sm font-semibold'>총 수익</h2>
          <p className='text-3xl font-bold text-green-500 mt-2'>₩3,200,000</p>
        </div>

        <div className='bg-white border border-gray-300 rounded-md p-6 w-[280px]'>
          <h2 className='text-gray-600 text-sm font-semibold'>총 지출</h2>
          <p className='text-3xl font-bold text-red-500 mt-2'>₩1,200,000</p>
        </div>

        <div className='bg-white border border-gray-300 rounded-md p-6 w-[280px]'>
          <h2 className='text-gray-600 text-sm font-semibold'>미정산 금액</h2>
          <p className='text-3xl font-bold text-yellow-500 mt-2'>₩500,000</p>
        </div>
      </div>

      {/* Transactions Table */}
      <div className='bg-white border border-gray-300 rounded-md p-6 w-[880px]'>
        <h2 className='text-lg font-semibold text-gray-800 mb-4'>정산 내역</h2>
        <table className='table-fixed text-sm w-[860px]'>
          <thead>
            <tr className='bg-gray-200 text-gray-700'>
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
      <div className='mt-6 flex justify-end'>
        <button className='bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded'>
          정산 요청
        </button>
      </div>
    </div>
  )
}

export default Overview
