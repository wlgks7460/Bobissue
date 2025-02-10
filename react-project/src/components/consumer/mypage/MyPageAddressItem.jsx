import React, { useRef, useState } from 'react'

const MyPageAddressItem = ({ addressItem }) => {
  const [showUpdateForm, setShowUpdateForm] = useState(false) // 업데이트 폼 노출

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
  // 주소 변경 함수
  const updateAddress = (e) => {
    e.preventdefault()
    // 주소 변경 요청
  }
  return (
    <div>
      {addressItem.status === 'default' && <p className='text-gray-400 text-sm'>기본 배송지</p>}
      <div>
        <p>{`[${addressItem.name}] ${addressItem.address} ${addressItem.addressDetail}`}</p>
        <div className='flex gap-3'>
          {addressItem.status !== 'default' && (
            <button className='text-sm text-indigo-600'>기본 배송지로 변경</button>
          )}
          <button className='text-sm' onClick={() => setShowUpdateForm(!showUpdateForm)}>
            수정
          </button>
          <button className='text-sm text-red-600'>삭제</button>
        </div>
      </div>
      {/* 주소 변경 폼 */}
      {showUpdateForm && (
        <div>
          <form className='my-5' onSubmit={updateAddress}>
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
                value='변경하기'
                className='w-[100px] bg-indigo-400 hover:bg-indigo-600 text-white rounded'
              />
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

export default MyPageAddressItem
