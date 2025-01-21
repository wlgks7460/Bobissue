import React, { useState } from 'react'
import HomeEventBanner from '../../components/consumer/home/HomeEventBanner'
import ItemSummary from '../../components/consumer/home/ItemSummary'
import HomeLiveShopping from '../../components/consumer/home/HomeLiveShopping'

const Home = () => {
  const [categories, setCategory] = useState([
    '할인 / 특가',
    '정기 배송',
    '건강식',
    '고단백',
    '닭가슴살',
    '간편식',
    '식재료',
  ])
  return (
    <div>
      {/* 이벤트 배너 section */}
      <HomeEventBanner />
      {/* 라이브 커머스 section */}
      <HomeLiveShopping />
      {/*상품 section */}
      <div className='flex flex-col items-center gap-10'>
        {categories.map((category, index) => (
          <div key={index + category}>
            <ItemSummary category={category} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default Home
