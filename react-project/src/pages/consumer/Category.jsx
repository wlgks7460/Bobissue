import React, { useEffect, useState } from 'react'
import SearchBar from '../../components/consumer/common/SearchBar'
import { useParams } from 'react-router-dom'
import API from '../../utils/API'
import CategoryItemList from '../../components/consumer/itemList/CategoryItemList'

const Category = () => {
  const params = useParams()
  const [category, setCategory] = useState() // 카테고리 정보
  useEffect(() => {
    const categoryNo = params.categoryNo
    API.get(`/categories/${categoryNo}`)
      .then((res) => {
        console.log(res)
        setCategory(res.data.result.data)
      })
      .catch((err) => {
        console.error(err)
      })
  }, [])
  return (
    <div>
      <SearchBar />
      <div className='flex justify-center'>
        <div className='w-[70rem] min-h-[70vh]'>
          <h2 className='text-2xl text-center my-10'>{category?.name}</h2>
          {category && <CategoryItemList items={category?.items} />}
        </div>
      </div>
    </div>
  )
}

export default Category
