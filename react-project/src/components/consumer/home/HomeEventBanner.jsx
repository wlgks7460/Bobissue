import React, { useEffect, useState } from 'react'
import ItemsCarousel from 'react-items-carousel'
import { ArrowLeftCircleIcon, ArrowRightCircleIcon } from '@heroicons/react/24/solid'
import HomeEventBannerItem from './HomeEventBannerItem'

const HomeEventBanner = () => {
  // 이벤트 리스트
  const [events, setEventes] = useState([])

  // 캐로셀
  const [activeItemIndex, setActicveItemIndex] = useState(0)

  useEffect(() => {
    // mount
    const res = [
      { eventNo: 0, content: '이벤트 1', bgColor: 'bg-indigo-600' },
      { eventNo: 1, content: '이벤트 2', bgColor: 'bg-red-400' },
      { eventNo: 2, content: '이벤트 3', bgColor: 'bg-orange-300' },
      { eventNo: 3, content: '이벤트 4', bgColor: 'bg-blue-400' },
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
          leftChevron={<button>{<ArrowLeftCircleIcon className='w-10' />}</button>}
          rightChevron={<button>{<ArrowRightCircleIcon className='w-10' />}</button>}
          infiniteLoop={true}
        >
          {events.map((v) => (
            <HomeEventBannerItem key={v.eventNo} event={v} />
          ))}
        </ItemsCarousel>
        <div className='absolute left-1/2 -translate-x-1/2 bottom-5'>
          <p className='text-gray-300'>{`${(activeItemIndex % events.length) + 1} / ${events.length}`}</p>
        </div>
      </div>
    </>
  )
}

export default HomeEventBanner
