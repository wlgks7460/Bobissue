import React, { useRef, useState } from 'react'

const MyPageAddressForm = () => {
  const [postCode, setPostCode] = useState('') // 우편번호
  const [address, setAddress] = useState('') // 주소
  const addressDetailRef = useRef() // 상세 주소
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
  const createAddress = (e) => {
    e.preventDefault()
  }
  return (
    <form className='my-5' onSubmit={createAddress}>
      <h3 className='text-lg mb-5'>배송지 추가</h3>
      <div className='flex justify-between px-3'>
        <div className='w-[600px]'>
          <div className='flex justify-between mb-2'>
            <input
              type='text'
              id='postcode'
              className='w-[200px] h-[50px] border border-gray-400 rounded px-3'
              onFocus={searchAddress}
              placeholder='우편번호'
              value={postCode || ''}
              readOnly
            />
            <input
              type='text'
              id='address'
              className='w-[390px] h-[50px] border border-gray-400 rounded px-3'
              onFocus={searchAddress}
              placeholder='주소'
              value={address || ''}
              readOnly
            />
          </div>
          <input
            type='text'
            id='addressDetail'
            className='w-[600px] h-[50px] border border-gray-400 rounded px-3'
            placeholder='상세 주소'
            ref={addressDetailRef}
          />
        </div>
        <input
          type='submit'
          value='추가하기'
          className='w-[100px] bg-indigo-400 hover:bg-indigo-600 text-white rounded'
        />
      </div>
    </form>
  )
}

export default MyPageAddressForm
