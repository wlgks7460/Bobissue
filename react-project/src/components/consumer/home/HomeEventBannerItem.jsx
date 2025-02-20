import React from 'react'

const HomeEventBannerItem = ({ event }) => {
  return (
    <div className={`w-full h-[300px] overflow-x-hidden`}>
      <img src={event.bannerImg} alt='' className='w-full h-[300px]' />
    </div>
  )
}

export default HomeEventBannerItem
