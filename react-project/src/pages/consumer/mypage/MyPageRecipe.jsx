import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import API from '../../../utils/API'
import { useSelector } from 'react-redux'
import MyPageRecipeItem from '../../../components/consumer/mypage/MyPageRecipeItem'
import { ExclamationCircleIcon } from '@heroicons/react/24/outline'

const MyPageRecipe = () => {
  const [recipes, setRecipes] = useState([])
  const email = useSelector((state) => state.user.userInfo.email)
  // 레시피 데이터 가져오기
  const getRecipeData = () => {
    API.get('/recipe')
      .then((res) => {
        console.log(res)
        const result = res.data.result.data.filter((v) => v.createdUser === `USER ${email}`)
        setRecipes(result)
      })
      .catch((err) => {
        console.error(err)
      })
  }

  useEffect(() => {
    // mount
    getRecipeData()
    // unmount
    return () => {}
  }, [])
  return (
    <div className='p-5'>
      <h2 className='text-center text-xl'>내 레시피</h2>
      <div className='flex justify-end px-3 my-2'>
        <Link to={'/mypage/recipe/create'} className='text-right hover:text-[#6F4E37]'>
          작성하기
        </Link>
      </div>
      <hr className='border-[#6F4E37] mb-10' />
      <div>
        {recipes.length > 0 ? (
          <div className='grid grid-cols-3 gap-y-10'>
            {recipes.map((v) => (
              <MyPageRecipeItem key={v.recipeNo} recipe={v} getRecipeData={getRecipeData} />
            ))}
          </div>
        ) : (
          <div className='flex flex-col gap-3 items-center'>
            <p className='text-center'>
              <ExclamationCircleIcon className='w-20 text-gray-400' />
            </p>
            <p className='text-center text-xl text-gray-600'>레시피가 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default MyPageRecipe
