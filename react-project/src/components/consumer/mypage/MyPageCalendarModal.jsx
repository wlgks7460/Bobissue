import React, { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import MyPageCalendarModalForm from './MyPageCalendarModalForm'
import MyPageCalendarModalItem from './MyPageCalendarModalItem'

const MyPageCalendarModal = ({ setModalOpen, selectedDate }) => {
  const [todayMeal, setTodayMeal] = useState([])
  const [showForm, setShowForm] = useState(false)

  // 더미 데이터: 각 식사에 대한 정보 (시간, 제목, 칼로리, 이미지 URL)
  const mealData = [
    {
      id: 0,
      date: '2025-02-07', // 날짜 정보 추가
      time: '08:00 AM',
      title: '아침 식단: 토스트 & 커피',
      calories: 350,
      image: 'https://example.com/images/toast-coffee.jpg', // 이미지 URL
    },
    {
      id: 1,
      date: '2025-02-07',
      time: '12:30 PM',
      title: '점심 식단: 치킨 샐러드',
      calories: 550,
      image: 'https://example.com/images/chicken-salad.jpg', // 이미지 URL
    },
    {
      id: 2,
      date: '2025-02-07',
      time: '06:00 PM',
      title: '저녁 식단: 불고기 덮밥',
      calories: 700,
      image: 'https://example.com/images/bulgogi-rice.jpg', // 이미지 URL
    },
    {
      id: 3,
      date: '2025-02-08',
      time: '08:30 AM',
      title: '아침 식단: 팬케이크 & 오렌지 주스',
      calories: 400,
      image: 'https://example.com/images/pancake-orange-juice.jpg',
    },
  ]

  useEffect(() => {
    // selectedDate에 해당하는 식단만 필터링
    const filteredMeals = mealData.filter((meal) => meal.date === selectedDate)
    setTodayMeal(filteredMeals)
  }, [selectedDate])

  return (
    <div className='fixed top-0 left-0 z-50'>
      <div className='w-full h-full fixed bg-gray-600/80 flex justify-center items-center'>
        <div className='w-[600px] border border-gray-400 rounded bg-white p-5 flex flex-col'>
          {/* 모달 main */}
          <div className='grow flex flex-col justify-between'>
            <h3 className='text-xl text-center my-5'>{selectedDate} 식단</h3>
            {/* 식단 입력 폼 */}
            {showForm ? (
              <MyPageCalendarModalForm setShowForm={setShowForm} />
            ) : (
              <button
                className='w-full h-[50px] bg-gray-300 rounded'
                onClick={() => setShowForm(true)}
              >
                식단 추가하기
              </button>
            )}
            <hr className='border-gray-400 my-5' />

            {/* 해당 날짜 식단 출력 */}
            <div className='h-[300px] overflow-y-auto'>
              <div className='flex flex-col gap-3'>
                {todayMeal.length === 0 ? (
                  <p className='text-center text-gray-500'>오늘의 식단이 없습니다.</p>
                ) : (
                  todayMeal.map((meal) => <MyPageCalendarModalItem key={meal.id} meal={meal} />)
                )}
              </div>
            </div>
          </div>

          <div className='flex-none flex justify-center mt-2'>
            <button className='text-red-600' onClick={() => setModalOpen(false)}>
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyPageCalendarModal
