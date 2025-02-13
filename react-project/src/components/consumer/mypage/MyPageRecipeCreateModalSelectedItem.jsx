import React, { useState } from 'react'
import { PlusIcon, MinusIcon, TrashIcon } from '@heroicons/react/24/outline'

const MyPageRecipeCreateModalSelectedItem = ({ item, selectedItems, setSelectedItems }) => {
  // 상품 가격 , 찍기
  const addComma = (price) => {
    return price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

  // 수량 증가
  const increaseCount = (e) => {
    e.preventDefault()
    setSelectedItems((prevItems) =>
      prevItems.map((i) => (i.itemNo === item.itemNo ? { ...i, count: i.count + 1 } : i)),
    )
  }

  // 수량 감소
  const decreaseCount = (e) => {
    e.preventDefault()
    if (item.count > 1) {
      setSelectedItems((prevItems) =>
        prevItems.map((i) => (i.itemNo === item.itemNo ? { ...i, count: i.count - 1 } : i)),
      )
    }
  }

  // 아이템 삭제
  const removeItem = (e, itemNo) => {
    e.preventDefault()
    setSelectedItems((prevItems) => prevItems.filter((i) => i.itemNo !== itemNo))
  }

  return (
    <div className='my-2 flex gap-3'>
      <div>
        <img
          src={item.data.images[0]?.imageUrl || ''}
          alt=''
          className='w-[80px] h-[80px] rounded cursor-pointer'
        />
      </div>
      <div>
        <p>{item.data.name}</p>
        <div className='flex gap-2 items-center'>
          <span className='text-sm text-gray-400 line-through'>{addComma(item.data.price)}원</span>
          <span>{addComma(item.data.salePrice)}원</span>
        </div>
        {/* 버튼 */}
        <div className='flex items-center gap-1'>
          {/* 상품 수량 설정 */}
          <div className='flex h-[30px]'>
            <button
              className='border border-gray-400 px-2 rounded-s'
              disabled={item.count === 1}
              onClick={decreaseCount}
            >
              <MinusIcon className='w-3' />
            </button>
            <input
              type='text'
              className='w-[35px] text-center border-y border-gray-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
              value={item.count}
              readOnly
            />
            <button
              className='border border-gray-400 px-2 rounded-e'
              disabled={item.count >= item.data.stock}
              onClick={increaseCount}
            >
              <PlusIcon className='w-3 ' />
            </button>
          </div>
          {/* 삭제 버튼 */}
          <button className='p-2 text-red-500' onClick={(e) => removeItem(e, item.itemNo)}>
            <TrashIcon className='w-5' />
          </button>
        </div>
      </div>
    </div>
  )
}

export default MyPageRecipeCreateModalSelectedItem
