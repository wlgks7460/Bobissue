import React, { useState } from 'react'
import { PlusIcon, MinusIcon } from '@heroicons/react/24/outline'
import itemDefaultImg from '../../../assets/consumer/itemDefault.webp'

const LiveModal = ({ setIsOpen, item }) => {
  // 상품 수량
  const [itemCount, setItemCount] = useState(1)
  // 상품 가격 , 찍기
  const addComma = (price) => {
    let returnString = price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    return returnString
  }
  // 상품 수량 input handle
  const handleCount = (e) => {
    if (e.target.value < 1) {
      // 1개보다 작게 되는것 막기
      setItemCount(1)
    } else if (e.target.value > item.stock) {
      // 재고보다 많아지는 것것막기
      setItemCount(item.stock)
    } else {
      setItemCount(e.target.value)
    }
  }
  // 모달 닫기
  const closeModal = () => {
    setIsOpen(false)
  }

  // 상품 장바구니 담기
  const itemOnCart = () => {
    const tempItem = {
      itemNo: item.itemNo,
      count: itemCount,
    }
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
    closeModal()
  }
  return (
    <div className='fixed top-0 left-0 z-20'>
      <div className='w-full h-full fixed bg-gray-600/80 flex justify-center items-center'>
        <div className='w-[400px] border border-gray-400 rounded bg-white p-5 flex flex-col'>
          {/* 모달 main */}
          <div className='overflow-y-auto grow flex flex-col justify-between '>
            {/* 상품 정보 및 수량 설정 */}
            <div className='h-full flex flex-col'>
              {/* 상품 카드 */}
              <div className='flex gap-3'>
                <img
                  src={item.images?.[0]?.imageUrl || itemDefaultImg}
                  alt={`${item.name} 이미지`}
                  className='w-[100px] h-[100px] flex-none bg-gray-400 rounded'
                  onError={(e) => {
                    e.target.src = itemDefaultImg
                  }}
                />
                {/* 상품 정보 */}
                <div className=' grow flex flex-col justify-between'>
                  <p className='text-lg font-semibold'>{item.name}</p> {/* 상품명 */}
                  <div className='text-right'>
                    <p className='text-sm text-gray-400 line-through'>{addComma(item.price)}원</p>{' '}
                    {/* 원가 */}
                    <p className='text-lg'>
                      {/* 할인율 */}
                      <span className='text-red-500 me-5'>
                        {Math.round(((item.price - item.salePrice) / item.price) * 100)}%
                      </span>
                      {/* 판매가 */}
                      {addComma(item.salePrice)}원
                    </p>
                  </div>
                </div>
              </div>
              {/* 상품 수량 설정 */}
              <div className='flex justify-end my-3'>
                <button
                  className='border border-gray-400 p-2 rounded-s'
                  disabled={itemCount === 1}
                  onClick={() => setItemCount(itemCount - 1)}
                >
                  <MinusIcon className='w-3' />
                </button>
                <input
                  type='text'
                  className='w-[35px] text-center border-y border-gray-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
                  value={itemCount}
                  min={1}
                  max={item.stock}
                  onChange={handleCount}
                />
                <button
                  className='border border-gray-400 p-2 rounded-e'
                  disabled={item.stock < 1 || item.stock === itemCount}
                  onClick={() => setItemCount(itemCount + 1)}
                >
                  <PlusIcon className='w-3 ' />
                </button>
              </div>
            </div>
            <div>
              {/* 합계 */}
              <div className='mb-3 flex justify-between text-xl'>
                <span>합계</span>
                <span>{addComma(item.salePrice * itemCount)}원</span>
              </div>
              <button
                className='w-full h-[50px] rounded bg-[#A67B5B] hover:bg-[#6F4E37] text-white'
                onClick={itemOnCart}
              >
                장바구니 담기
              </button>
            </div>
          </div>
          <div className='flex-none flex justify-center mt-2'>
            <button className='text-red-600' onClick={closeModal}>
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LiveModal
