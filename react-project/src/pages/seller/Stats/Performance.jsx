import React, { useEffect, useState } from 'react'
import API from '@/utils/API'

const SalesStatistics = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [salesData, setSalesData] = useState({
    popularItems: [],
    customerSatisfaction: [],
    performanceComparison: {},
  })
  const [timePeriod, setTimePeriod] = useState('monthly') // 'monthly', 'weekly', 'yearly'

  // 디버그 모드 여부 확인
  const debug_mode = localStorage.getItem('debug_mode') === 'true'

  // 더미 데이터
  const dummyData = {
    popularItems: [
      { itemId: 'item001', iselled_num: 150 },
      { itemId: 'item002', iselled_num: 120 },
      { itemId: 'item003', iselled_num: 100 },
    ],
    customerSatisfaction: [
      { itemId: 'item001', reviewRanking: 4.5 },
      { itemId: 'item002', reviewRanking: 4.3 },
      { itemId: 'item003', reviewRanking: 4.2 },
    ],
    performanceComparison: {
      total_sales_amount: 500000,
      customer_growth_trend: '10% 증가',
    },
  }

  // 판매 통계 데이터를 불러오는 함수
  const fetchSalesData = async () => {
    try {
      if (debug_mode) {
        // 디버그 모드일 때 더미 데이터 사용
        setSalesData(dummyData)
      } else {
        // 실제 API 호출
        const response = await API.get(`/sales/popular-items?period=${timePeriod}`)
        const popularItems = response.data.result.data

        const response2 = await API.get(`/sales/customer-satisfaction?period=${timePeriod}`)
        const customerSatisfaction = response2.data.result.data

        const response3 = await API.get(`/sales/performance-comparison?period=${timePeriod}`)
        const performanceComparison = response3.data.result.data

        setSalesData({
          popularItems,
          customerSatisfaction,
          performanceComparison,
        })
      }
    } catch (err) {
      console.error('판매 통계 불러오기 실패:', err)
      setError('판매 통계를 불러오는 데 문제가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  // 페이지가 로드될 때 데이터 불러오기
  useEffect(() => {
    setLoading(true)
    fetchSalesData()
  }, [timePeriod])

  if (loading) return <p>판매 통계를 불러오는 중...</p>
  if (error) return <p className='text-red-500'>{error}</p>

  return (
    <div className='p-6'>
      <h2 className='text-2xl font-semibold mb-4'>📊 판매 통계</h2>

      {/* 기간 선택 (연별/월별/주별) */}
      <div className='mb-6'>
        <label className='text-sm font-medium'>기간 선택</label>
        <select
          value={timePeriod}
          onChange={(e) => setTimePeriod(e.target.value)}
          className='mt-1 p-2 border rounded'
        >
          <option value='monthly'>월별</option>
          <option value='weekly'>주별</option>
          <option value='yearly'>연별</option>
        </select>
      </div>

      {/* 인기 판매 상품 순위 */}
      <div className='mb-6'>
        <h3 className='text-xl font-semibold'>1. 인기 판매 상품 순위</h3>
        <ul>
          {salesData.popularItems.map((item, index) => (
            <li key={item.itemId} className='mb-2'>
              <span>{index + 1}. </span>
              <strong>{item.itemId}</strong> - 판매 수: {item.iselled_num}
            </li>
          ))}
        </ul>
      </div>

      {/* 고객 만족도 */}
      <div className='mb-6'>
        <h3 className='text-xl font-semibold'>2. 고객 만족도</h3>
        <ul>
          {salesData.customerSatisfaction.map((review, index) => (
            <li key={review.itemId} className='mb-2'>
              <span>{index + 1}. </span>
              <strong>{review.itemId}</strong> - 리뷰 평점: {review.reviewRanking}
            </li>
          ))}
        </ul>
      </div>

      {/* 전월 대비 실적 */}
      <div className='mb-6'>
        <h3 className='text-xl font-semibold'>3. 전월 대비 실적</h3>
        <div>
          <h4 className='text-lg'>
            판매 금액: {salesData.performanceComparison.total_sales_amount}
          </h4>
          <h4 className='text-lg'>
            고객 증감 추이: {salesData.performanceComparison.customer_growth_trend}
          </h4>
        </div>
      </div>
    </div>
  )
}

export default SalesStatistics
