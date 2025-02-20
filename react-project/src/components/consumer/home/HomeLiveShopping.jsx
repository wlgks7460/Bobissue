import React, { useEffect, useState } from 'react'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { ArrowLeftCircleIcon, ArrowRightCircleIcon } from '@heroicons/react/24/outline'
import { ExclamationCircleIcon } from '@heroicons/react/24/outline'
import HomeLiveShoppingItem from './HomeLiveShoppingItem'
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import API from '../../../utils/API'

// 플러그인 등록
dayjs.extend(isBetween)

const HomeLiveShopping = () => {
  const [castData, setCastData] = useState([])
  const [startIdx, setStartIdx] = useState(0)

  // 캐로셀 버튼
  const PrevBtn = ({ onClick }) => (
    <button className='absolute top-1/2 -left-20 transform -translate-y-1/2 z-10' onClick={onClick}>
      {<ArrowLeftCircleIcon className='w-12 text-black/40' />}
    </button>
  )
  const NextBtn = ({ onClick }) => (
    <button
      className='absolute top-1/2 -right-20 transform -translate-y-1/2 z-10'
      onClick={onClick}
    >
      {<ArrowRightCircleIcon className='w-12 text-black/40' />}
    </button>
  )

  // 캐로셀 설정
  const settings = {
    infinite: castData.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    draggable: false,
    fade: false,
    arrows: true,
    prevArrow: <PrevBtn />,
    nextArrow: <NextBtn />,
    initialSlide: startIdx,
    pauseOnFocus: true,
    pauseOnHover: true,
  }

  // 방송 조회
  const getCast = () => {
    API.get('/cast/todayList')
      .then((res) => {
        const data = res.data.result.data
        setCastData(data)

        const currentTime = dayjs()

        let currentIdx = data.findIndex((v) => {
          const startTime = dayjs(v.startAt)
          const endTime = dayjs(v.endAt)
          return currentTime.isBetween(startTime, endTime)
        })
        if (currentIdx === -1) {
          const upcomingIdx = data
            .filter((v) => dayjs(v.startAt).isAfter(currentTime)) // 아직 시작 안 한 방송만 필터링
            .sort((a, b) => dayjs(a.startAt).diff(dayjs(b.startAt))) // 시작 시간이 빠른 순으로 정렬
            .map((v) => data.indexOf(v))[0] // 가장 먼저 시작할 방송의 인덱스 찾기
          currentIdx = upcomingIdx ?? 0
        }
        setStartIdx(currentIdx)
      })
      .catch((err) => {
        console.error(err)
      })
  }

  useEffect(() => {
    getCast()
    const interval = setInterval(() => {
      getCast() // 10초마다 방송 데이터를 갱신
    }, 10000)

    return () => clearInterval(interval) // cleanup interval
  }, [])

  return (
    <div className='flex justify-center mt-20 mb-32'>
      <div className='w-[70rem] min-h-[300px]'>
        <h3 className='text-xl'>라이브 커머스</h3>
        <div className='w-full h-full flex justify-center items-center'>
          {castData.length > 0 ? (
            <div className='w-full  h-auto relative'>
              <Slider {...settings}>
                {castData.map((v) => (
                  <HomeLiveShoppingItem key={v.castNo} cast={v} />
                ))}
              </Slider>
            </div>
          ) : (
            <div className='flex flex-col gap-3 items-center'>
              <p className='text-center'>
                <ExclamationCircleIcon className='w-20 text-gray-400' />
              </p>
              <p className='text-center text-xl text-gray-600'>오늘은 방송이 없어요.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default HomeLiveShopping
