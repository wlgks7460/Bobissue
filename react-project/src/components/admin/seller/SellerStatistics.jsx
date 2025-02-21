import React, { useEffect, useState } from 'react'
import API from '../../../utils/API'
import Breadcrumb from '../common/Breadcrumb'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from 'recharts'

const SellerStatistics = () => {
  const [stats, setStats] = useState(null)

  // Breadcrumb 경로 데이터
  const breadcrumbPaths = [{ name: 'Home' }, { name: '판매자 기타' }, { name: '판매자 통계' }]

  // API 호출
  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await API.get('/admin/seller-statistics')
        setStats(response.data.result.data)
      } catch (error) {
        console.error('판매자 통계 조회 실패:', error)
      }
    }
    fetchStatistics()
  }, [])

  // 로딩 상태 처리
  if (!stats) {
    return (
      <div className='p-6'>
        <Breadcrumb paths={breadcrumbPaths} />
        <h1 className='text-2xl font-bold mb-6'>판매자 통계</h1>
        <p className='text-center text-gray-500'>로딩 중...</p>
      </div>
    )
  }

  // 판매자 가입 현황 차트 데이터 가공
  const monthlyJoinData = stats.monthlyJoinStats.map((item) => ({
    month: item.yearMonth,
    total: item.totalSeller,
    approved: item.approvedSeller,
  }))

  return (
    <div className='p-6'>
      {/* Breadcrumb */}
      <Breadcrumb paths={breadcrumbPaths} />
      <h1 className='text-2xl font-bold mb-6'>판매자 통계</h1>
      {/* ✅ 판매자 상태 및 승인 통계 */}
      <div className='grid grid-cols-2 gap-6 mb-6'>
        <div className='bg-white p-4 rounded-lg shadow'>
          <h2 className='text-lg font-semibold mb-2'>판매자 상태 통계</h2>
          <p className='text-gray-700'>
            활성 판매자 수: <strong>{stats.sellerStatusStats.Y}</strong>
          </p>
        </div>

        <div className='bg-white p-4 rounded-lg shadow'>
          <h2 className='text-lg font-semibold mb-2'>판매자 승인(회사) 통계</h2>
          <p className='text-gray-700'>
            승인된 판매자 수: <strong>{stats.sellerApprovalStats.Y}</strong>
          </p>
        </div>
      </div>
      {/* ✅ 판매자별 매출 정보 */}
      <div className='bg-white p-4 rounded-lg shadow mb-6'>
        <h2 className='text-lg font-semibold mb-4'>판매자별 매출 현황</h2>
        <table className='w-full border border-gray-300 text-sm'>
          <thead className='bg-gray-100'>
            <tr>
              <th className='border p-2'>판매자 번호</th>
              <th className='border p-2'>판매자명</th>
              <th className='border p-2'>회사명</th>
              <th className='border p-2'>총 매출(₩)</th>
            </tr>
          </thead>
          <tbody>
            {stats.sellerSalesStats.map((seller) => (
              <tr key={seller.sellerNo} className='text-center hover:bg-gray-50'>
                <td className='border p-2'>{seller.sellerNo}</td>
                <td className='border p-2'>{seller.sellerName}</td>
                <td className='border p-2'>{seller.companyName}</td>
                <td className='border p-2'>{seller.totalSales.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* ✅ 월별 판매자 가입 현황 (그래프)
      <div className='bg-white p-4 rounded-lg shadow'>
        <h2 className='text-lg font-semibold mb-4'>월별 판매자 가입 현황</h2>
        <ResponsiveContainer width='100%' height={300}>
          <BarChart data={monthlyJoinData} barSize={30} barCategoryGap='50%'>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='month' tick={{ textAnchor: 'middle' }} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey='total' name='전체 판매자' fill='#4F46E5' />
            <Bar dataKey='approved' name='승인 판매자' fill='#0EA5E9' />
          </BarChart>
        </ResponsiveContainer>
      </div> */}

      {/* 📊 월별 판매자 가입 현황 (그래프) */}
      <div className='bg-white p-4 rounded-lg shadow'>
        <h2 className='text-lg font-semibold mb-4'>당월 가입 현황</h2>
        <ResponsiveContainer width='100%' height={300}>
          <BarChart
            data={[
              { category: '전체 판매자', value: stats.monthlyJoinStats[0].totalSeller },
              { category: '승인 판매자', value: stats.monthlyJoinStats[0].approvedSeller },
            ]}
            barSize={50}
          >
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='category' />
            <YAxis />
            <Tooltip />
            {/* 🏷️ 범례의 'value'를 '가입자 수'로 변경 */}
            <Legend formatter={() => '가입자 수'} />
            <Bar dataKey='value' fill='#4F46E5' />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default SellerStatistics
