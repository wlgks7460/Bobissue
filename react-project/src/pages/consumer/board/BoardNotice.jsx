import React, { useEffect, useState } from 'react'
import API from '../../../utils/API'

const BoardNotice = () => {
  const [notice, setNotice] = useState([])

  // 공지사항 불러오기
  const getNotice = () => {
    API.get('/notification')
      .then((res) => {
        console.log(res)
      })
      .catch((err) => {
        console.error(err)
      })
  }
  useEffect(() => {
    // mount
    getNotice()
    // unmount
    return () => {}
  }, [])
  return (
    <div className='p-5'>
      <h2 className='text-2xl text-center mb-10'>공지사항</h2>
      <div>
        <table></table>
      </div>
    </div>
  )
}

export default BoardNotice
