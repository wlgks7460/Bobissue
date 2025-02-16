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
  Cell,
  PieChart,
  Pie,
} from 'recharts'
import CountUp from 'react-countup'
const PerformanceAnalysisComponent = () => {
  const breadcrumbPaths = [{ name: 'Home' }, { name: '쇼핑몰 분석' }, { name: '매출 분석' }]
  const [totalSales, setTotalSales] = useState(null)
  const [monthlyComparison, setMonthlyComparison] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const totalSalesResponse = await API.get('/admin/total-sales')
        setTotalSales(totalSalesResponse.data.result.data)

        const comparisonResponse = await API.get('/admin/statistics/monthly-comparison')
        setMonthlyComparison(comparisonResponse.data.result.data)
      } catch (error) {
        console.error('데이터 조회 실패:', error)
      }
    }
    fetchData()
  }, [])

  if (!monthlyComparison) {
    return <div className='p-6'>로딩 중...</div>
  }

  // 📊 데이터 가공: 주문 수 비교
  const salesData = [
    { name: '이번 달 주문 수(건)', value: monthlyComparison.currentMonthSales },
    { name: '지난 달 주문 수(건)', value: monthlyComparison.previousMonthSales },
  ]

  // 💹 주문 수 성장률 색상 결정
  const growthRateColor = monthlyComparison.salesGrowthRate > 0 ? '#0EA5E9' : '#EF4444'

  // 📈 매출액 데이터 가공
  const revenueData = [
    { name: '이번 달 매출액(원)', value: monthlyComparison.currentMonthRevenue },
    { name: '지난 달 매출액(원)', value: monthlyComparison.previousMonthRevenue },
  ]

  return (
    <div className='p-6'>
      <Breadcrumb paths={breadcrumbPaths} />
      <h2 className='text-2xl font-bold mb-6'>매출 분석</h2>

      {/* 총 매출 렌더링 */}
      <div className='mb-6 p-6'>
        <h3 className='text-2xl font-bold text-[#725a3e] mb-2'>💼 이번달 총 매출</h3>
        <p className='text-5xl font-extrabold text-[#5a4630]'>
          <CountUp start={0} end={totalSales || 0} duration={2.5} separator=',' /> 원
        </p>
      </div>

      {/* 📊 전월 대비 주문 수 실적 바 차트 */}
      <div className='bg-white p-6 rounded-lg shadow mb-6'>
        <h3 className='text-lg font-semibold mb-4'>전월 대비 주문 수 실적</h3>
        <ResponsiveContainer width='100%' height={300}>
          <BarChart data={salesData}>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='name' />
            <YAxis />
            <Tooltip />
            <Bar dataKey='value' fill={growthRateColor} barSize={50}>
              {salesData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={index === 0 ? '#4F46E5' : '#6B7280'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className='mt-4 text-center'>
          <span
            className={`font-bold ${growthRateColor === '#0EA5E9' ? 'text-blue-600' : 'text-red-600'}`}
          >
            주문 수 성장률: {monthlyComparison.salesGrowthRate}%
          </span>
        </div>
      </div>

      {/* 📈 전월 대비 매출액 분석 (원 기준) */}
      <div className='bg-white p-6 rounded-lg shadow mb-6'>
        <h3 className='text-lg font-semibold mb-4'>전월 대비 매출액 분석</h3>
        <ResponsiveContainer width='100%' height={300}>
          <BarChart data={revenueData} margin={{ left: 50 }}>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='name' />
            <YAxis tickFormatter={(value) => value.toLocaleString()} />
            <Tooltip formatter={(value) => value.toLocaleString()} />
            <Bar dataKey='value' fill='#82ca9d' barSize={50}>
              {revenueData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={index === 0 ? '#34D399' : '#6B7280'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className='mt-4 text-center'>
          <span className={`font-bold text-green-600`}>
            매출액 성장률: {monthlyComparison.revenueGrowthRate}%
          </span>
        </div>
      </div>

      {/* 🎯 매출액 분석 원형 차트 */}
      <div className='bg-white p-6 rounded-lg shadow mb-6'>
        <h3 className='text-lg font-semibold mb-4'>매출액 비율 분석</h3>
        <ResponsiveContainer width='100%' height={300}>
          <PieChart>
            <Pie
              data={revenueData}
              dataKey='value'
              nameKey='name'
              cx='50%'
              cy='50%'
              outerRadius={100}
              fill='#82ca9d'
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default PerformanceAnalysisComponent
