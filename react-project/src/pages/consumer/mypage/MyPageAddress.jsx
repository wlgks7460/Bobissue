import React, { useEffect, useState } from 'react'
import { ExclamationCircleIcon } from '@heroicons/react/24/outline'
import MyPageAddressForm from '../../../components/consumer/mypage/MyPageAddressForm'
import MyPageAddressItem from '../../../components/consumer/mypage/MyPageAddressItem'
import API from '../../../utils/API'
import { useSelector } from 'react-redux'

const MyPageAddress = () => {
  const userNo = useSelector((state) => state.user.userInfo.userNo)
  const [addresses, setAddresses] = useState([]) // 배송지 리스트
  const [baseAddress, setBaseAddress] = useState({}) // 기본 배송지

  // 기본 배송지 조회
  const getBaseAddress = () => {
    API.get('/address/base')
      .then((res) => {
        setBaseAddress(res.data.result.data)
      })
      .catch((err) => {
        console.error(err)
      })
  }

  // 배송지 리스트 조회
  const getAddresses = () => {
    const payload = {
      userNo: Number(userNo),
    }
    if (payload.userNo) {
      console.log(payload.userNo)
      API.post('/address/list', payload)
        .then((res) => {
          setAddresses(res.data.result.data)
          if (res.data.result.data.length > 0) {
            getBaseAddress()
          }
        })
        .catch((err) => {
          console.error(err)
        })
    }
  }
  useEffect(() => {
    getAddresses()
  }, [userNo])
  return (
    <div className='p-5'>
      <h3 className='text-center text-xl'>배송지 관리</h3>
      <MyPageAddressForm addresses={addresses} setAddresses={setAddresses} />
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
            <MyPageAddressItem
              key={v.addressNo}
              addressItem={v}
              addresses={addresses}
              setAddresses={setAddresses}
              baseAddressNo={baseAddress.addressNo}
              setBaseAddress={setBaseAddress}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default MyPageAddress
