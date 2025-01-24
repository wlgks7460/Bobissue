import React, { useState } from 'react'
import Breadcrumb from '../common/Breadcrumb'

const MonthlyStatisticsTable = () => {
  // Breadcrumb에 사용할 경로 데이터
  const breadcrumbPaths = [
    { name: 'Home' }, // 홈
    { name: '회원관리' },
    { name: '가입통계' },
    { name: '월별가입통계분석' }, // 현재 페이지
  ]

  // 월 선택 상태 관리
  const [selectedMonth, setSelectedMonth] = useState('')

  return (
    <div className='p-6'>
      {/* Breadcrumb */}
      <Breadcrumb paths={breadcrumbPaths} />
      <h2 className='text-2xl font-bold mb-6'>월별 가입 통계 테이블</h2>

      {/* 월 선택 */}
      <div className='mb-6'>
        <label className='block text-sm font-medium mb-2'>월 선택</label>
        <input
          type='month'
          className='border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500'
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        />
      </div>

      {/* 통계 테이블 */}
      <table className='table-auto w-full border'>
        <thead>
          <tr>
            <th className='border p-2'>월</th>
            <th className='border p-2'>가입 수</th>
          </tr>
        </thead>
        <tbody>
          {selectedMonth ? (
            <tr>
              <td className='border p-2 text-center'>{selectedMonth}</td>
              <td className='border p-2 text-center'>120</td>
            </tr>
          ) : (
            <tr>
              <td className='border p-2 text-center' colSpan='2'>
                조회할 월을 선택하세요.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default MonthlyStatisticsTable
