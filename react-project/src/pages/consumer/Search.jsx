import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import SearchBar from '../../components/consumer/common/SearchBar'
import SearchItemList from '../../components/consumer/itemList/SearchItemList'
import API from '../../utils/API'

const Search = () => {
  // 쿼리스트링
  const [searchParams, setSearchParams] = useSearchParams()
  const search = searchParams.get('keyword')

  const [searchData, setSearchData] = useState([])

  // 검색 데이터 가져오기
  const getSearchResult = (page = 0) => {
    const payload = {
      search: search,
      page: page,
    }
    API.post(`/item/search`, payload)
      .then((res) => {
        setSearchData(res.data.result.data)
      })
      .catch((err) => {
        console.error(err)
      })
  }

  useEffect(() => {
    getSearchResult()
  }, [search])
  return (
    <div>
      <SearchBar />
      <div className='flex justify-center'>
        <div className='w-[70rem] min-h-[70vh]'>
          <h2 className='text-2xl text-center my-10'>
            <span className='text-[#6F4E37]'>"{search}"</span>에 대한 검색 결과
          </h2>
          <SearchItemList searchData={searchData} />
        </div>
      </div>
    </div>
  )
}

export default Search
