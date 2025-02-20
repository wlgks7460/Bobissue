import React, { useEffect, useState } from 'react'
import API from '../../../utils/API'
import { useDispatch } from 'react-redux'
import { loadingReducerActions } from '../../../redux/reducers/loadingSlice'

const RecipeCategory = ({ setRecipes }) => {
  const dispatch = useDispatch()
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
    dispatch(loadingReducerActions.setLoading(true))
    API.get('/recipe')
      .then((res) => {
        setSelectedCategory('all')
        setRecipes(res.data.result.data)
        dispatch(loadingReducerActions.setLoading(false))
      })
      .catch((err) => {
        console.error(err)
        dispatch(loadingReducerActions.setLoading(false))
      })
  }

  // 카테고리 상품 조회하기
  const getCategoryRecipe = (recipeNo) => {
    dispatch(loadingReducerActions.setLoading(true))
    API.get(`/recipecategory/${recipeNo}`)
      .then((res) => {
        setRecipes(res.data.result.data.recipes)
        setSelectedCategory(res.data.result.data.categoryNo)
        dispatch(loadingReducerActions.setLoading(false))
      })
      .catch((err) => {
        console.error(err)
        dispatch(loadingReducerActions.setLoading(false))
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
    <div className='w-full border border-gray-400 rounded px-5 mb-24'>
      <div className='flex flex-wrap'>
        <button
          className={`w-[150px] text-center m-3 ${selectedCategory === 'all' && 'text-[#6F4E37]'}`}
          onClick={getAllRecipe}
        >
          전체 보기
        </button>
        {categories?.map((v) => (
          <button
            key={v.categoryNo}
            className={`w-[150px] text-center m-3 ${selectedCategory === v.categoryNo && 'text-[#6F4E37]'}`}
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
