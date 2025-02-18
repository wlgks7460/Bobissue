import React, { useEffect, useState } from 'react'
import SearchBar from '../../components/consumer/common/SearchBar'
import HomeEventBanner from '../../components/consumer/home/HomeEventBanner'
import HomeLiveShopping from '../../components/consumer/home/HomeLiveShopping'
import HomeItemList from '../../components/consumer/home/HomeItemList'
import API from '../../utils/API'
import HomeBestItemList from '../../components/consumer/home/HomeBestItemList'

const Home = () => {
  const [categories, setCategory] = useState([])
  const [bestCategory, setBestCategory] = useState([
    { id: 0, name: '베스트셀러 Top10', path: 'best-sellers' },
    { id: 1, name: '재구매율 Top10', path: 'top-repurchase' },
    { id: 2, name: '남성 선호 상품 Top10', path: 'male-preferred' },
    { id: 3, name: '여성 선호 상품 Top10', path: 'female-preferred' },
  ])
  useEffect(() => {
    // mount
    API.get('/categories')
      .then((res) => {
        setCategory(res.data.result.data)
      })
      .catch((err) => {
        console.error(err)
      })
    // unmount
    return () => {}
  }, [])
  return (
    <div>
      {/* search bar */}
      <SearchBar />
      {/* 이벤트 배너 section */}
      <HomeEventBanner />
      {/* 라이브 커머스 section */}
      <HomeLiveShopping />
      {/* top10 section */}
      <div className='mt-20'></div>
      <div className='flex flex-col items-center gap-16 mb-20'>
        {bestCategory.map((v) => (
          <HomeBestItemList key={v.id} bestCategory={v} />
        ))}
      </div>
      {/*상품 section */}
      <div className='flex flex-col items-center gap-16 my-20'>
        {categories.map((v) => (
          <HomeItemList key={v.categoryNo} category={v} />
        ))}
      </div>
    </div>
  )
}

export default Home
