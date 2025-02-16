import React, { useRef, useState } from 'react'

const PaymentAddressModal = ({
  showModal,
  setShowModal,
  savedAddresses,
  setSavedAddresses,
  selectAddress,
}) => {
  if (!showModal) return null

  // 새 배송지 추가
  const [newPostCode, setNewPostCode] = useState()
  const [newAddress, setNewAddress] = useState()
  const newAddressDetailRef = useRef()

  // 주소 찾기 함수
  const searchAddress = () => {
    new daum.Postcode({
      oncomplete: (data) => {
        setNewPostCode(data.zonecode)
        setNewAddress(data.address)
        newAddressDetailRef.current.focus()
      },
    }).open()
  }

  // 배송지 추가
  const addAddress = () => {
    const newAddr = {
      postcode: newPostCode,
      address: newAddress,
      addressDetail: newAddressDetailRef.current.value,
    }
    if (newAddr.postcode && newAddr.address && newAddr.addressDetail) {
      console.log('배송지 추가 :', newAddr)
      setSavedAddresses((prev) => [...prev, newAddr])
    }
  }

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20'>
      <div className='bg-white p-6 rounded-lg w-96'>
        <h3 className='text-lg font-semibold mb-4'>배송지 선택</h3>
        <ul>
          {savedAddresses.map((addr, index) => (
            <li
              key={index}
              className='p-2 border-b cursor-pointer'
              onClick={() => selectAddress(addr)}
            >
              [{addr.name}] {addr.address}
              <p>{addr.addressDetail}</p>
            </li>
          ))}
        </ul>
        <div className='mt-5'>
          <h3 className='mb-3'>새 배송지 입력</h3>
          <div className='flex space-x-2 mb-3'>
            <input
              type='text'
              placeholder='우편번호'
              value={newPostCode}
              readOnly
              className='w-1/3 p-2 border border-[#6F4E37] rounded cursor-pointer'
              onClick={searchAddress}
            />
            <input
              type='text'
              placeholder='주소'
              value={newAddress}
              readOnly
              className='w-2/3 p-2 border border-[#6F4E37] rounded cursor-pointer'
              onClick={searchAddress}
            />
          </div>
          <input
            type='text'
            placeholder='상세 주소'
            ref={newAddressDetailRef}
            className='w-full p-2 border border-[#6F4E37] rounded mb-3'
          />
          <button
            className='w-full h-[50px] text-white bg-[#A67B5B] hover:bg-[#6F4E37] rounded mt-5'
            onClick={addAddress}
          >
            추가
          </button>
        </div>
        <button className='w-full h-[50px] text-red-500 mt-5' onClick={() => setShowModal(false)}>
          닫기
        </button>
      </div>
    </div>
  )
}

export default PaymentAddressModal
