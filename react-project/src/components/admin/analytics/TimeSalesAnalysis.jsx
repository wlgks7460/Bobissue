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
  ResponsiveContainer,
  Legend,
} from 'recharts'

const TimeSalesAnalysisComponent = () => {
  // Breadcrumb 경로 데이터
  const breadcrumbPaths = [{ name: 'Home' }, { name: '쇼핑몰 분석' }, { name: '시간대별 분석' }]
  const [timeData, setTimeData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // API 호출
  useEffect(() => {
    const fetchTimeSalesStats = async () => {
      try {
        const response = await API.get('/admin/statistics/hourly')
        if (response.data.status === 'OK') {
          setTimeData(response.data.result.data)
        } else {
          setError(response.data.message)
        }
      } catch (err) {
        setError('데이터 로딩 중 오류가 발생했습니다.')
      } finally {
        setLoading(false)
      }
    }
    fetchTimeSalesStats()
  }, [])

  if (loading) {
    return (
      <div className='p-6'>
        <Breadcrumb paths={breadcrumbPaths} />
        <h2 className='text-2xl font-bold mb-6'>시간대별 분석</h2>
        <div className='text-center text-gray-500'>데이터를 불러오는 중...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='p-6'>
        <Breadcrumb paths={breadcrumbPaths} />
        <h2 className='text-2xl font-bold mb-6'>시간대별 분석</h2>
        <div className='text-center text-red-500'>{error}</div>
      </div>
    )
  }

  // 최고 성과 시간대 선정
  const topTimeSlot = timeData.reduce((prev, curr) => {
    const prevMax = Math.max(prev.salesCount, prev.totalRevenue, prev.averageOrderAmount)
    const currMax = Math.max(curr.salesCount, curr.totalRevenue, curr.averageOrderAmount)
    return currMax > prevMax ? curr : prev
  }, timeData[0])

  return (
    <div className='p-6'>
      <Breadcrumb paths={breadcrumbPaths} />
      <h2 className='text-2xl font-bold mb-6'>시간대별 분석</h2>

      {/* 최고 성과 시간대 */}
      <div className='bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-4 rounded-lg shadow mb-6'>
        <h3 className='text-lg font-semibold mb-4'>🏆 최고 성과 시간대</h3>
        <p className='text-xl font-bold'>{topTimeSlot.hour}시</p>
        <div className='flex justify-between mt-2'>
          <div>
            <span className='block'>판매량: {topTimeSlot.salesCount.toLocaleString()}개</span>
            <span className='block'>총 매출: {topTimeSlot.totalRevenue.toLocaleString()}원</span>
            <span className='block'>
              평균 주문 금액: {Math.round(topTimeSlot.averageOrderAmount).toLocaleString()}원
            </span>
          </div>
        </div>
      </div>

      {/* 시간대별 데이터 표 */}
      <div className='bg-white p-4 rounded-lg shadow mb-6'>
        <h3 className='text-lg font-semibold mb-4'>시간대별 판매 데이터</h3>
        <div className='overflow-x-auto'>
          <table className='w-full border-collapse text-sm text-center'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='border p-3'>시간대</th>
                <th className='border p-3'>판매량(개)</th>
                <th className='border p-3'>총 매출(₩)</th>
                <th className='border p-3'>평균 주문 금액(₩)</th>
              </tr>
            </thead>
            <tbody>
              {timeData.map((item) => (
                <tr key={item.hour} className='hover:bg-gray-50'>
                  <td className='border p-3'>{item.hour}시</td>
                  <td className='border p-3'>{item.salesCount.toLocaleString()}</td>
                  <td className='border p-3'>{item.totalRevenue.toLocaleString()}</td>
                  <td className='border p-3'>
                    {Math.round(item.averageOrderAmount).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 시간대별 판매량 차트 */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <div className='bg-white p-4 rounded-lg shadow'>
          <h3 className='text-lg font-semibold mb-4'>시간대별 판매량</h3>
          <ResponsiveContainer width='100%' height={300}>
            <BarChart data={timeData}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='hour' tickFormatter={(value) => `${value}시`} />
              <YAxis tickFormatter={(value) => value.toLocaleString()} />
              <Tooltip formatter={(value) => value.toLocaleString()} />
              <Legend />
              <Bar dataKey='salesCount' fill='#4F46E5' name='판매량' />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 시간대별 총 매출 차트 */}
        <div className='bg-white p-4 rounded-lg shadow'>
          <h3 className='text-lg font-semibold mb-4'>시간대별 총 매출</h3>
          <ResponsiveContainer width='100%' height={300}>
            <BarChart data={timeData}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='hour' tickFormatter={(value) => `${value}시`} />
              <YAxis tickFormatter={(value) => `${(value / 10000).toFixed(0)}만`} />
              <Tooltip formatter={(value) => `${value.toLocaleString()}원`} />
              <Legend />
              <Bar dataKey='totalRevenue' fill='#0EA5E9' name='총 매출' />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 시간대별 평균 주문 금액 차트 */}
        <div className='bg-white p-4 rounded-lg shadow'>
          <h3 className='text-lg font-semibold mb-4'>시간대별 평균 주문 금액</h3>
          <ResponsiveContainer width='100%' height={300}>
            <BarChart data={timeData}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='hour' tickFormatter={(value) => `${value}시`} />
              <YAxis tickFormatter={(value) => `${(value / 10000).toFixed(0)}만`} />
              <Tooltip formatter={(value) => `${value.toLocaleString()}원`} />
              <Legend />
              <Bar dataKey='averageOrderAmount' fill='#F59E0B' name='평균 주문 금액' />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default TimeSalesAnalysisComponent
