import React, { useState } from 'react'
import { ExclamationCircleIcon } from '@heroicons/react/24/solid'
import RecipeDetailItem from './RecipeDetailItem'

const RecipeDetailItemList = ({ materials }) => {
  const [selectedItem, setSelectedItem] = useState([])

  // 상품 확인 후 담기
  const itemOnCart = (itemNo, count) => {
    const tempItem = { itemNo, count }
    let cartData = JSON.parse(localStorage.getItem('cart'))
    if (cartData === null) {
      // cart 데이터가 없으면 생성
      localStorage.setItem('cart', JSON.stringify([tempItem]))
    } else {
      const check = cartData.findIndex((v) => v.itemNo === tempItem.itemNo)
      if (check === -1) {
        // 중복 상품 x
        cartData.push(tempItem)
      } else {
        // 중복 상품의 경우
        alert('이미 담겨져 있는 상품입니다. 상품 수량을 추가합니다.')
        cartData[check].count += tempItem.count
      }
      localStorage.setItem('cart', JSON.stringify(cartData))
    }
  }

  // 선택한 재료 장바구니 담기
  const selectItemToCart = () => {
    if (selectedItem.length > 0) {
      selectedItem.forEach((v) => itemOnCart(v.item.itemNo, v.cnt))
      alert('선택한 재료를 장바구니에 담았습니다.')
    } else {
      alert('상품을 선택해 주세요.')
    }
  }

  return (
    <div className='px-20'>
      <h3 className='text-xl mb-5'>재료</h3>
      {materials?.length > 0 ? (
        <div className='flex gap-3 px-5 py-3 overflow-y-auto'>
          {materials.map((v) => (
            <RecipeDetailItem
              key={v.itemNo}
              itemNo={v.itemNo}
              cnt={v.cnt}
              selectedItem={selectedItem}
              setSelectedItem={setSelectedItem}
            />
          ))}
        </div>
      ) : (
        <div className='flex flex-col gap-3 items-center'>
          <p className='text-center'>
            <ExclamationCircleIcon className='w-20 text-gray-400' />
          </p>
          <p className='text-center text-xl text-gray-600'>등록된 재료가 없습니다.</p>
        </div>
      )}
      {materials?.length > 0 && (
        <div className='mt-2'>
          <div className='mb-3 flex items-center gap-3'>
            <span>구매할 재료 : </span>
            {selectedItem.length > 0 ? (
              <div>
                {selectedItem.map((v, i) => (
                  <span key={v.item.itemNo}>
                    {v.item.name}
                    {i + 1 < selectedItem.length && ', '}
                  </span>
                ))}
              </div>
            ) : (
              <div>
                <span>선택한 재료가 없습니다.</span>
              </div>
            )}
          </div>
          <button
            className='w-full h-[50px] bg-[#A67B5B] hover:bg-[#6F4E37] rounded text-white'
            onClick={selectItemToCart}
          >
            재료 장바구니 담기
          </button>
        </div>
      )}
    </div>
  )
}

export default RecipeDetailItemList
