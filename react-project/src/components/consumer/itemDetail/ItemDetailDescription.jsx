import React, { useState } from 'react'

const ItemDetailDescription = () => {
  // 상품 상세 상태
  const [divState, setDivState] = useState(false)
  return (
    <div>
      <div className='w-full relative'>
        <div className={divState ? '' : 'h-[300px] overflow-hidden'}>
          <img src='' alt='' className='w-full h-[800px] border-none' />
        </div>
        {!divState ? (
          <button
            className='w-[80px] absolute -bottom-3 left-1/2 -translate-x-1/2 border border-gray-400 rounded-full bg-white'
            onClick={() => setDivState(true)}
          >
            더보기
          </button>
        ) : (
          <button
            className='w-[80px] absolute -bottom-3 left-1/2 -translate-x-1/2 px-3 border border-gray-400 rounded-full bg-white'
            onClick={() => setDivState(false)}
          >
            접기
          </button>
        )}
      </div>
    </div>
  )
}

export default ItemDetailDescription
