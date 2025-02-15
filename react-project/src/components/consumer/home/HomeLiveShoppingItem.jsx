import React, { useEffect, useState } from 'react'
import dayjs from 'dayjs'

const HomeLiveShoppingItem = ({ cast }) => {
  const [remainingTime, setRemainingTime] = useState('')

  // 남은 시간 계산 함수
  const calculateRemainingTime = () => {
    const currentTime = dayjs()
    const endTime = dayjs(cast.endAt)

    const diffInSeconds = endTime.diff(currentTime, 'second')

    if (diffInSeconds <= 0) {
      setRemainingTime('방송 종료')
    } else {
      const hours = Math.floor(diffInSeconds / 3600)
      const minutes = Math.floor((diffInSeconds % 3600) / 60)
      const seconds = diffInSeconds % 60

      setRemainingTime(`${hours}시간 ${minutes}분 ${seconds}초`)
    }
  }

  useEffect(() => {
    calculateRemainingTime()
    const interval = setInterval(calculateRemainingTime, 1000)

    // 컴포넌트가 unmount될 때 인터벌 클리어
    return () => clearInterval(interval)
  }, [cast.endAt])

  return (
    <div className='flex flex-col justify-center items-center p-6 bg-gray-100 rounded-lg'>
      <h4 className='text-xl font-semibold mb-2'>{cast.title}</h4>
      <p className='text-gray-600 mb-4'>{cast.content}</p>

      {/* 방송 시간 */}
      <div className='mb-4'>
        <p className='text-gray-500'>방송 시간</p>
        <p className='font-semibold'>{`${cast.startAt} ~ ${cast.endAt}`}</p>
      </div>

      {/* 남은 시간 */}
      <div className='mb-4'>
        <p className='text-gray-500'>남은 방송 시간</p>
        <p className='font-semibold text-red-500'>{remainingTime}</p>
      </div>

      {/* 방송 상품 목록 */}
      <div className='w-full'>
        <h5 className='text-lg font-semibold mb-2'>방송 상품</h5>
        <ul className='space-y-2'>
          {cast.castItemList.map((item) => (
            <li key={item.itemNo} className='p-3 bg-white rounded-md shadow-md'>
              <h6 className='font-semibold'>{item.name}</h6>
              <p className='text-gray-500'>{item.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default HomeLiveShoppingItem
