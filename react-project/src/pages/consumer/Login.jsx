import React, { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import naverLogo from '../../assets/consumer/naverLoginLogo.png'
import kakaoLogo from '../../assets/consumer/kakaoLoginLogo.png'
import API from '../../utils/API'
import { useDispatch } from 'react-redux'
import { userReducerActions } from '../../redux/reducers/userSlice'
import { v4 as uuidv4 } from 'uuid'

const Login = () => {
  const dispatch = useDispatch()

  // 페이지 이동
  const navigate = useNavigate()

  // 로그인 관련 데이터
  const emailRef = useRef() // 이메일일
  const passwordRef = useRef() // 비밀번호

  // 로그인 요청 함수
  const login = (e) => {
    e.preventDefault()
    const payload = {
      email: emailRef.current.value,
      password: passwordRef.current.value,
      isOauth: false,
    }
    API.post('/auths/user-login', payload)
      .then((res) => {
        dispatch(userReducerActions.login({ ...res.data.result.data, status: 'consumer' }))
        navigate('/')
      })
      .catch((err) => {
        console.error(err)
      })
  }

  // 네이버 로그인 함수
  const naverLogin = (e) => {
    e.preventDefault()
  }

  // 카카오 로그인 함수
  const kakaoLogin = (e) => {
    e.preventDefault()
    window.location.href = `${import.meta.env.VITE_BOBISUUE_BASE_URL}/oauth2/authorization/kakao`
  }
  return (
    <div className='min-h-[70vh] flex justify-center pt-16'>
      <div className='flex flex-col'>
        <p className='text-2xl font-bold text-center mb-5'>로그인</p>
        {/* 회원 로그인 폼 */}
        <form className='login-form flex flex-col mb-2' onSubmit={login}>
          <input
            type='email'
            className='w-[350px] h-[50px] border border-gray-400 rounded px-5 mb-2'
            placeholder='이메일을 입력해주세요.'
            ref={emailRef}
          />
          <input
            type='password'
            className='w-[350px] h-[50px] border border-gray-400 rounded px-5 mb-3'
            placeholder='비밀번호를 입력해주세요.'
            ref={passwordRef}
          />
          <div className='flex justify-end text-sm text-gray-600 mb-5'>
            <span className='cursor-pointer hover:text-black'>비밀번호 찾기</span>
          </div>
          <input
            type='submit'
            value='로그인'
            className='w-[350px] h-[50px] border border-gray-400 rounded bg-[#A67B5B] hover:bg-[#6F4E37] text-white cursor-pointer'
          />
        </form>
        <button
          className='w-[350px] h-[50px] border border-[#6F4E37] rounded mb-5 cursor-pointer'
          onClick={() => navigate('/signup')}
        >
          회원가입
        </button>
        {/* 소셜 로그인 */}
        <div className='flex flex-col gap-2'>
          <button
            className='w-[350px] h-[50px] border rounded bg-[#03C75A] text-white flex justify-center items-center px-4 relative'
            onClick={naverLogin}
          >
            <img src={naverLogo} alt='네이버 로고' className='w-[45px] h-auto absolute left-0' />
            네이버로 로그인
          </button>
          <button
            className='w-[350px] h-[50px] border rounded bg-[#FEE500] flex justify-center items-center px-4 relative'
            onClick={kakaoLogin}
          >
            <img src={kakaoLogo} alt='카카오 로고' className='w-[25px] h-auto absolute left-2' />
            카카오로 로그인
          </button>
        </div>
      </div>
    </div>
  )
}

export default Login
