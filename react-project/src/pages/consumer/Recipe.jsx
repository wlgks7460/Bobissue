import React, { useEffect, useState } from 'react'
import SearchBar from '../../components/consumer/common/SearchBar'
import RecipeCategory from '../../components/consumer/recipe/RecipeCategory'
import API from '../../utils/API'

const Recipe = () => {
  const [recipes, setRecipes] = useState()

  // 레시피 불러오기
  const getRecipeData = () => {
    API.get('/recipe')
      .then((res) => {
        console.log(res)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  useEffect(() => {
    // mount
    getRecipeData()
    // unmount
  }, [])
  return (
    <div>
      <SearchBar />
      <div className='flex justify-center'>
        <div className='w-[70rem] min-h-[70vh]'>
          <h2 className='text-2xl text-center my-10'>레시피</h2>
          <RecipeCategory />
          {/* 레시피 리스트 */}
          <div></div>
        </div>
      </div>
    </div>
  )
}

export default Recipe
