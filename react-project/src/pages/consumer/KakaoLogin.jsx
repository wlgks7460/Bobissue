import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import KakaoJoin from '../../components/consumer/socialLogin/KakaoJoin'
import ClipLoader from 'react-spinners/ClipLoader'
import { useDispatch } from 'react-redux'
import { userReducerActions } from '../../redux/reducers/userSlice'

const KakaoLogin = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  // 가입하지 않은 회원에게 보일 가입 폼
  const [showJoinForm, setShowJoinForm] = useState(false)

  const [data, setData] = useState({})

  useEffect(() => {
    const email = searchParams.get('email')
    const nickname = searchParams.get('nickname')
    if (email) {
      setShowJoinForm(true)
      setData({
        email: email,
        nickname: nickname,
      })
    } else {
      const accessToken = searchParams.get('accessToken')
      const refreshToken = searchParams.get('refreshToken')
      console.log(accessToken + ' ' + refreshToken)
      const payload = {
        accessToken,
        refreshToken,
        status: 'consumer',
      }
      dispatch(userReducerActions.login(payload))
      navigate('/')
    }
  }, [])
  return (
    <div>
      <div className='w-full min-h-[70vh]'>
        {showJoinForm ? (
          <KakaoJoin data={data} />
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
