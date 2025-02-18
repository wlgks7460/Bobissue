import React from 'react'

const HomeEventBannerItem = ({ event }) => {
  return (
    <div className={`w-full h-72 `}>
      <img src={event.bannerImg} alt='' className='w-full h-72' />
    </div>
  )
}

export default HomeEventBannerItem
