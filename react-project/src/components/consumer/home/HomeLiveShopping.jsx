import React, { useEffect, useState } from 'react'
import API from '../../../utils/API'
import HomeLiveShoppingItem from './HomeLiveShoppingItem'
import { ExclamationCircleIcon } from '@heroicons/react/24/outline'

const HomeLiveShopping = () => {
  const [castData, setCastData] = useState([])

  // 방송 조회
  const getCast = () => {
    API.get('/cast/registerList')
      .then((res) => {
        console.log(res)
      })
      .catch((err) => {
        console.error(err)
      })
  }
  useEffect(() => {
    const tempData = [
      {
        castNo: 4,
        title: '첫 방송입니다.',
        content: '닭가슴살 초특가',
        startAt: '20250205 080000',
        endAt: '20250205 100000',
        castItemList: [
          {
            itemNo: 1,
            name: '상품 이름1',
            description: '상품 설명1',
          },
          {
            itemNo: 2,
            name: '상품 이름2',
            description: '상품 설명1',
          },
          {
            itemNo: 52,
            name: '상품 이름122',
            description: '상품 설명1',
          },
        ],
        castStatus: '등록',
        createAt: '20250212 014213',
        createdUser: 'SELLER seller@naver.com',
        updatedAt: '20250212 014213',
        updatedUser: 'SELLER seller@naver.com',
        delYN: 'N',
      },
      {
        castNo: 5,
        title: '두번 방송입니다.',
        content: '닭가슴살 도시락 초특가',
        startAt: '20250205 080000',
        endAt: '20250205 100000',
        castItemList: [
          {
            itemNo: 1,
            name: '상품 이름1',
            description: '상품 설명1',
          },
          {
            itemNo: 2,
            name: '상품 이름2',
            description: '상품 설명1',
          },
          {
            itemNo: 52,
            name: '상품 이름122',
            description: '상품 설명1',
          },
        ],
        castStatus: '등록',
        createAt: '20250212 014735',
        createdUser: 'SELLER seller@naver.com',
        updatedAt: '20250212 014735',
        updatedUser: 'SELLER seller@naver.com',
        delYN: 'N',
      },
    ]
    // setCastData(tempData)
    getCast()
  }, [])
  return (
    <div className='flex justify-center my-20'>
      <div className='w-[70rem] h-96'>
        <h3 className='text-xl'>라이브 커머스</h3>
        <div className='w-full h-full flex justify-center items-center'>
          {castData.length > 0 ? (
            <div>
              {castData.map((v) => (
                <HomeLiveShoppingItem key={v.castNo} cast={v} />
              ))}
            </div>
          ) : (
            <div className='flex flex-col gap-3 items-center'>
              <p className='text-center'>
                <ExclamationCircleIcon className='w-20 text-gray-400' />
              </p>
              <p className='text-center text-xl text-gray-600'>오늘은 방송이 없어요.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default HomeLiveShopping
