import React, { useEffect } from 'react'
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
  return <div>MyPage</div>
}

export default MyPage
