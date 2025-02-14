import React, { useEffect, useState } from 'react'
import API from '../../../utils/API'

const AdminDashBoard = () => {
  const [totalSales, setTotalSales] = useState(null)

  useEffect(() => {
    const fetchTotalSales = async () => {
      try {
        const response = await API.get('http://bobissue.duckdns.org:8082/api/admin/total-sales')
        const total = response?.data?.result?.data
        if (total !== undefined) {
          setTotalSales(total)
        } else {
          console.error('총 매출 데이터가 없습니다.', response)
        }
      } catch (error) {
        console.error('총 매출 가져오기 실패:', error)
      }
    }

    fetchTotalSales()
  }, [])

  return (
    <div>
      <h1 className='text-2xl font-bold text-gray-800 mb-4 mt-4'>대시보드</h1>

      {/* 총 매출 카드 */}
      <div className='bg-white shadow-md rounded-lg p-4'>
        <h2 className='text-base font-semibold text-gray-800'>총 매출</h2>
        <p className='text-3xl font-bold text-amber-500 mt-1'>
          {totalSales !== null ? `₩${totalSales.toLocaleString()}` : '로딩 중...'}
        </p>
      </div>
    </div>
  )
}

export default AdminDashBoard
