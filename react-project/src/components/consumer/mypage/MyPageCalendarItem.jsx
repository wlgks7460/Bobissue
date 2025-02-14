import React, { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import API from '../../../utils/API'
import calendarDefaultImg from '../../../assets/consumer/calendarDefault.webp'
import sirenIcon from '../../../assets/consumer/siren.png'

const MyPageCalendarItem = ({ label, date, events, tdee }) => {
  const dayOfWeek = dayjs(date).format('ddd') // 요일 가져오기

  // 해당 날짜의 이벤트 찾기
  const event = events.find((event) => dayjs(event.start).isSame(dayjs(date), 'day'))
  const todayCal = event ? event.cal : null // 해당 날짜의 칼로리 (없으면 null)

  const [dateData, setDateData] = useState([])
  const [defaultData, setDefaultData] = useState()

  // 숫자 , 찍기
  const addComma = (price) => {
    let returnString = price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    return returnString
  }
  //날짜 식단 데이터 가져오기
  const getDateData = (year, month, date) => {
    API.get(`/calendar/${year}/${month}/${date}`)
      .then((res) => {
        setDateData(res.data.result.data)
        setDefaultData(res.data.result.data[0])
      })
      .catch((err) => {
        console.error(err)
      })
  }

  useEffect(() => {
    const year = dayjs(date).year()
    const month = dayjs(date).month() + 1
    const date2 = dayjs(date).date()
    if (todayCal) {
      getDateData(year, month, date2)
    }
  }, [])

  return (
    <div className='p-1 flex flex-col'>
      <div className='w-full flex justify-start'>
        <button
          className={`text-center ${dayOfWeek === 'Sat' && 'text-blue-500'} ${dayOfWeek === 'Sun' && 'text-red-500'}`}
        >
          {label}
        </button>
      </div>
      {/* 칼로리 값이 있을 때만 출력 */}
      {todayCal !== null && (
        <div className='flex justify-end gap-2'>
          {todayCal > tdee && <img src={sirenIcon} alt='사이렌 아이콘' className='w-[20px]' />}
          <span className='text-sm text-gray-500'>{addComma(todayCal)} kcal</span>
        </div>
      )}
      {defaultData && (
        <div className='mt-2 flex items-end gap-2'>
          <img
            src={defaultData.images[0]?.imageUrl || calendarDefaultImg}
            alt=''
            className='w-[35px] h-[35px] rounded'
            onError={(e) => {
              e.target.src = calendarDefaultImg
            }}
          />
          {dateData.length - 1 > 0 && (
            <span className='text-gray-400 text-lg'>+{dateData.length - 1}</span>
          )}
        </div>
      )}
    </div>
  )
}

export default MyPageCalendarItem
