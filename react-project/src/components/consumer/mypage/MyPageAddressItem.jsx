import React, { useEffect, useRef, useState } from 'react'
import API from '../../../utils/API'

const MyPageAddressItem = ({
  addressItem,
  addresses,
  setAddresses,
  baseAddressNo,
  setBaseAddress,
}) => {
  const [showUpdateForm, setShowUpdateForm] = useState(false) // 업데이트 폼 노출

  const [currentAddressItem, setCurrentAddressItem] = useState(addressItem)

  const [postCode, setPostCode] = useState(addressItem.postalCode) // 우편번호
  const [address, setAddress] = useState(addressItem.address) // 주소
  const addressDetailRef = useRef() // 상세 주소
  const nameRef = useRef() // 이름

  useEffect(() => {
    setCurrentAddressItem(addressItem)
  }, [addressItem])

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
  // 기본 배송지 변경
  const updateBaseAddress = (e) => {
    e.preventDefault()
    const addressNo = currentAddressItem.addressNo
    API.post('/address/base', addressNo)
      .then((res) => {
        console.log(res)
        setBaseAddress(res.data.result.data)
      })
      .catch((err) => {
        console.error(err)
      })
  }

  // 주소 변경 함수
  const updateAddress = (e) => {
    e.preventDefault()
    // 주소 변경 요청
    const payload = {
      postalCode: postCode,
      address: address,
      addressDetail: addressDetailRef.current.value,
      name: nameRef.current.value,
    }
    API.put(`/address/${addressItem.addressNo}`, payload)
      .then((res) => {
        console.log(res)
        const result = res.data.result.data
        const temp = [...addresses]
        temp.map((v) => (v.addressNo === result.addressNo ? result : v))
        setAddresses(temp)
        setCurrentAddressItem(result)
        setShowUpdateForm(false)
      })
      .catch((err) => {
        console.error(err)
      })
  }

  // 배송지 삭제
  const deleteAddress = (e) => {
    e.preventDefault()
    API.delete(`/address/${addressItem.addressNo}`)
      .then((res) => {
        console.log(res)
        setAddresses((prev) => prev.filter((v) => v.addressNo !== addressItem.addressNo))
      })
      .catch((err) => {
        console.log(err)
      })
  }

  return (
    <div>
      {addressItem.addressNo === baseAddressNo && (
        <p className='text-gray-400 text-sm'>기본 배송지</p>
      )}
      <div>
        <p>{`[${currentAddressItem.name}] ${currentAddressItem.address} ${currentAddressItem.addressDetail}`}</p>
        <div className='flex gap-3'>
          {currentAddressItem.addressNo !== baseAddressNo && (
            <button className='text-sm text-[#6F4E37]' onClick={updateBaseAddress}>
              기본 배송지로 변경
            </button>
          )}
          <button className='text-sm' onClick={() => setShowUpdateForm(!showUpdateForm)}>
            수정
          </button>
          <button className='text-sm text-red-600' onClick={deleteAddress}>
            삭제
          </button>
        </div>
      </div>
      {/* 주소 변경 폼 */}
      {showUpdateForm && (
        <div>
          <form key={addressItem.addressNo} className='my-5' onSubmit={updateAddress}>
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
                    defaultValue={currentAddressItem.name}
                  />
                  <input
                    type='text'
                    id='addressDetail'
                    className='w-[390px] h-[50px] border border-gray-400 rounded px-3'
                    placeholder='상세 주소'
                    ref={addressDetailRef}
                    defaultValue={currentAddressItem.addressDetail}
                  />
                </div>
              </div>
              <input
                type='submit'
                value='변경하기'
                className='w-[100px] bg-[#A67B5B] hover:bg-[#6F4E37] text-white rounded'
              />
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

export default MyPageAddressItem
