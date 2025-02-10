import React, { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { ExclamationCircleIcon } from '@heroicons/react/24/solid'
import MyPageAddressForm from '../../../components/consumer/mypage/MyPageAddressForm'
import MyPageAddressItem from '../../../components/consumer/mypage/MyPageAddressItem'
import API from '../../../utils/API'

const MyPageAddress = () => {
  const { userNo } = useOutletContext()
  const [addresses, setAddresses] = useState([]) // 배송지 리스트

  const getAddresses = () => {
    API.get('/address/list')
      .then((res) => {
        console.log(res)
        setAddresses(res.data.result.data)
      })
      .catch((err) => {
        console.error(err)
      })
  }
  useEffect(() => {
    getAddresses()
  }, [])
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
            <MyPageAddressItem key={v.addressNo} addressItem={v} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default MyPageAddress
