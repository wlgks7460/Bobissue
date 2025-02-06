import React, { useRef, useState } from 'react'
import API from '../../../utils/API'

const NaverJoin = ({ naverToken }) => {
  const heightRef = useRef() // 키
  const weightRef = useRef() // 몸무게

  // 회원 가입
  const naverJoin = (e) => {
    e.preventDefault()
    const payload = {
      accessToken: naverToken,
      height: heightRef.current.value || 0.0,
      weight: weightRef.current.value || 0.0,
    }
    API.post('/users/social', payload)
      .then((res) => {
        console.log(res)
      })
      .catch((err) => {
        console.error(err)
      })
  }
  return (
    <div className='w-full flex justify-center'>
      <form className='flex flex-col gap-5 my-10' onSubmit={naverJoin}>
        <h2 className='text-2xl text-center font-bold mb-5'>추가정보를 작성해주세요!</h2>
        {/* 키 */}
        <div className='flex items-center'>
          <label htmlFor='height' className='inline-block w-[150px] me-5'>
            키
          </label>
          <input
            type='text'
            id='height'
            className='w-[400px] h-[50px] border border-gray-400 rounded px-3'
            placeholder='키(cm)를 입력해주세요.'
            pattern='^\d+(\.\d{1,2})?$'
            ref={heightRef}
          />
        </div>
        {/* 몸무게 */}
        <div className='flex items-center'>
          <label htmlFor='weight' className='inline-block w-[150px] me-5'>
            몸무게
          </label>
          <input
            type='text'
            id='weight'
            className='w-[400px] h-[50px] border border-gray-400 rounded px-3'
            placeholder='몸무게(kg)를 입력해주세요.'
            pattern='^\d+(\.\d{1,2})?$'
            ref={weightRef}
          />
        </div>
        <input
          type='submit'
          value='회원가입'
          className='w-full h-[50px] border border-gray-400 rounded bg-indigo-400 hover:bg-indigo-600 text-white cursor-pointer'
        />
      </form>
    </div>
  )
}

export default NaverJoin
