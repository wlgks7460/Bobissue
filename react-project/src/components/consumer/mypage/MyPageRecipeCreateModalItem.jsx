import React, { useState } from 'react'

const MyPageRecipeCreateModalItem = ({ item, idx, handleSelectItem }) => {
  const [showName, setShowName] = useState(false)

  return (
    <div className='relative'>
      <div
        onMouseEnter={() => setShowName(true)}
        onMouseLeave={() => setShowName(false)}
        onClick={() => handleSelectItem(item)}
      >
        <img
          src={item.images[0]?.imageUrl || ''}
          alt=''
          className='w-[80px] h-[80px] rounded cursor-pointer'
        />
      </div>
      {showName && (
        <span
          className={`absolute bottom-0 ${(idx + 1) % 5 === 0 || (idx + 1) % 5 === 4 ? 'right-2/3' : 'left-2/3'} px-2 py-1 z-10 rounded bg-black/40 text-white whitespace-nowrap`}
        >
          {item.name}
        </span>
      )}
    </div>
  )
}

export default MyPageRecipeCreateModalItem
