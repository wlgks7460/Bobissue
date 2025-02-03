import React from 'react'

const HomeEventBannerItem = ({ event }) => {
  return (
    <div className={`w-full min-w-[70rem] h-72 flex justify-center items-center ${event.bgColor}`}>
      <p>{event.content}</p>
    </div>
  )
}

export default HomeEventBannerItem
