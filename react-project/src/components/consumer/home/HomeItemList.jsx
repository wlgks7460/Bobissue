import React, { useEffect, useState } from 'react'
import HomeItem from './HomeItem'
import API from '../../../utils/API'

const HomeItemList = ({ category }) => {
  const [items, setItems] = useState([]) // 상품 데이터 리스트
  // 카테고리에 맞는 상품 불러오기
  useEffect(() => {
    // mount
    API.get(`/categories/${category.categoryNo}`).then((res) => {
      setItems(res.data.result.data.items)
    })
    // unmount
    return () => {}
  }, [])
  return (
    <div className='w-[70rem]'>
      <div className='flex justify-between mb-5'>
        <p className='text-xl'>{category.name}</p>
        <button>+ 더보기</button>
      </div>
      <div className='grid grid-cols-4 gap-3'>
        {items.map((v) => (
          <HomeItem key={v.itemNo} item={v} />
        ))}
      </div>
    </div>
  )
}

export default HomeItemList
