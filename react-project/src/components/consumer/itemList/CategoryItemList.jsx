import React from 'react'
import ItemCard from '../common/ItemCard'
import { ExclamationCircleIcon } from '@heroicons/react/24/outline'

const CategoryItemList = ({ items }) => {
  return (
    <div className='mb-32'>
      {/* 정렬 */}
      <div className='flex justify-between mb-10'>
        <div>
          <span>총 {items?.length}건</span>
        </div>
        <div className='flex gap-3 text-sm text-gray-600'>
          <button>신상품</button>
          <button>낮은 가격순</button>
          <button>높은 가격순</button>
        </div>
      </div>
      {/* 아이템 컨테이너 */}
      {items.length > 0 ? (
        <div className='grid grid-cols-4 gap-3 gap-y-24'>
          {items?.map((v) => (
            <ItemCard key={v.itemNo} item={v} />
          ))}
        </div>
      ) : (
        <div className='flex flex-col gap-3 items-center mt-20'>
          <p className='text-center'>
            <ExclamationCircleIcon className='w-20 text-gray-400' />
          </p>
          <p className='text-center text-xl text-gray-600'>상품을 준비 중입니다.</p>
        </div>
      )}
    </div>
  )
}

export default CategoryItemList
