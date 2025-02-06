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
      provider: 'kakao',
    }
    console.log(token)
    API.post('/auths/social/login', payload, { headers: { accessToken: token } })
      .then((res) => {
        console.log(res)
      })
      .catch((err) => {
        console.error(err)
        if (err.response.status === 404) {
          setShowJoinForm(true)
        } else {
          window.location.href = '/login'
        }
      })
  }, [])
  return (
    <div>
      <div className='w-full min-h-[70vh]'>
        {showJoinForm ? (
          <KakaoJoin kakaoToken={kakaoToken} />
        ) : (
          <div className='w-full min-h-[70vh] flex justify-center items-center'>
            <ClipLoader size={50} color='#4f39f6' loading={!showJoinForm} />
          </div>
        )}
      </div>
    </div>
  )
}

export default KakaoLogin
