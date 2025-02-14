import React, { useState } from 'react'
import {
  FaChartLine,
  FaStar,
  FaBoxOpen,
  FaRedoAlt,
  FaSmile,
  FaClipboardList,
  FaBroadcastTower,
} from 'react-icons/fa'

const Overview = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('monthly')
  const [salesPrediction, setSalesPrediction] = useState('')

  return (
    <div className='p-6 max-w-7xl mx-auto'>
      <h1 className='text-4xl font-extrabold text-gray-900 text-center mb-10'>판매 통계 개요</h1>

      {/* 시간 선택 (연간, 월간, 주간, 일간) */}
      <div className='text-center mb-8'>
        <div className='inline-flex space-x-4'>
          {['annual', 'monthly', 'weekly', 'daily'].map((period) => (
            <button
              key={period}
              onClick={() => setSelectedTimeframe(period)}
              className={`px-4 py-1 rounded-full text-lg font-semibold transition-all duration-300 ${
                selectedTimeframe === period
                  ? 'bg-cyan-600 text-white scale-105'
                  : 'bg-gray-200 text-gray-700 hover:bg-cyan-500 hover:text-white'
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

      {/* 인기 판매 상품 순위 */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12'>
        <div className='bg-white p-6 rounded-lg shadow-md'>
          <FaBoxOpen className='text-4xl text-blue-600 mb-4' />
          <h3 className='text-xl font-semibold text-gray-800'>인기 판매 상품 순위</h3>
          <p className='text-gray-600 mt-2'>정렬 기준: 판매량, 매출, 리뷰 평점</p>
          <div className='mt-4 text-gray-500'>선택된 기간: {selectedTimeframe}</div>
        </div>

        {/* 고객 만족도 */}
        <div className='bg-white p-6 rounded-lg shadow-md'>
          <FaSmile className='text-4xl text-green-600 mb-4' />
          <h3 className='text-xl font-semibold text-gray-800'>고객 만족도</h3>
          <p className='text-gray-600 mt-2'>재구매율, 평점, 주문취소, 환불</p>
          <div className='mt-4 text-gray-500'>선택된 기간: {selectedTimeframe}</div>
        </div>

        {/* 전월 대비 실적 */}
        <div className='bg-white p-6 rounded-lg shadow-md'>
          <FaRedoAlt className='text-4xl text-orange-600 mb-4' />
          <h3 className='text-xl font-semibold text-gray-800'>전월 대비 실적</h3>
          <p className='text-gray-600 mt-2'>판매량, 매출, 증감 추이</p>
          <div className='mt-4 text-gray-500'>선택된 기간: {selectedTimeframe}</div>
        </div>
      </div>

      {/* 판매량 예측 */}
      <div className='bg-white p-6 rounded-lg shadow-md mb-12'>
        <FaChartLine className='text-4xl text-yellow-600 mb-4' />
        <h3 className='text-xl font-semibold text-gray-800'>판매량 예측</h3>
        <p className='text-gray-600 mt-2'>차주 판매량 예측 및 재고 관리</p>
        <div className='mt-4 text-gray-500'>전주 판매량: 1000개</div>
        <div className='mt-4'>
          <label htmlFor='prediction' className='block text-gray-700'>
            차주 예상 판매량
          </label>
          <input
            id='prediction'
            type='number'
            className='w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
            placeholder='예상 판매량 입력'
            value={salesPrediction}
            onChange={(e) => setSalesPrediction(e.target.value)}
          />
        </div>
      </div>

      {/* 카테고리별 통계 */}
      <div className='bg-white p-6 rounded-lg shadow-md mb-12'>
        <FaClipboardList className='text-4xl text-purple-600 mb-4' />
        <h3 className='text-xl font-semibold text-gray-800'>카테고리별 통계</h3>
        <p className='text-gray-600 mt-2'>각 카테고리별 판매량, 매출, 트렌드</p>
      </div>

      {/* 라이브 커머스 효율 분석 */}
      <div className='bg-white p-6 rounded-lg shadow-md mb-12'>
        <FaBroadcastTower className='text-4xl text-red-600 mb-4' />
        <h3 className='text-xl font-semibold text-gray-800'>라이브 커머스 효율 분석</h3>
        <p className='text-gray-600 mt-2'>라이브 방송 중 판매된 상품과 그 효율 분석</p>
        <div className='mt-4 text-gray-500'>선택된 기간: {selectedTimeframe}</div>
      </div>
    </div>
  )
}

export default Overview
