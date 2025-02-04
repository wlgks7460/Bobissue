import React, { useEffect } from 'react'
import SearchBar from '../../components/consumer/common/SearchBar'
import API from '../../utils/API'

const MyPage = () => {
  useEffect(() => {
    // mount
    API.get('/users')
      .then((res) => {
        console.log(res)
      })
      .catch((err) => {
        console.error(err)
      })
    // unmount
    return () => {}
  }, [])
  return (
    <div>
      <SearchBar />
      <div className='w-full min-h-[70vh]'></div>
    </div>
  )
}

export default MyPage
