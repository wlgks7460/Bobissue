import React, { useState } from 'react'
import ItemRank from './Form/ItemRank'
import CustomerSatisfaction from './Form/CustomerSatisfaction'
import MonthlyComparison from './Form/MonthlyComparison'
import SalesPrediction from './Form/SalesPrediction'
import CategoryStatistics from './Form/CategoryStatistics'
import HourlyStatistics from './Form/HourlyStatistics'
import Demographics from './Form/Demographics2'

const components = {
  '상품 순위': ItemRank,
  '고객 만족도': CustomerSatisfaction,
  '월별 비교': MonthlyComparison,
  '판매 예측': SalesPrediction,
  '카테고리 통계': CategoryStatistics,
  '시간대별 통계': HourlyStatistics,
  '성별/연령대별 판매 통계': Demographics,
}

const periods = ['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY']

const Overview = () => {
  const [selectedComponent, setSelectedComponent] = useState('상품 순위')
  const [selectedPeriod, setSelectedPeriod] = useState('YEARLY')

  return (
    <div className='bg-warmBeige/20 p-6 max-w-7xl mx-auto bg-frostWhite border border-silverMedium rounded-lg shadow-md flex min-h-screen'>
      {/* 왼쪽 필터 메뉴 */}
      <div className='w-1/4 bg-silverLight p-4 rounded-lg shadow-sm border border-silverMedium'>
        <h2 className='text-lg font-semibold text-darkGraphite mb-4 '>통계 선택</h2>
        <ul className='space-y-2'>
          {Object.keys(components).map((key) => (
            <li key={key}>
              <button
                onClick={() => setSelectedComponent(key)}
                className={`w-full text-left px-4 py-2 rounded-lg font-semibold transition ${
                  selectedComponent === key
                    ? 'bg-caramelTan/60 text-white'
                    : 'bg-silverMedium/50 text-roastedCocoa hover:bg-caramelTan/60 hover:text-white'
                }`}
              >
                {key}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* 오른쪽 선택된 컴포넌트 영역 */}
      <div className='w-3/4 p-4 bg-white rounded-lg shadow-sm border border-silverMedium'>
        {/* 기간 선택 버튼 */}
        <div className='flex space-x-3 mb-4'>
          {periods.map((period) => (
            <button
              key={period}
              onClick={() => {
                setSelectedPeriod(period)
              }}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                selectedPeriod === period
                  ? 'bg-caramelTan/60 text-white'
                  : 'bg-silverMedium/50 text-roastedCocoa hover:bg-caramelTan/60 hover:text-white'
              }`}
            >
              {period}
            </button>
          ))}
        </div>

        {/* 선택된 컴포넌트 렌더링 (props로 selectedPeriod 전달) */}
        {selectedComponent &&
          React.createElement(components[selectedComponent], { selectedPeriod })}
      </div>
    </div>
  )
}

export default Overview
