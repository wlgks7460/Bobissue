import React from 'react'
import MyPageInfoForm from '../../../components/consumer/mypage/MyPageInfoForm'
import { useSelector } from 'react-redux'

const MyPageInfo = () => {
  const userNo = useSelector((state) => state.user.userInfo.userNo)
  return (
    <div className='p-5'>
      <h2 className='text-center text-xl'>개인정보 수정</h2>
      <MyPageInfoForm userNo={userNo} />
    </div>
  )
}

export default MyPageInfo
