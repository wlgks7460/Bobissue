import React, { useEffect, useState } from 'react'
import SearchBar from '../../components/consumer/common/SearchBar'
import { Link, useParams } from 'react-router-dom'
import API from '../../utils/API'
import CategoryItemList from '../../components/consumer/itemList/CategoryItemList'

const Category = () => {
  const params = useParams()
  const [category, setCategory] = useState() // 카테고리 정보
  const [semiCategory, setSemiCategory] = useState([])
  useEffect(() => {
    const categoryNo = params.categoryNo
    API.get(`/categories/${categoryNo}`)
      .then((res) => {
        console.log(res)
        setCategory(res.data.result.data)
        setSemiCategory([
          { no: 0, name: '세부1' },
          { no: 1, name: '세부2' },
          { no: 2, name: '세부3' },
          { no: 3, name: '세부4' },
          { no: 4, name: '세부5' },
          { no: 5, name: '세부6' },
          { no: 6, name: '세부7' },
          { no: 7, name: '세부8' },
        ])
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
          <div className='w-full border border-gray-400 rounded px-5 mb-10'>
            <div className='flex flex-wrap'>
              <Link className='w-[150px] text-center m-3'>전체 보기</Link>
              {semiCategory.map((v) => (
                <Link key={v.no} className='w-[150px] text-center m-3'>
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
