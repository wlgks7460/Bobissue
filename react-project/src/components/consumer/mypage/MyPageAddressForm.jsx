import React, { useRef, useState } from 'react'
import API from '../../../utils/API'

const MyPageAddressForm = ({ addresses, setAddresses }) => {
  const [postCode, setPostCode] = useState() // 우편번호
  const [address, setAddress] = useState() // 주소
  const addressDetailRef = useRef() // 상세 주소
  const nameRef = useRef() // 이름
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
    const payload = {
      postalCode: postCode,
      address: address,
      addressDetail: addressDetailRef.current.value,
      name: nameRef.current.value,
    }
    if (!payload.postalCode || !payload.address || !payload.addressDetail || !payload.name) {
      alert('배송지를 작성해주세요.')
    } else {
      API.post('/address', payload)
        .then((res) => {
          console.log(res)
          const temp = [...addresses]
          temp.push({
            ...payload,
            addressNo: res.data.result.data,
          })
          setAddresses(temp)
          setPostCode(null)
          setAddress(null)
          addressDetailRef.current.value = ''
          nameRef.current.value = ''
        })
        .catch((err) => {
          console.error(err)
        })
    }
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
          <div className='flex justify-between'>
            <input
              type='text'
              className='w-[200px] h-[50px] border border-gray-400 rounded px-3'
              placeholder='별칭'
              ref={nameRef}
            />
            <input
              type='text'
              id='addressDetail'
              className='w-[390px] h-[50px] border border-gray-400 rounded px-3'
              placeholder='상세 주소'
              ref={addressDetailRef}
            />
          </div>
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
