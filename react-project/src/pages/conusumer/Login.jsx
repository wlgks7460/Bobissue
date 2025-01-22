import React, { useRef } from 'react'
import { Link } from 'react-router-dom'
import naverLogo from '../../assets/consumer/naverLoginLogo.png'
import kakaoLogo from '../../assets/consumer/kakaoLoginLogo.png'

const Login = () => {
  const idRef = useRef() // 아이디
  const passwordRef = useRef() // 비밀번호호

  // 로그인 요청 함수
  const login = (e) => {
    e.preventDefault()
    console.log(idRef.current.value, passwordRef.current.value)
  }

  // 네이버 로그인 함수
  const naverLogin = () => {}

  // 카카오 로그인 함수
  const kakaoLogin = () => {}
  return (
    <div className='min-h-[80vh] flex justify-center items-center'>
      <div className='flex flex-col'>
        <p className='text-2xl font-bold text-center mb-5'>로그인</p>
        {/* 회원 로그인 폼 */}
        <form className='login-form flex flex-col mb-2' onSubmit={login}>
          <input
            type='text'
            className='w-[350px] h-[50px] border border-gray-400 rounded px-5 mb-2'
            placeholder='아이디를 입력해주세요.'
            ref={idRef}
          />
          <input
            type='password'
            className='w-[350px] h-[50px] border border-gray-400 rounded px-5 mb-3'
            placeholder='비밀번호를 입력해주세요.'
            ref={passwordRef}
          />
          <div className='flex justify-end text-sm text-gray-600 mb-5'>
            <span className='cursor-pointer hover:text-black'>아이디 찾기</span>
            <span className='mx-2'>|</span>
            <span className='cursor-pointer hover:text-black'>비밀번호 찾기</span>
          </div>
          <input
            type='submit'
            value='로그인'
            className='w-[350px] h-[50px] border border-gray-400 rounded bg-indigo-400 hover:bg-indigo-600 text-white cursor-pointer'
          />
        </form>
        <Link
          to='/signup'
          className='w-[350px] h-[50px] border border-gray-400 rounded mb-5 cursor-pointer flex justify-center items-center'
        >
          회원가입
        </Link>
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
