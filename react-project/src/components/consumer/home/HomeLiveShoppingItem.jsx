import React, { useEffect, useState, useRef } from 'react'
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import { Link } from 'react-router-dom'

// 플러그인 등록
dayjs.extend(isBetween)

const HomeLiveShoppingItem = ({ cast }) => {
  const [remainingTime, setRemainingTime] = useState('')
  const scrollContainerRef = useRef(null)
  const [isLive, setIsLive] = useState(false)
  const [liveOff, setLiveOff] = useState(false)

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

  // 드래그 기능
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)

  const handleMouseDown = (e) => {
    setIsDragging(true)
    setStartX(e.clientX)
    setScrollLeft(scrollContainerRef.current.scrollLeft)
  }

  const handleMouseMove = (e) => {
    if (!isDragging) return
    const x = e.clientX - startX
    scrollContainerRef.current.scrollLeft = scrollLeft - x
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  useEffect(() => {
    const currentTime = dayjs()
    const startTime = dayjs(cast.startAt)
    const endTime = dayjs(cast.endAt)
    if (currentTime.isBetween(startTime, endTime)) {
      setIsLive(true)
    }
    if (currentTime.isAfter(endTime)) {
      setLiveOff(true)
    }
  }, [])

  return (
    <div className='flex flex-col justify-center items-center p-6 bg-white rounded border border-[#6F4E37]'>
      <h4 className='text-xl font-semibold mb-2'>{cast.title}</h4>
      <p className='text-gray-600 mb-4'>{cast.content}</p>

      {/* 방송 시간 */}
      <div className='mb-4'>
        <p className='text-gray-500'>방송 시간</p>
        <p className='font-semibold'>{`${dayjs(cast.startAt).format('HH:MM')} ~ ${dayjs(cast.endAt).format('HH:MM')}`}</p>
      </div>
      {liveOff ? (
        <div className='mb-4'>
          <p>종료된 방송입니다.</p>
        </div>
      ) : (
        <>
          {isLive ? (
            <div className='w-full h-[50px] flex justify-center items-center mb-4'>
              <Link to={'/liveShopping'}>
                {/* 라이브 이동 */}
                <button className='text-[#6F4E37]'>라이브 보러가기</button>
              </Link>
            </div>
          ) : (
            <div className='mb-4'>
              {/* 남은 시간 */}
              <p className='text-gray-500'>남은 방송 시간</p>
              <p className='font-semibold text-red-500'>{remainingTime}</p>
            </div>
          )}
        </>
      )}

      {/* 방송 상품 목록 */}
      <div className='w-full'>
        <h5 className='text-lg font-semibold mb-2'>방송 상품</h5>
        <div
          ref={scrollContainerRef}
          className='flex gap-3 overflow-x-auto no-scrollbar cursor-grab'
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp} // 마우스가 벗어났을 때도 드래그 끝내기
        >
          {cast.castItemList.map((item) => (
            <div
              key={item.itemNo}
              className='relative border-[#6F4E37] border rounded-md shadow-md'
            >
              {/* 상품 이미지 (이미지 src는 나중에 불러오기) */}
              <div className='w-[150px] h-[150px] bg-white rounded-md'>
                {/* 이미지 src는 나중에 연결 */}
              </div>

              {/* 툴팁: 상품 이름 */}
              <div className='absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-black/60 text-white text-xs rounded-md opacity-0 hover:opacity-100 transition-opacity'>
                {item.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default HomeLiveShoppingItem
