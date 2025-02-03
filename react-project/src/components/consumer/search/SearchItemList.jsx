import React, { useEffect, useState } from 'react'
import ItemCard from '../common/ItemCard'

const SearchItemList = ({ keyword }) => {
  const [searchItems, setSearchItems] = useState([])

  useEffect(() => {
    // mount
    const res = [
      {
        itemNo: 0,
        name: '상품명 1',
        price: 10000,
        salePrice: 8000,
        stock: 100,
        createAt: '20241231',
      },
      {
        itemNo: 1,
        name: '상품명 2',
        price: 10000,
        salePrice: 8000,
        stock: 100,
        createAt: '20250107',
      },
      {
        itemNo: 2,
        name: '상품명 3',
        price: 10000,
        salePrice: 8000,
        stock: 100,
        createAt: '20250127',
      },
      {
        itemNo: 3,
        name: '상품명 4',
        price: 10000,
        salePrice: 8000,
        stock: 100,
        createAt: '20250201',
      },
      {
        itemNo: 4,
        name: '상품명 5',
        price: 10000,
        salePrice: 8000,
        stock: 100,
        createAt: '20250203',
      },
    ]
    setSearchItems(res)
    // unmount
    return () => {}
  }, [])
  return (
    <div>
      {/* 정렬 */}
      <div className='flex justify-between'>
        <div>
          <span>총 {searchItems.length}건</span>
        </div>
        <div className='flex gap-3 text-sm text-gray-600'>
          <button>신상품</button>
          <button>낮은 가격순</button>
          <button>높은 가격순</button>
        </div>
      </div>
      {/* 아이템 컨테이너 */}
      <div className='grid grid-cols-4 gap-3'>
        {searchItems?.map((v) => (
          <ItemCard key={v.itemNo} item={v} />
        ))}
      </div>
    </div>
  )
}

export default SearchItemList
