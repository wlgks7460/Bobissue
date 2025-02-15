import React from 'react'
import { Link } from 'react-router-dom'

const SellerLink = () => {
  return (
    <div className='w-full flex justify-center bg-gray-300'>
      <div className='w-[70rem]'>
        <Link to={'/seller'} className='text-xs'>
          판매자 사이트 가기
        </Link>
      </div>
    </div>
  )
}

export default SellerLink
