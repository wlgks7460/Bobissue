import React from 'react'

const MyPageRecipeItem = ({ recipe }) => {
  const imgSrc = recipe.images[0]?.imageUrl || ''
  return (
    <div className='flex flex-col justify-center'>
      <img src={imgSrc} alt='' className='w-[200px] h-[200px] rounded mb-2' />
      <span className='w-[200px] text-lg text-center'>{recipe.name}</span>
    </div>
  )
}

export default MyPageRecipeItem
