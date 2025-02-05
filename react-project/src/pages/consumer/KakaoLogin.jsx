import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import API from '../../utils/API'
import KakaoJoin from '../../components/consumer/socialLogin/KakaoJoin'
import ClipLoader from 'react-spinners/ClipLoader'

const KakaoLogin = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [kakaoToken, setKakaoToken] = useState('')
  // 가입하지 않은 회원에게 보일 가입 폼
  const [showJoinForm, setShowJoinForm] = useState(true)

  useEffect(() => {
    const token = searchParams.get('code')
    setKakaoToken(token)
    const payload = {
      accessToken: token,
    }
    console.log(kakaoToken)
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
    <div>
      <div className='w-full min-h-[70vh]'>
        {showJoinForm ? (
          <KakaoJoin kakaoToken={kakaoToken} />
        ) : (
          <div className='w-full min-h-[70vh] flex justify-center items-center'>
            <ClipLoader size={150} color='#000' loading={!showJoinForm} />
          </div>
        )}
      </div>
    </div>
  )
}

export default KakaoLogin
