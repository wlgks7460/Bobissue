import React, { useRef, useState } from 'react'
import LiveItem from './LiveItem'

const LiveItemList = ({ items }) => {
  // 상품 드래그 관련
  const scrollContainerRef = useRef()

  // 드래그 기능
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)

  const handleMouseDown = (e) => {
    setIsDragging(true)
    setStartX(e.clientX)
    setScrollLeft(scrollContainerRef.current.scrollLeft)
  }

  const handleMouseMove = (e) => {
    if (!isDragging) return
    const x = e.clientX - startX
    scrollContainerRef.current.scrollLeft = scrollLeft - x
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const allToCart = () => {
    let cartData = JSON.parse(localStorage.getItem('cart')) || []
    let isDuplicate = false

    const newItems = items
      .map((v) => {
        const existingIndex = cartData.findIndex((item) => item.itemNo === v.itemNo)
        if (existingIndex !== -1) {
          cartData[existingIndex].count += 1
          isDuplicate = true
          return null
        }
        return { itemNo: v.itemNo, count: 1 }
      })
      .filter(Boolean) // null 값 제거

    if (newItems.length > 0) {
      cartData = [...cartData, ...newItems]
      localStorage.setItem('cart', JSON.stringify(cartData))
    }

    alert(isDuplicate ? '중복 상품은 수량을 추가하였습니다.' : '장바구니에 담았습니다.')
  }
  return (
    <div className='flex-none w-full max-w-full h-[150px] border-t border-[#6F4E37] p-3'>
      <div className='flex justify-between'>
        <h3>판매 중 상품</h3>
        <button className='text-sm text-gray-400 hover:text-[#6F4E37]' onClick={allToCart}>
          전체 상품 담기
        </button>
      </div>
      <div
        ref={scrollContainerRef}
        className='flex gap-3 mx-2 overflow-x-auto no-scrollbar flex-nowrap'
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp} // 마우스가 벗어났을 때도 드래그 끝내기
      >
        {items.map((v) => (
          <LiveItem key={v.itemNo} item={v} />
        ))}
      </div>
    </div>
  )
}

export default LiveItemList
