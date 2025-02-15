import React, { useEffect, useState } from 'react'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { ArrowLeftCircleIcon, ArrowRightCircleIcon } from '@heroicons/react/24/outline'
import HomeEventBannerItem from './HomeEventBannerItem'
import bannerImg01 from '../../../assets/consumer/eventBanner/defaultBanner01.png'
import bannerImg02 from '../../../assets/consumer/eventBanner/defaultBanner02.png'
import bannerImg03 from '../../../assets/consumer/eventBanner/defaultBanner03.png'

const HomeEventBanner = () => {
  // 이벤트 리스트
  const [events, setEventes] = useState([])

  // 캐로셀
  const [activeItemIndex, setActicveItemIndex] = useState(0)

  //캐로셀 버튼
  const PrevBtn = ({ onClick }) => (
    <button className='absolute top-1/2 left-80 transform -translate-y-1/2 z-10' onClick={onClick}>
      {<ArrowLeftCircleIcon className='w-12 text-black/40' />}
    </button>
  )
  const NextBtn = ({ onClick }) => (
    <button className='absolute top-1/2 right-80 transform -translate-y-1/2 z-10' onClick={onClick}>
      {<ArrowRightCircleIcon className='w-12 text-black/40' />}
    </button>
  )

  // 캐로셀 세팅
  const settings = {
    dots: false, // 개수 표시 점
    infinite: true, // 무한 캐러셀
    speed: 500, // 다음 컨텐츠까지의 속도
    slidesToShow: 1, // 화면에 보이는 컨텐츠 수
    slidesToScroll: 1, // 스크롤 시 넘어가는 컨텐츠 수
    autoplay: true, // 자동 캐로셀
    autoplaySpeed: 3000, // 자동 캐로셀 속도
    draggable: false, // 드래그
    fade: false, // 페이드
    arrows: true, // 화살표 버튼
    prevArrow: <PrevBtn />,
    nextArrow: <NextBtn />,
    initalSlide: 1, // 시작 컨텐츠 번호
    pauseOnFocus: true, // foucs 시 정지
    pauseOnHover: true, // hover 시 정시
    beforeChange: (oldIndex, newIndex) => setActicveItemIndex(newIndex), // 인덱스 보여주기
  }

  useEffect(() => {
    // mount
    const res = [
      { eventNo: 0, content: '이벤트 1', bannerImg: bannerImg01 },
      { eventNo: 1, content: '이벤트 2', bannerImg: bannerImg02 },
      { eventNo: 2, content: '이벤트 3', bannerImg: bannerImg03 },
    ]
    setEventes(res)
  }, [])
  return (
    <>
      <div className='w-full h-[300px] relative'>
        <Slider {...settings}>
          {events.map((v) => (
            <HomeEventBannerItem key={v.eventNo} event={v} />
          ))}
        </Slider>
        <div className='absolute w-[70px] left-1/2 -translate-x-1/2 bottom-5 bg-black/40 rounded-full flex justify-center items-center'>
          <p className='text-gray-200 pt-1'>{`${activeItemIndex + 1} / ${events.length}`}</p>
        </div>
      </div>
    </>
  )
}

export default HomeEventBanner
