import React from 'react'
import { Link } from 'react-router-dom'

const MyPageRecipe = () => {
  return (
    <div className='p-5'>
      <h2 className='text-center text-xl'>내 레시피</h2>
      <div className='flex justify-end px-3 my-2'>
        <Link to={'/mypage/recipe/create'} className='text-right hover:text-indigo-600'>
          작성하기
        </Link>
      </div>
      <hr className='border-gray-300 mb-10' />
    </div>
  )
}

export default MyPageRecipe
