import React from 'react'
import { Link } from 'react-router-dom'
import MyPageRecipeForm from '../../../components/consumer/mypage/MyPageRecipeForm'

const MyPageRecipeCreate = () => {
  return (
    <div className='p-5'>
      <h2 className='text-center text-xl'>레시피 작성하기</h2>
      <div className='flex justify-end px-3 my-2'>
        <Link to={'/mypage/recipe'} className='text-right hover:text-indigo-600'>
          목록으로
        </Link>
      </div>
      <hr className='border-gray-300 mb-5' />
      <div className='flex justify-center'>
        <MyPageRecipeForm />
      </div>
    </div>
  )
}

export default MyPageRecipeCreate
