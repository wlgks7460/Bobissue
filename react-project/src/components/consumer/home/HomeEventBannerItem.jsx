import React from 'react'

const HomeEventBannerItem = ({ event }) => {
  return (
    <div className={`w-full min-w-[70rem] h-72 flex justify-center items-center overflow-y-hidden`}>
      <img src={event.bannerImg} alt='' className='w-full h-72' />
    </div>
  )
}

export default HomeEventBannerItem
