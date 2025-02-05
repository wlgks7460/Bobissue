import React, { useRef, useState } from 'react'
import API from '../../../utils/API'

const NaverJoin = ({ naverToken }) => {
  const [postcode, setPostCode] = useState('') // 우편번호
  const [address, setAddress] = useState('') // 주소
  const addressDetailRef = useRef() // 상세주소
  const heightRef = useRef() // 키
  const weightRef = useRef() // 몸무게

  // 주소 찾기 함수
  const searchAddress = () => {
    new daum.Postcode({
      oncomplete: function (data) {
        // data에 들어있는 정보를 변수에 담아주면 됩니다.
        setPostCode(data.zonecode)
        setAddress(data.address)
      },
    }).open()
    addressDetailRef.current.focus()
  }

  // 회원 가입
  const naverJoin = (e) => {
    e.preventDefault()
    const payload = {
      accessToken: naverToken,
      postcode: postcode,
      address: address,
      addressDetail: addressDetailRef.current.value,
      height: heightRef.current.value || 0.0,
      weight: weightRef.current.value || 0.0,
    }
    if (!payload.postcode || !payload.address || !payload.addressDetail) {
      // 주소 입력 확인
      alert('주소를 입력해주세요.')
    } else {
      API.post('/users/social', payload)
        .then((res) => {
          console.log(res)
        })
        .catch((err) => {
          console.error(err)
        })
    }
  }
  return (
    <div className='w-full flex justify-center'>
      <form className='flex flex-col gap-5 my-10' onSubmit={naverJoin}>
        <h2 className='text-2xl text-center font-bold mb-5'>추가정보를 작성해주세요!</h2>
        {/* 주소 */}
        <div className='flex items-center'>
          <label htmlFor='postcode' className='inline-block w-[150px] me-5'>
            주소<span className='text-red-600'>*</span>
          </label>
          <div className='w-[400px]'>
            <div className='flex justify-between mb-2'>
              <input
                type='text'
                id='postcode'
                className='w-[100px] h-[50px] border border-gray-400 rounded px-3'
                onFocus={searchAddress}
                placeholder='우편번호'
                value={postcode || ''}
                readOnly
              />
              <input
                type='text'
                id='address'
                className='w-[290px] h-[50px] border border-gray-400 rounded px-3'
                onFocus={searchAddress}
                placeholder='주소'
                value={address || ''}
                readOnly
              />
            </div>
            <input
              type='text'
              id='addressDetail'
              className='w-[400px] h-[50px] border border-gray-400 rounded px-3'
              placeholder='상세 주소'
              ref={addressDetailRef}
            />
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
          value='회원가입'
          className='w-full h-[50px] border border-gray-400 rounded bg-indigo-400 hover:bg-indigo-600 text-white cursor-pointer'
        />
      </form>
    </div>
  )
}

export default NaverJoin
