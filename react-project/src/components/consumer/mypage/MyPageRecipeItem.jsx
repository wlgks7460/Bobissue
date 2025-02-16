import React from 'react'
import { Link } from 'react-router-dom'
import API from '../../../utils/API'
import reciepeDefaultImg from '../../../assets/consumer/recipeDefault.webp'

const MyPageRecipeItem = ({ recipe, getRecipeData }) => {
  const imgSrc = recipe.images[0]?.imageUrl || reciepeDefaultImg

  // 레시피 삭제 기능
  const deleteRecipe = (e) => {
    e.preventDefault()
    API.delete(`/recipe/${recipe.recipeNo}`)
      .then((res) => {
        getRecipeData()
      })
      .catch((err) => {
        console.error(err)
      })
  }
  return (
    <div className='flex flex-col justify-center items-center'>
      <img src={imgSrc} alt='' className='w-[200px] h-[200px] rounded mb-2' />
      <span className='w-[200px] text-lg text-center mb-2 turncate'>{recipe.name}</span>
      <div className='flex justify-center gap-4'>
        <Link to={`/mypage/recipe/update/${recipe.recipeNo}`} className='text-[#6F4E37]'>
          수정
        </Link>
        <button className='text-red-600' onClick={deleteRecipe}>
          삭제
        </button>
      </div>
    </div>
  )
}

export default MyPageRecipeItem
