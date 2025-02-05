import React, { useEffect } from 'react'
import SearchBar from '../../components/consumer/common/SearchBar'
import API from '../../utils/API'
import MypageSidebar from '../../components/consumer/mypage/MypageSidebar'

const MyPage = () => {
  useEffect(() => {
    // mount
    API.get('/users/profile')
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
      <div className='w-full min-h-[70vh] flex justify-center'>
        <div className='w-[70rem] flex justify-between gap-10 my-10'>
          <MypageSidebar />
          {/* 마이페이지 컨테이너 */}
          <div className='grow'>우라라랄</div>
        </div>
      </div>
    </div>
  )
}

export default MyPage
