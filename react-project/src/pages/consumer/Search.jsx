import React from 'react'
import { useSearchParams } from 'react-router-dom'
import SearchBar from '../../components/consumer/common/SearchBar'
import SearchItemList from '../../components/consumer/itemList/SearchItemList'

const Search = () => {
  // 쿼리스트링
  const [searchParams, setSearchParams] = useSearchParams()

  return (
    <div>
      <SearchBar />
      <div className='flex justify-center'>
        <div className='w-[70rem] min-h-[70vh]'>
          <h2 className='text-2xl text-center my-10'>
            <span className='text-indigo-600'>"{searchParams.get('keyword')}"</span>에 대한 검색
            결과
          </h2>
          <SearchItemList keyword={searchParams.get('keyword')} />
        </div>
      </div>
    </div>
  )
}

export default Search
