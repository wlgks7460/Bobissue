import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import API from '../../utils/API'
import NaverJoin from '../../components/consumer/socialLogin/NaverJoin'
import ClipLoader from 'react-spinners/ClipLoader'

const NaverLogin = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [naverToken, setNaverToken] = useState('')
  // 가입하지 않은 회원에게 보일 가입 폼
  const [showJoinForm, setShowJoinForm] = useState(true)

  useEffect(() => {
    const token = searchParams.get('code')
    setNaverToken(token)
    const payload = {
      accessToken: naverToken,
    }
    console.log(naverToken)
    // API.post('/auths/social', payload)
    //   .then((res) => {
    //     console.log(res)
    //   })
    //   .catch((err) => {
    //     console.error(err)
    //     if (err.response.status === 404) {
    //       setShowJoinForm(true)
    //     } else {
    //       window.location.href = '/login'
    //     }
    //   })
  }, [])
  return (
    <div className='w-full min-h-[70vh]'>
      {showJoinForm ? (
        <NaverJoin naverToken={naverToken} />
      ) : (
        <div className='w-full min-h-[70vh] flex justify-center items-center'>
          <ClipLoader size={150} color='#000' loading={!showJoinForm} />
        </div>
      )}
    </div>
  )
}

export default NaverLogin
