import React, { useEffect, useRef, useState } from 'react'
import API from '../../../utils/API'

const MyPageInfoForm = ({ userNo }) => {
  const [userInfo, setUserInfo] = useState({})

  const nameRef = useRef() // 이름
  const birthRef = useRef() // 생년월일
  const [maxday, setMaxday] = useState() // 현재 날짜
  const phoneRef = useRef() // 전화번호
  const [gender, setGender] = useState('') // 성별
  const heightRef = useRef() // 키
  const weightRef = useRef() // 몸무게

  // 성별 값 변경 함수
  const handleGender = (e) => {
    setGender(e.target.value)
  }

  // 정보 수정 함수
  const updateUserInfo = (e) => {
    e.preventDefault()
    const payload = {
      email: userInfo.email,
      name: nameRef.current.value,
      birthday: birthRef.current.value.split('-').join(''),
      phoneNumber: phoneRef.current.value,
      gender: gender,
      height: heightRef.current.value || 0.0,
      weight: weightRef.current.value || 0.0,
    }
    if (!payload.name.trim()) {
      alert('이름을 확인해주세요.')
    } else if (!payload.phoneNumber.trim()) {
      alert('전화번호를 확인해주세요.')
    } else {
      console.log(payload)
      API.post(`/users/${userInfo.userNo}`, payload)
        .then((res) => {
          console.log(res)
        })
        .catch((err) => {
          console.error(err)
        })
    }
  }
  // 날짜 format
  const formatDate = (date) => {
    return date?.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')
  }
  // 현재 날짜 가져오기
  useEffect(() => {
    // mount
    API.get(`/users/profile`)
      .then((res) => {
        console.log(res.data)
        setUserInfo(res.data.result.data)
        setGender(res.data.result.data.gender)
      })
      .catch((err) => {
        console.error(err)
      })
    const tempDate = new Date()
    const year = tempDate.getFullYear() - 14
    const month = `${tempDate.getMonth() + 1}`.padStart(2, '0')
    const date = tempDate.getDate().toString().padStart(2, '0')
    setMaxday(`${year}-${month}-${date}`)
    // unmount
    return () => {}
  }, [])
  return (
    <div className='w-full flex justify-center'>
      <form className='flex flex-col gap-5 my-10' onSubmit={updateUserInfo}>
        {/* 이름 */}
        <div className='flex items-center'>
          <label htmlFor='name' className='inline-block w-[150px] me-5'>
            이름<span className='text-red-600'>*</span>
          </label>
          <input
            type='text'
            id='name'
            className='w-[400px] h-[50px] border border-gray-400 rounded px-3'
            placeholder='이름을 입력해주세요.'
            defaultValue={userInfo.name || ''}
            ref={nameRef}
          />
        </div>
        {/* 생년월일 */}
        <div className='flex items-center'>
          <p className='inline-block w-[150px] me-5'>
            생년월일<span className='text-red-600'>*</span>
          </p>
          <input
            type='date'
            min='1900-01-01'
            max={maxday}
            defaultValue={formatDate(userInfo.birthday)}
            className='w-[400px] h-[50px] border border-gray-400 rounded px-3'
            ref={birthRef}
          />
        </div>
        {/* 전화번호 */}
        <div className='flex items-center'>
          <label htmlFor='phone' className='inline-block w-[150px] me-5'>
            전화번호<span className='text-red-600'>*</span>
          </label>
          <input
            type='tel'
            pattern='[0-9]{3}-[0-9]{3,4}-[0-9]{4}'
            id='phone'
            className='w-[400px] h-[50px] border border-gray-400 rounded px-3'
            placeholder='-포함하여 입력해주세요.'
            defaultValue={userInfo.phoneNumber || ''}
            ref={phoneRef}
          />
        </div>
        {/* 성별 */}
        <div className='flex items-center'>
          <p className='inline-block w-[150px] me-5'>
            성별<span className='text-red-600'>*</span>
          </p>
          <div className='grid grid-cols-2 w-[400px]'>
            <div className='flex items-center'>
              <input
                type='radio'
                id='male'
                name='gender'
                value='M'
                className='w-5 h-5 me-5 accent-indigo-600'
                onChange={handleGender}
                checked={gender === 'M'}
              />
              <label htmlFor='male'>남</label>
            </div>
            <div className='flex items-center'>
              <input
                type='radio'
                id='female'
                name='gender'
                value='F'
                className='w-5 h-5 me-5 accent-indigo-600'
                onChange={handleGender}
                checked={gender === 'F'}
              />
              <label htmlFor='female'>여</label>
            </div>
          </div>
        </div>
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
          value='수정하기'
          className='w-full h-[50px] border border-gray-400 rounded bg-indigo-400 hover:bg-indigo-600 text-white cursor-pointer'
        />
      </form>
    </div>
  )
}

export default MyPageInfoForm
