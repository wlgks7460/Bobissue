import React from 'react'

const MypageSidebar = () => {
  return (
    <div className='flex-none w-[300px]'>
      <div className='w-full p-3 border rounded'>
        <div className='flex gap-3'>
          <h3 className='text-lg'>반갑습니다! ㅇㅇㅇ님!</h3>
          <div>마크</div>
        </div>
        <hr className='my-2' />
        <div className='flex justify-between gap-3'>
          <div className='w-[140px]'>
            <p className='text-sm text-gray-500'>발급된 쿠폰</p>
            <button>
              <span className='text-lg font-bold'>1</span> 장
            </button>
          </div>
          <div className='flex-none h-auto border border-gray-300'></div>
          <div className='w-[140px]'>
            <p className='text-sm text-gray-500'>포인트</p>
            <p className='text-lg font-bold'>00000</p>
          </div>
        </div>
      </div>
      <div className='w-full'></div>
    </div>
  )
}

export default MypageSidebar
