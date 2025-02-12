import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import API from '../../../utils/API'

const RecipeCategory = () => {
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('all')

  const getRecipeCategory = () => {
    API.get('/recipecategory')
      .then((res) => {
        console.log(res)
        setCategories(res.data.result.data)
      })
      .catch((err) => {
        console.error(err)
      })
  }

  useEffect(() => {
    // mount
    getRecipeCategory()
    // unmount
    return () => {}
  }, [])
  return (
    <div className='w-full border border-gray-400 rounded px-5 mb-10'>
      <div className='flex flex-wrap'>
        <Link to={``} className={`w-[150px] text-center m-3 `}>
          전체 보기
        </Link>
        {categories?.map((v) => (
          <Link to={``} key={v.categoryNo} className={`w-[150px] text-center m-3 `}>
            {v.name}
          </Link>
        ))}
      </div>
    </div>
  )
}

export default RecipeCategory
