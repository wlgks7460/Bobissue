import React, { useState } from 'react'
import { PlusIcon, MinusIcon, TrashIcon } from '@heroicons/react/24/outline'

const CartItem = ({ item, updateItemCount, removeItem }) => {
  // 상품 수량 정보
  const [itemCount, setItemCount] = useState(item.count)
  // 상품 가격 , 찍기
  const addComma = (price) => {
    let returnString = price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    return returnString
  }

  // 상품 수량 input handle
  const handleCount = (e) => {
    let newCount = Number(e.target.value)

    if (newCount < 1) {
      newCount = 1
    } else if (newCount > item.itemData.stock) {
      newCount = item.itemData.stock
    }

    setItemCount(newCount)
    updateItemCount(item.itemData.itemNo, newCount)
  }

  // 수량 감소
  const decreaseCount = () => {
    if (itemCount > 1) {
      const newCount = itemCount - 1
      setItemCount(newCount)
      updateItemCount(item.itemData.itemNo, newCount)
    }
  }

  // 수량 증가
  const increaseCount = () => {
    if (itemCount < item.itemData.stock) {
      const newCount = itemCount + 1
      setItemCount(newCount)
      updateItemCount(item.itemData.itemNo, newCount)
    }
  }
  return (
    <div>
      {/* 상품 정보 */}
      <div className='flex gap-3'>
        <img src='' alt='' className='w-[60px] h-[60px] rounded border border-gray-400' />
        <div className='h-[60px] flex flex-col justify-evenly'>
          <p>{item.itemData.name}</p>
          <p className='flex gap-3'>
            <span>{addComma(item.itemData.salePrice * itemCount)}원</span>
            <span className='text-gray-400 line-through'>
              {addComma(item.itemData.price * itemCount)}원
            </span>
          </p>
        </div>
      </div>
      {/* 버튼 */}
      <div className='flex gap-5'>
        {/* 상품 수량 설정 */}
        <div className='flex my-3'>
          <button
            className='border border-gray-400 p-2 rounded-s'
            disabled={itemCount === 1}
            onClick={decreaseCount}
          >
            <MinusIcon className='w-3' />
          </button>
          <input
            type='text'
            className='w-[35px] text-center border-y border-gray-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
            value={itemCount}
            min={1}
            max={item.itemData.stock}
            onChange={handleCount}
          />
          <button
            className='border border-gray-400 p-2 rounded-e'
            disabled={item.itemData.stock < 1 || item.itemData.stock === itemCount}
            onClick={increaseCount}
          >
            <PlusIcon className='w-3 ' />
          </button>
        </div>
        {/* 삭제 버튼 */}
        <button className='ml-3 p-2 text-red-500' onClick={() => removeItem(item.itemData.itemNo)}>
          <TrashIcon className='w-5' />
        </button>
      </div>
    </div>
  )
}

export default CartItem
