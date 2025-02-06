import React, { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { ExclamationCircleIcon } from '@heroicons/react/24/solid'
import MyPageAddressForm from '../../../components/consumer/mypage/MyPageAddressForm'
import MyPageAddressItem from '../../../components/consumer/mypage/MyPageAddressItem'

const MyPageAddress = () => {
  const { userNo } = useOutletContext()
  const [addresses, setAddresses] = useState([]) // 배송지 리스트
  useEffect(() => {
    const res = [
      {
        addressNo: 0,
        userNo: userNo,
        postalCode: 11111,
        address: '광주 서구 죽봉대로 31',
        addressDetail: '1동 802호',
        status: 'default',
      },
      {
        addressNo: 1,
        userNo: userNo,
        postalCode: 11111,
        address: '광주 서구 염화로57번길 19',
        addressDetail: '203동 610호',
        status: 'normal',
      },
    ]
    setAddresses(res)
  }, [])
  return (
    <div className='p-5'>
      <h3 className='text-center text-xl'>배송지 관리</h3>
      <MyPageAddressForm />
      <hr className='my-5' />
      <div>
        <h3 className='text-lg mb-5'>내 배송지</h3>
        <div className='flex flex-col gap-5'>
          {addresses.length === 0 && (
            <div className='flex flex-col gap-3 items-center'>
              <p className='text-center'>
                <ExclamationCircleIcon className='w-20 text-gray-400' />
              </p>
              <p className='text-center text-lg'>배송지가 없습니다.</p>
            </div>
          )}
          {addresses.map((v) => (
            <MyPageAddressItem key={v.addressNo} addressItem={v} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default MyPageAddress
