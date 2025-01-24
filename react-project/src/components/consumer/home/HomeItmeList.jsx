import React, { useEffect, useState } from 'react'
import HomeItem from './HomeItem'

const HomeItmeList = ({ category }) => {
  const [items, setItems] = useState([]) // 상품 데이터 리스트
  // 카테고리에 맞는 상품 불러오기
  useEffect(() => {
    // mount
    const response = {
      data: [
        {
          itemNo: 1,
          name: '상품명1',
          price: 10000,
          salePrice: 8000,
          description: '상품에 대한 상세 정보입니다. 아주 좋은 상품이에요.',
          stock: 100,
        },
        {
          itemNo: 2,
          name: '상품명2',
          price: 20000,
          salePrice: 15000,
          description: '상품에 대한 상세 정보입니다. 아주 좋은 상품이에요.',
          stock: 80,
        },
        {
          itemNo: 3,
          name: '상품명3',
          price: 15000,
          salePrice: 12000,
          description: '상품에 대한 상세 정보입니다. 아주 좋은 상품이에요.',
          stock: 1000,
        },
        {
          itemNo: 4,
          name: '상품명4',
          price: 5000,
          salePrice: 3000,
          description: '상품에 대한 상세 정보입니다. 아주 좋은 상품이에요.',
          stock: 20,
        },
      ],
    }
    setItems(response.data)
    // unmount
    return () => {}
  }, [])
  return (
    <div className='w-[70rem]'>
      <div className='flex justify-between mb-5'>
        <p className='text-xl'>{category}</p>
        <button>+ 더보기</button>
      </div>
      <div className='flex justify-between'>
        {items.map((v) => (
          <HomeItem key={v.itemNo} item={v} />
        ))}
      </div>
    </div>
  )
}

export default HomeItmeList
