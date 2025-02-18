import React, { useState } from 'react'
import SearchBar from '../../components/consumer/common/SearchBar'
import RecipeCategory from '../../components/consumer/recipe/RecipeCategory'
import { ExclamationCircleIcon } from '@heroicons/react/24/outline'
import recipeDefaultImg from '../../assets/consumer/recipeDefault.webp'
import { Link } from 'react-router-dom'

const Recipe = () => {
  const [recipes, setRecipes] = useState([])

  return (
    <div>
      <SearchBar />
      <div className='flex justify-center'>
        <div className='w-[70rem] min-h-[70vh]'>
          <h2 className='text-2xl text-center my-10'>레시피</h2>
          <RecipeCategory setRecipes={setRecipes} />
          {/* 정렬 */}
          <div className='flex justify-between mb-10'>
            <div>
              <span>총 {recipes?.length}건</span>
            </div>
          </div>
          {/* 레시피 리스트 */}
          {recipes.length > 0 ? (
            <div className='grid grid-cols-4 gap-y-10'>
              {recipes.map((v) => (
                <div className='flex flex-col justify-center items-center' key={v.recipeNo}>
                  <Link to={`/recipe/${v.recipeNo}`}>
                    <img
                      src={v.images[0]?.imageUrl || recipeDefaultImg}
                      alt=''
                      className='w-[200px] h-[200px] rounded mb-2'
                    />
                  </Link>
                  <span className='w-[200px] text-lg text-center mb-2 turncate'>{v.name}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className='flex flex-col gap-3 items-center mt-20'>
              <p className='text-center'>
                <ExclamationCircleIcon className='w-20 text-gray-400' />
              </p>
              <p className='text-center text-xl text-gray-600'>레시피가 없습니다.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Recipe
