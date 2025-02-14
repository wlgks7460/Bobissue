import React, { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import MyPageCalendarModalForm from './MyPageCalendarModalForm'
import MyPageCalendarModalItem from './MyPageCalendarModalItem'
import API from '../../../utils/API'

const MyPageCalendarModal = ({
  setModalOpen,
  selectedDate,
  getCalendarData,
  currentYear,
  currentMonth,
}) => {
  const [todayMeal, setTodayMeal] = useState([])
  const [showForm, setShowForm] = useState(false)

  const year = dayjs(selectedDate).year()
  const month = dayjs(selectedDate).month() + 1
  const day = dayjs(selectedDate).date()

  // 식단 데이터 조회
  const getDayData = () => {
    API.get(`/calendar/${year}/${month}/${day}`)
      .then((res) => {
        setTodayMeal(res.data.result.data)
      })
      .catch((err) => {
        console.error(err)
      })
  }
  // 식단 데이터 생성
  const createData = (mealTitle, mealTime, mealCalories, file) => {
    const payload = {
      name: mealTitle,
      eatTime: mealTime.replace(':', '') + '00',
      calorie: Number(mealCalories),
    }

    const formData = new FormData()

    formData.append('meal', JSON.stringify(payload))
    formData.append('images', file)
    if (!payload.name) {
      alert('제목을 작성해주세요.')
    } else if (!payload.calorie) {
      alert('칼로리를 작성해주세요.')
    } else {
      API.post(`/calendar/${year}/${month}/${day}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
        .then((res) => {
          const result = res.data.result.data
          setTodayMeal([...todayMeal, result])
          setShowForm(false)
          getCalendarData(currentYear, currentMonth)
        })
        .catch((err) => {
          console.error(err)
        })
    }
  }

  // 식단 데이터 수정
  const updateData = (mealTitle, mealTime, mealCalories, calendarNo, file) => {
    const payload = {
      name: mealTitle,
      eatTime: mealTime.replace(':', '') + '00',
      calorie: Number(mealCalories),
    }
    const formData = new FormData()

    formData.append('meal', JSON.stringify(payload))
    if (file) {
      formData.append('images', file)
    }
    API.put(`/calendar/${calendarNo}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then((res) => {
        alert('수정되었습니다.')
        getDayData()
        getCalendarData(currentYear, currentMonth)
      })
      .catch((err) => {
        console.error(err)
      })
  }

  // 식단 데이터 삭제
  const deleteData = (calendarNo) => {
    API.delete(`/calendar/${calendarNo}`)
      .then((res) => {
        alert('삭제되었습니다.')
        getDayData()
        getCalendarData(currentYear, currentMonth)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  useEffect(() => {
    getDayData()
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
              <MyPageCalendarModalForm setShowForm={setShowForm} createData={createData} />
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
                  todayMeal.map((meal) => (
                    <MyPageCalendarModalItem
                      key={meal.eatTime}
                      meal={meal}
                      updateData={updateData}
                      deleteData={deleteData}
                    />
                  ))
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
