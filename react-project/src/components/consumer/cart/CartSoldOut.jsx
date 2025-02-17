import React from 'react'
import { TrashIcon, PlusIcon, MinusIcon } from '@heroicons/react/24/outline'
import itemDefaultImg from '../../../assets/consumer/itemDefault.webp'

const CartSoldOut = ({ item, removeItem }) => {
  // 상품 가격 , 찍기
  const addComma = (price) => {
    return price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

  return (
    <div>
      {/* 상품 정보 */}
      <div className='flex gap-3'>
        <img
          src={item.itemData.images?.[0]?.imageUrl || itemDefaultImg}
          alt=''
          className='w-[60px] h-[60px] rounded border border-gray-400'
          onError={(e) => {
            e.target.src = itemDefaultImg
          }}
        />
        <div className='h-[60px] flex flex-col justify-evenly'>
          <p className='text-gray-500'>{item.itemData.name} (품절)</p>
          <p className='flex gap-3 text-gray-400 line-through'>
            <span>{addComma(item.itemData.salePrice)}원</span>
            <span>{addComma(item.itemData.price)}원</span>
          </p>
        </div>
      </div>

      {/* 버튼 (배치는 유지하지만 기능 없음) */}
      <div className='flex gap-5'>
        <div className='flex my-3'>
          <button className='border border-gray-400 p-2 rounded-s opacity-50 cursor-not-allowed'>
            <MinusIcon className='w-3' />
          </button>
          <input
            type='text'
            className='w-[35px] text-center border-y border-gray-400 bg-gray-200 text-gray-500 cursor-not-allowed'
            value={item.count}
            disabled
          />
          <button className='border border-gray-400 p-2 rounded-e opacity-50 cursor-not-allowed'>
            <PlusIcon className='w-3' />
          </button>
        </div>
        <button className='ml-3 p-2 text-red-500' onClick={() => removeItem(item.itemData.itemNo)}>
          <TrashIcon className='w-5' />
        </button>
      </div>
    </div>
  )
}

export default CartSoldOut
