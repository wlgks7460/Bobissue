import React from 'react'

const HomeEventBannerItem = ({ event }) => {
  return (
    <div className={`w-full min-w-[70rem] h-72 flex justify-center items-center`}>
      <img src={event.bannerImg} alt='' />
    </div>
  )
}

export default HomeEventBannerItem
