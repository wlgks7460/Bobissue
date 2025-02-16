import React, { useEffect, useRef, useState } from 'react'
import API from '../../../utils/API'
import { useDispatch } from 'react-redux'
import { userReducerActions } from '../../../redux/reducers/userSlice'
import { useNavigate } from 'react-router-dom'

const MyPageInfoForm = ({ userNo }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [userInfo, setUserInfo] = useState({})

  const nameRef = useRef() // 이름
  const birthRef = useRef() // 생년월일
  const [maxday, setMaxday] = useState() // 현재 날짜
  const phoneRef = useRef() // 전화번호
  const heightRef = useRef() // 키
  const weightRef = useRef() // 몸무게

  // 정보 수정 함수
  const updateUserInfo = (e) => {
    e.preventDefault()
    const payload = {
      name: nameRef.current.value,
      birthday: birthRef.current.value.split('-').join(''),
      phoneNumber: phoneRef.current.value,
      height: heightRef.current.value || 0.0,
      weight: weightRef.current.value || 0.0,
    }
    if (!payload.name.trim()) {
      alert('이름을 확인해주세요.')
    } else if (!payload.phoneNumber.trim()) {
      alert('전화번호를 확인해주세요.')
    } else {
      API.put(`/users/${userInfo.userNo}`, payload)
        .then((res) => {
          alert('수정되었습니다.')
          dispatch(userReducerActions.setUserInfo(res.data.result.data))
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

  // 회원 탈퇴
  const deleteUser = (e) => {
    e.preventDefault()
    confirm('탈퇴하시겠습니까?')
    API.delete(`/users/${userNo}`)
      .then((res) => {
        console.log(res)
        if (res.status === 200) {
          dispatch(userReducerActions.logout())
          dispatch(userReducerActions.setUserInfo({}))
          navigate('')
        }
      })
      .catch((err) => {
        console.error(err)
      })
  }

  // 현재 날짜 가져오기
  useEffect(() => {
    // mount
    API.get(`/users/profile`)
      .then((res) => {
        setUserInfo(res.data.result.data)
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
            defaultValue={userInfo.height}
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
            defaultValue={userInfo.weight}
          />
        </div>
        <input
          type='submit'
          value='수정하기'
          className='w-full h-[50px] rounded bg-[#A67B5B] hover:bg-[#6F4E37] text-white cursor-pointer'
        />
        <button
          className='w-full h-[50px] bg-red-400 hover:bg-red-600 text-white rounded'
          onClick={deleteUser}
        >
          탈퇴하기
        </button>
      </form>
    </div>
  )
}

export default MyPageInfoForm
