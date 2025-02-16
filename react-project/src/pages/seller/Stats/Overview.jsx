import React, { useState, useEffect } from 'react'
import {
  FaChartLine,
  FaStar,
  FaBoxOpen,
  FaRedoAlt,
  FaSmile,
  FaClipboardList,
  FaBroadcastTower,
} from 'react-icons/fa'
import API from '@/utils/API'

const Overview = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('monthly')
  const [salesPrediction, setSalesPrediction] = useState('')

  useEffect(() => {
    async function fetchRankdata() {
      try {
        const response = await API.get('/sellers/item-rank')
        console.log(response.data.result.data) // 응답 데이터 출력
      } catch (error) {
        console.error('Error fetching item rank:', error)
      }
    }

    fetchRankdata()
  }, [])

  return (
    <div className='p-6 max-w-7xl mx-auto bg-coffee-50 min-h-screen'>
      <h1 className='text-4xl font-extrabold text-coffee-900 text-center mb-10'>판매 통계 개요</h1>

      {/* 시간 선택 (연간, 월간, 주간, 일간) */}
      <div className='text-center mb-8'>
        <div className='inline-flex space-x-4'>
          {['annual', 'monthly', 'weekly', 'daily'].map((period) => (
            <button
              key={period}
              onClick={() => setSelectedTimeframe(period)}
              className={`px-4 py-1 rounded-full text-lg font-semibold transition-all duration-300 ${
                selectedTimeframe === period
                  ? 'bg-caramel-500 text-white scale-105 shadow-lg'
                  : 'bg-caramel-200 text-coffee-900 hover:bg-caramel-400 hover:text-white'
              }`}
            >
              {period === 'annual' && '연간'}
              {period === 'monthly' && '월간'}
              {period === 'weekly' && '주간'}
              {period === 'daily' && '일간'}
            </button>
          ))}
        </div>
      </div>

      {/* 카드 레이아웃 */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12'>
        {/* 인기 판매 상품 순위 */}
        <Card
          icon={<FaBoxOpen className='text-4xl text-caramel-600 mb-4' />}
          title='인기 판매 상품 순위'
          description='정렬 기준: 판매량, 매출, 리뷰 평점'
          timeframe={selectedTimeframe}
        />

        {/* 고객 만족도 */}
        <Card
          icon={<FaSmile className='text-4xl text-coffee-600 mb-4' />}
          title='고객 만족도'
          description='재구매율, 평점, 주문취소, 환불'
          timeframe={selectedTimeframe}
        />

        {/* 전월 대비 실적 */}
        <Card
          icon={<FaRedoAlt className='text-4xl text-caramel-700 mb-4' />}
          title='전월 대비 실적'
          description='판매량, 매출, 증감 추이'
          timeframe={selectedTimeframe}
        />
      </div>

      {/* 판매량 예측 */}
      <div className='bg-white p-6 rounded-xl border-2 border-coffee-300 mb-12 shadow-md'>
        <FaChartLine className='text-4xl text-caramel-700 mb-4' />
        <h3 className='text-xl font-semibold text-coffee-900'>판매량 예측</h3>
        <p className='text-coffee-700 mt-2'>차주 판매량 예측 및 재고 관리</p>
        <div className='mt-4 text-coffee-600'>전주 판매량: 1000개</div>
        <div className='mt-4'>
          <label htmlFor='prediction' className='block text-coffee-800'>
            차주 예상 판매량
          </label>
          <input
            id='prediction'
            type='number'
            className='w-full mt-2 p-3 border border-coffee-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-caramel-500'
            placeholder='예상 판매량 입력'
            value={salesPrediction}
            onChange={(e) => setSalesPrediction(e.target.value)}
          />
        </div>
      </div>

      {/* 추가 통계 항목 */}
      <Card
        icon={<FaClipboardList className='text-4xl text-coffee-700 mb-4' />}
        title='카테고리별 통계'
        description='각 카테고리별 판매량, 매출, 트렌드'
      />

      <Card
        icon={<FaBroadcastTower className='text-4xl text-caramel-800 mb-4' />}
        title='라이브 커머스 효율 분석'
        description='라이브 방송 중 판매된 상품과 그 효율 분석'
        timeframe={selectedTimeframe}
      />
    </div>
  )
}

// 공통 카드 컴포넌트
const Card = ({ icon, title, description, timeframe }) => (
  <div className='bg-white p-6 rounded-xl border-2 border-coffee-300 shadow-md'>
    {icon}
    <h3 className='text-xl font-semibold text-coffee-900'>{title}</h3>
    <p className='text-coffee-700 mt-2'>{description}</p>
    {timeframe && <div className='mt-4 text-coffee-600'>선택된 기간: {timeframe}</div>}
  </div>
)

export default Overview
