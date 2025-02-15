import React, { useEffect, useState } from 'react'
import ItemsCarousel from 'react-items-carousel'
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
      <div className='w-full min-w-[70rem] h-72 mb-10 relative'>
        <ItemsCarousel
          requestToChangeActive={setActicveItemIndex}
          activeItemIndex={activeItemIndex}
          numberOfCards={1}
          slidesToScroll={1}
          leftChevron={<button>{<ArrowLeftCircleIcon className='w-12 text-black/40' />}</button>}
          rightChevron={<button>{<ArrowRightCircleIcon className='w-12 text-black/40' />}</button>}
          infiniteLoop={true}
          chevronWidth={300}
          className='px-10'
        >
          {events.map((v) => (
            <HomeEventBannerItem key={v.eventNo} event={v} />
          ))}
        </ItemsCarousel>
        <div className='absolute w-[70px] left-1/2 -translate-x-1/2 bottom-5 bg-black/40 rounded-full flex justify-center items-center'>
          <p className='text-gray-200 pt-1'>{`${(((activeItemIndex % events.length) + events.length) % events.length) + 1} / ${events.length}`}</p>
        </div>
      </div>
    </>
  )
}

export default HomeEventBanner
