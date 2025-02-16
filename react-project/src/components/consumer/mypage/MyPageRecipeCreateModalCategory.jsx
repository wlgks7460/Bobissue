import React from 'react'

const MyPageRecipeCreateModalCategory = ({
  categories,
  parentNo,
  children,
  items,
  selectedCategory,
  setSelectedCategory,
  handleParent,
  handleAll,
}) => {
  return (
    <div className='flex border border-gray-300 rounded'>
      {/* 상위 카테고리 */}
      <div className='flex-none w-[150px] h-[100px] overflow-y-auto flex flex-col gap-2 p-2 border-e border-gray-300'>
        {categories.map((v, i) => (
          <button
            className={`${v.categoryNo === parentNo && 'text-[#6F4E37]'} text-left`}
            key={v.categoryNo}
            onClick={() => handleParent(i)}
          >
            {v.name}
          </button>
        ))}
      </div>
      {/* 하위 카테고리 */}
      <div className='grow w-[150px] grid grid-cols-3'>
        <button className={`${!items.parentNo && 'text-[#6F4E37]'}`} onClick={handleAll}>
          전체보기
        </button>
        {children.map((v) => (
          <button
            key={v.categoryNo}
            className={`${selectedCategory === v.categoryNo && 'text-[#6F4E37]'}`}
            onClick={() => setSelectedCategory(v.categoryNo)}
          >
            {v.name}
          </button>
        ))}
      </div>
    </div>
  )
}

export default MyPageRecipeCreateModalCategory
