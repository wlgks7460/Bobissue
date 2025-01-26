import React, { useEffect, useState } from 'react'
import SearchBar from '../../components/consumer/SearchBar'
import { useParams } from 'react-router-dom'

const ItemDetail = () => {
  // 파라미터 정보
  const params = useParams()
  // 상품 정보 객체
  const [item, setItem] = useState({})

  // 상품 가격 , 찍기
  const addComma = (price) => {
    let returnString = price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    return returnString
  }

  useEffect(() => {
    // mount
    const response = {
      data: {
        itemNo: params.itemNo,
        name: `상품명${params.itemNo}`,
        price: 10000,
        salePrice: 8000,
        description: '상품에 대한 상세 정보입니다. 아주 좋은 상품이에요.',
        category: '카테고리1',
        stock: 100,
      },
    }
    setItem(response.data)
    // unmount
    return () => {}
  }, [])
  return (
    <div>
      <SearchBar />
      <div className='flex justify-center py-10'>
        <div className='w-[70rem] h-[1000px]'>
          {/* 상품 카드 */}
          <div className='flex gap-10'>
            <img
              src=''
              alt=''
              className='w-[400px] h-[600px] flex-none border border-gray-300 rounded'
            />
            {/* 상품 정보 */}
            <div className='h-[600px] grow flex flex-col justify-between gap-5'>
              <div className='flex-none'>
                {/* 상품명 */}
                <p className='text-2xl font-medium mb-2'>{item.name}</p>
                {/* 상품 설명 */}
                <p className='text-gray-600'>{item.description}</p>
              </div>
              {/* 가격 관련 */}
              <div className='flex-none text-right'>
                {/* 원가 */}
                <p className='text-gray-500 line-through'>{addComma(item.price)}원</p>
                {/* 판매가 */}
                <p className='text-xl'>
                  <span className='text-red-500 me-5'>
                    {((item.price - item.salePrice) / item.price) * 100}%
                  </span>
                  {addComma(item.salePrice)}원
                </p>
              </div>
              {/* 상품 정보 */}
              <div className='grow'>
                <p>카테고리</p>
              </div>
              {/* 상품 수량 설정 및 장바구니 담기 */}
              <div className='flex-none flex flex-col'>
                <button className='w-full h-[50px] rounded text-white bg-indigo-400 hover:bg-indigo-600'>
                  장바구니 담기
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ItemDetail
