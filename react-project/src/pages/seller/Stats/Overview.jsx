// ./Form/Overview.js
import React, { useState } from 'react'
import ItemRank from './Form/ItemRank'
import CustomerSatisfaction from './Form/CustomerSatisfaction'
import MonthlyComparison from './Form/MonthlyComparison'
import SalesPrediction from './Form/SalesPrediction'
import CategoryStatistics from './Form/CategoryStatistics'
import HourlyStatistics from './Form/HourlyStatistics'
import Demographics from './Form/Demographics'

const components = {
  '상품 순위': ItemRank,
  '고객 만족도': CustomerSatisfaction,
  '월별 비교': MonthlyComparison,
  '판매 예측': SalesPrediction,
  '카테고리 통계': CategoryStatistics,
  '시간대별 통계': HourlyStatistics,
  '성별/연령대별 판매 통계': Demographics,
}

const Overview = () => {
  const [selectedComponent, setSelectedComponent] = useState('상품 순위')

  return (
    <div className='p-6 max-w-7xl mx-auto bg-gray-100 border border-gray-300 rounded-lg shadow-md flex min-h-screen'>
      {/* 왼쪽 필터 메뉴 */}
      <div className='w-1/4 bg-gray-200 p-4 rounded-lg shadow-md border border-gray-300'>
        <h2 className='text-lg font-semibold text-gray-700 mb-4'>통계 선택</h2>
        <ul className='space-y-2'>
          {Object.keys(components).map((key) => (
            <li key={key}>
              <button
                onClick={() => setSelectedComponent(key)}
                className={`w-full text-left px-4 py-2 rounded-lg font-semibold transition ${
                  selectedComponent === key
                    ? 'bg-gray-400 text-white'
                    : 'bg-gray-300 text-gray-800 hover:bg-gray-400'
                }`}
              >
                {key}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* 오른쪽 선택된 컴포넌트 영역 */}
      <div className='w-3/4 p-4 bg-white rounded-lg shadow-md border border-gray-300'>
        {selectedComponent && React.createElement(components[selectedComponent])}
      </div>
    </div>
  )
}

export default Overview
