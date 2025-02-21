import React, { useState } from 'react'
import descriptionDefault1 from '../../../assets/consumer/bakeryDefault.webp'
import descriptionDefault2 from '../../../assets/consumer/snackDefault.webp'
import descriptionDefault3 from '../../../assets/consumer/fruitDefault.webp'

const ItemDetailDescription = () => {
  // 상품 상세 상태
  const [divState, setDivState] = useState(false)
  return (
    <div>
      <div className='w-full relative'>
        <div className={`${divState ? '' : 'h-[300px] overflow-hidden'} flex flex-col gap-10`}>
          <img src={descriptionDefault1} alt='' className='w-full h-[800px] border-none' />
          <img src={descriptionDefault2} alt='' className='w-full h-[800px] border-none' />
          <img src={descriptionDefault3} alt='' className='w-full h-[800px] border-none' />
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
