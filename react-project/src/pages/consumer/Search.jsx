import React, { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import SearchBar from '../../components/consumer/common/SearchBar'
import SearchItemList from '../../components/consumer/itemList/SearchItemList'
import API from '../../utils/API'

const Search = () => {
  // 쿼리스트링
  const [searchParams, setSearchParams] = useSearchParams()

  // 검색 데이터 가져오기
  const getSearchResult = (page = 1) => {
    const payload = {
      search: searchParams.get('keyword'),
      page: page,
    }
    console.log(payload)
    // API.get('/search', payload)
    //   .then((res) => {
    //     console.log(res)
    //   })
    //   .catch((err) => {
    //     console.error(err)
    //   })
  }
  useEffect(() => {
    getSearchResult(1)
  }, [])
  return (
    <div>
      <SearchBar />
      <div className='flex justify-center'>
        <div className='w-[70rem] min-h-[70vh]'>
          <h2 className='text-2xl text-center my-10'>
            <span className='text-[#6F4E37]'>"{searchParams.get('keyword')}"</span>에 대한 검색 결과
          </h2>
          <SearchItemList keyword={searchParams.get('keyword')} />
        </div>
      </div>
    </div>
  )
}

export default Search
