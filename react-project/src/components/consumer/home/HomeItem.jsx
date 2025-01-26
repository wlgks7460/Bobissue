import React, { useState } from 'react'
import HomeItemModal from './HomeItemModal'
import { Link } from 'react-router-dom'

const HomeItem = ({ item }) => {
  // 이미지 컨테이너에 hovering 되어있는가
  const [isHovering, setIsHovering] = useState(false)
  // 상품 장바구니 담기 modal 상태
  const [isOpen, setIsOpen] = useState(false)

  // 상품 가격 , 찍기
  const addComma = (price) => {
    let returnString = price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    return returnString
  }

  // 장바구니 담기 hover 관련 함수
  const handleMouseOver = () => {
    setIsHovering(true)
  }
  const handleMouseOut = () => {
    setIsHovering(false)
  }
  // 장바구니 담기 함수
  const itemOnCart = (e) => {
    e.preventDefault()
    setIsHovering(false)
    setIsOpen(true)
  }
  return (
    <div>
      <div className='w-[250px] flex flex-col gap-2'>
        {/* 상품 이미지 */}
        <div className='relative' onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
          <Link to={`/item/${item.itemNo}`}>
            <img
              // 이미지 경로 수정 필요
              src='https://cdn.pixabay.com/photo/2015/06/17/16/29/paper-bag-812728_640.png'
              alt=''
              className='w-full h-[300px] bg-gray-400 rounded'
            />
          </Link>
          {isHovering ? (
            <button
              className='w-full h-[50px] rounded-b absolute bottom-0 bg-black/40 text-white'
              onClick={itemOnCart}
            >
              장바구니 담기
            </button>
          ) : (
            ''
          )}
          {isOpen ? (
            <HomeItemModal
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              setIsHovering={setIsHovering}
              item={item}
            />
          ) : (
            ''
          )}
        </div>
        {/* 상품 정보 */}
        <div>
          <p className='text-lg font-semibold'>{item.name}</p> {/* 상품명 */}
          <div className='text-right'>
            <p className='text-sm text-gray-400 line-through'>{addComma(item.price)}원</p>{' '}
            {/* 원가 */}
            <p className='text-xl'>
              {/* 할인율 */}
              <span className='text-red-500 me-5'>
                {((item.price - item.salePrice) / item.price) * 100}%
              </span>
              {/* 판매가 */}
              {addComma(item.salePrice)}원
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomeItem
