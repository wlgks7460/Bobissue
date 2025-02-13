import React, { useEffect, useState } from 'react'
import API from '../../../utils/API'

const RecipeCategory = ({ setRecipes }) => {
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('all')

  const getRecipeCategory = () => {
    API.get('/recipecategory')
      .then((res) => {
        setCategories(res.data.result.data)
      })
      .catch((err) => {
        console.error(err)
      })
  }

  // 전체 상품 조회하기
  const getAllRecipe = () => {
    API.get('/recipe')
      .then((res) => {
        setRecipes(res.data.result.data)
      })
      .catch((err) => {
        console.error(err)
      })
  }

  // 카테고리 상품 조회하기
  const getCategoryRecipe = (recipeNo) => {
    API.get(`/recipecategory/${recipeNo}`)
      .then((res) => {
        console.log(res)
        setRecipes(res.data.result.data.recipes)
        setSelectedCategory(res.data.result.data.categoryNo)
      })
      .catch((err) => {
        console.error(err)
      })
  }

  useEffect(() => {
    // mount
    getRecipeCategory()
    getAllRecipe()
    // unmount
    return () => {}
  }, [])
  return (
    <div className='w-full border border-gray-400 rounded px-5 mb-10'>
      <div className='flex flex-wrap'>
        <button
          className={`w-[150px] text-center m-3 ${selectedCategory === 'all' && 'text-indigo-600'}`}
          onClick={getAllRecipe}
        >
          전체 보기
        </button>
        {categories?.map((v) => (
          <button
            key={v.categoryNo}
            className={`w-[150px] text-center m-3 ${selectedCategory === v.categoryNo && 'text-indigo-600'}`}
            onClick={() => getCategoryRecipe(v.categoryNo)}
          >
            {v.name}
          </button>
        ))}
      </div>
    </div>
  )
}

export default RecipeCategory
