import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '@/utils/API'
import { FaAngleDoubleLeft, FaAngleLeft, FaAngleRight, FaAngleDoubleRight } from 'react-icons/fa'

const Overview = () => {
  const navigate = useNavigate()
  const [transactions, setTransactions] = useState([])
  const [category, setCategory] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const transactionsPerPage = 10
  const pagesPerGroup = 5

  const handleStatusClick = (id) => {
    navigate(`/seller/settlement/view?id=${id}`)
  }

  const filteredTransactions = transactions.filter((transaction) => {
    if (category === 'all') return true
    if (category === '정산') return transaction.status === '정산 완료'
    if (category === '미정산') return transaction.status !== '정산 완료'
    return true
  })

  const totalPages = Math.ceil(filteredTransactions.length / transactionsPerPage)
  const startPage = Math.floor((currentPage - 1) / pagesPerGroup) * pagesPerGroup + 1
  const endPage = Math.min(startPage + pagesPerGroup - 1, totalPages)
  const displayedTransactions = filteredTransactions.slice(
    (currentPage - 1) * transactionsPerPage,
    currentPage * transactionsPerPage,
  )

  return (
    <div className='p-6 bg-white min-h-screen'>
      <div className='mb-8'>
        <h1 className='text-4xl font-bold text-gray-900 text-center'>정산 관리</h1>
        <p className='text-lg text-gray-700 text-center'>
          최근 14일 동안의 정산 내역을 확인하고 관리하세요.
        </p>
      </div>

      <div className='flex justify-center space-x-6 mb-8'>
        {['all', '정산', '미정산'].map((status) => (
          <button
            key={status}
            onClick={() => setCategory(status)}
            className={`px-6 py-2 rounded-full font-semibold transition-all ${
              category === status
                ? 'bg-gray-500 text-white shadow-md'
                : 'bg-gray-300 text-gray-700 border border-gray-400 hover:bg-gray-400 hover:text-white'
            }`}
          >
            {status === 'all' ? '전체' : status}
          </button>
        ))}
      </div>

      <div className='bg-gray-100 rounded-lg border-2 border-gray-300 p-6'>
        <h2 className='text-lg font-semibold text-gray-700 mb-4'>정산 내역</h2>
        <table className='table-fixed text-sm w-full'>
          <thead className='bg-gray-200 text-gray-700'>
            <tr>
              <th className='px-4 py-2 w-[180px]'>날짜</th>
              <th className='px-4 py-2 w-[200px]'>금액</th>
              <th className='px-4 py-2 w-[150px]'>유형</th>
              <th className='px-4 py-2 w-[180px]'>상태</th>
            </tr>
          </thead>
          <tbody>
            {displayedTransactions.length > 0 ? (
              displayedTransactions.map((transaction) => (
                <tr key={transaction.id} className='border-b border-gray-300'>
                  <td className='px-4 py-2'>{transaction.date}</td>
                  <td className='px-4 py-2'>₩{transaction.amount.toLocaleString()}</td>
                  <td className='px-4 py-2 text-gray-700'>{transaction.type}</td>
                  <td
                    className='px-4 py-2 cursor-pointer'
                    onClick={() => handleStatusClick(transaction.id)}
                  >
                    <span className='bg-gray-200 text-gray-700 px-2 py-1 rounded-full'>
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

      {totalPages > 1 && (
        <div className='flex justify-center mt-8'>
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className='mx-1 px-3 py-2 rounded-md bg-white text-gray-700 border border-gray-300 hover:bg-gray-500 hover:text-white'
          >
            <FaAngleDoubleLeft />
          </button>
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className='mx-1 px-3 py-2 rounded-md bg-white text-gray-700 border border-gray-300 hover:bg-gray-500 hover:text-white'
          >
            <FaAngleLeft />
          </button>
          {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`mx-1 px-4 py-2 rounded-md text-lg font-medium transition ${currentPage === page ? 'bg-gray-500 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-400 hover:text-white'}`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className='mx-1 px-3 py-2 rounded-md bg-white text-gray-700 border border-gray-300 hover:bg-gray-500 hover:text-white'
          >
            <FaAngleRight />
          </button>
          <button
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            className='mx-1 px-3 py-2 rounded-md bg-white text-gray-700 border border-gray-300 hover:bg-gray-500 hover:text-white'
          >
            <FaAngleDoubleRight />
          </button>
        </div>
      )}
    </div>
  )
}

export default Overview
