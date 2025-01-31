import React, { useEffect, useState } from 'react'
import SearchBar from '../../components/consumer/SearchBar'
import HomeEventBanner from '../../components/consumer/home/HomeEventBanner'
import HomeLiveShopping from '../../components/consumer/home/HomeLiveShopping'
import HomeItmeList from '../../components/consumer/home/HomeItmeList'
import API from '../../utils/API'

const Home = () => {
  const [categories, setCategory] = useState([])
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
      {/*상품 section */}
      <div className='flex flex-col items-center gap-10'>
        {categories.map((v) => (
          <HomeItmeList key={v.categoryNo} category={v} />
        ))}
      </div>
    </div>
  )
}

export default Home
