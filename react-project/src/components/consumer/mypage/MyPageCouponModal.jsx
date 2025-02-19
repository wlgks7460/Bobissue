import { ExclamationCircleIcon } from '@heroicons/react/24/outline'
import React from 'react'

const MyPageCouponModal = ({ setShowModal, coupons }) => {
  return (
    <div className='fixed top-0 left-0 z-50'>
      <div className='w-full h-full fixed bg-gray-600/80 flex justify-center items-center'>
        <div className='w-[600px] border border-gray-400 rounded bg-white p-5 flex flex-col'>
          <h2 className='text-center text-lg mb-5'>내 쿠폰</h2>
          {/* 모달 main */}
          <div className='min-h-[300px] overflow-y-auto'>
            {coupons.length > 0 ? (
              <div className='flex flex-col gap-3'>
                {coupons.map((v) => (
                  <div key={v.couponNo} className='w-full p-3 border border-[#6F4E37] rounded'>
                    <p className='font-bold'>{v.name}</p>
                    <p className=''>{v.content}</p>
                    <p className='text-gray-400 text-sm'>{v.term}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className='flex flex-col gap-3 items-center'>
                <p className='text-center'>
                  <ExclamationCircleIcon className='w-20 text-gray-400' />
                </p>
                <p className='text-center text-xl text-gray-600'>쿠폰이 없습니다.</p>
              </div>
            )}
          </div>
          <div className='flex-none flex justify-center mt-2'>
            <button className='text-red-600' onClick={() => setShowModal(false)}>
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyPageCouponModal
