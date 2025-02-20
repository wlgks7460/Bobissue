import React, { useEffect, useState } from 'react'
import SearchBar from '../../components/consumer/common/SearchBar'
import { Link, useParams } from 'react-router-dom'
import API from '../../utils/API'
import CategoryItemList from '../../components/consumer/itemList/CategoryItemList'
import { useSelector } from 'react-redux'

const Category = () => {
  const params = useParams()
  const categoryState = useSelector((state) => state.category)
  const [category, setCategory] = useState() // 카테고리 정보
  const [parent, setParent] = useState()
  const [children, setChildren] = useState([])

  useEffect(() => {
    const categoryNo = Number(params.categoryNo)

    if (categoryState.categories?.length || [] > 0) {
      // categoryNo와 일치하는 카테고리를 찾음
      const selectedCategory = categoryState.categories.find((v) => v.categoryNo === categoryNo)

      if (selectedCategory) {
        setParent(selectedCategory.name)
        setChildren(selectedCategory.children || [])
      }
    }

    if (!params.child) {
      API.get(`/categories/${categoryNo}`)
        .then((res) => {
          setCategory(res.data.result.data)
        })
        .catch((err) => {
          console.error(err)
        })
    } else {
      API.get(`categories/${params.child}`)
        .then((res) => {
          setCategory(res.data.result.data)
        })
        .catch((err) => {
          console.error(err)
        })
    }
  }, [categoryState, params.categoryNo, params.child])
  return (
    <div>
      <SearchBar />
      <div className='flex justify-center'>
        <div className='w-[70rem] min-h-[70vh]'>
          <h2 className='text-2xl text-center my-10'>{parent}</h2>
          <div className='w-full min-h-[100px] border border-gray-400 rounded px-5 mb-32'>
            <div className='flex flex-wrap'>
              <Link
                to={`/category/${params.categoryNo}`}
                className={`w-[150px] text-center m-3 ${!params.child && 'text-[#6F4E37]'}`}
              >
                전체 보기
              </Link>
              {children?.map((v) => (
                <Link
                  to={`/category/${params.categoryNo}/${v.categoryNo}`}
                  key={v.categoryNo}
                  className={`w-[150px] text-center m-3 ${v.categoryNo === Number(params.child) && 'text-[#6F4E37]'}`}
                >
                  {v.name}
                </Link>
              ))}
            </div>
          </div>
          {category && <CategoryItemList items={category?.items} />}
        </div>
      </div>
    </div>
  )
}

export default Category
