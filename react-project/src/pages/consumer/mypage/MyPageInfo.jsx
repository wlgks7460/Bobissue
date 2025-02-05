import React, { useEffect } from 'react'
import MyPageInfoForm from '../../../components/consumer/mypage/MyPageInfoForm'
import { useOutletContext } from 'react-router-dom'

const MyPageInfo = () => {
  const { userNo } = useOutletContext()
  return (
    <div className='p-5'>
      <h2 className='text-center text-xl'>개인정보 수정</h2>
      <MyPageInfoForm userNo={userNo} />
    </div>
  )
}

export default MyPageInfo
