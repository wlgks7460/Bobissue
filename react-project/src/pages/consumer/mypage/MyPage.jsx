import React, { useEffect, useState } from 'react'
import SearchBar from '../../../components/consumer/common/SearchBar'
import API from '../../../utils/API'
import MypageSidebar from '../../../components/consumer/mypage/MypageSidebar'
import { Outlet } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { userReducerActions } from '../../../redux/reducers/userSlice'

const MyPage = () => {
  const dispatch = useDispatch()
  // 사용자 정보
  const [userInfo, setUserInfo] = useState({})

  useEffect(() => {
    // mount
    API.get('/users/profile')
      .then((res) => {
        setUserInfo(res.data.result.data)
        dispatch(userReducerActions.setUserInfo(res.data.result.data))
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
          <MypageSidebar userInfo={userInfo} />
          {/* 마이페이지 컨테이너 */}
          <div className='grow h-auto border border-[#6F4E37] rounded'>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyPage
