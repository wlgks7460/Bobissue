import React, { useState } from 'react'
import LiveModal from './LiveModal'

const LiveItem = ({ item }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  const handleMouseDown = () => {
    setIsDragging(false)
  }

  const handleMouseMove = () => {
    setIsDragging(true)
  }

  const handleClick = (e) => {
    if (isDragging) {
      e.preventDefault() // 드래그 상태일 때 링크 이동 방지
    } else {
      setIsOpen(true)
    }
  }
  return (
    <div
      className='relative border-[#6F4E37] border rounded-md shadow-md flex-none min-w-[100px]'
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseDown}
    >
      {/* 상품 이미지 (이미지 src는 나중에 불러오기) */}
      <div className='w-[100px] h-[100px] bg-white rounded-md'>
        {/* 이미지 src는 나중에 연결 */}
      </div>

      {/* 툴팁: 상품 이름 */}
      <div
        className='absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-black/60 text-white text-xs rounded-md opacity-0 hover:opacity-100 transition-opacity'
        onClick={handleClick}
      >
        {item?.name}
      </div>
      {isOpen && <LiveModal setIsOpen={setIsOpen} item={item} />}
    </div>
  )
}

export default LiveItem
