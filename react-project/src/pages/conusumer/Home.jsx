import React, { useState } from 'react'
import SearchBar from '../../components/consumer/SearchBar'
import HomeEventBanner from '../../components/consumer/home/HomeEventBanner'
import HomeLiveShopping from '../../components/consumer/home/HomeLiveShopping'
import HomeItmeList from '../../components/consumer/home/HomeItmeList'

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
      {/* search bar */}
      <SearchBar />
      {/* 이벤트 배너 section */}
      <HomeEventBanner />
      {/* 라이브 커머스 section */}
      <HomeLiveShopping />
      {/*상품 section */}
      <div className='flex flex-col items-center gap-10'>
        {categories.map((category, index) => (
          <HomeItmeList key={index + category} category={category} />
        ))}
      </div>
    </div>
  )
}

export default Home
