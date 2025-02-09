import React, { useState } from 'react'
import dayjs from 'dayjs'

const MyPageCalendarModalForm = ({ setShowForm }) => {
  const [mealTime, setMealTime] = useState(dayjs().format('HH:mm')) // 식사 시간
  const [mealTitle, setMealTitle] = useState('') // 식사 제목
  const [mealCalories, setMealCalories] = useState('') // 칼로리
  const [mealImage, setMealImage] = useState(null) // 이미지 파일

  // 폼 제출 핸들러
  const handleSubmit = (e) => {
    e.preventDefault()
    const newMeal = {
      time: mealTime,
      title: mealTitle,
      calories: mealCalories,
      image: mealImage,
    }
    console.log(newMeal) // 콘솔에 출력하거나 데이터를 저장하는 로직
  }

  // 이미지 파일 선택 핸들러
  const handleImageChange = (e) => {
    const file = e.target.files[0] // 첫 번째 파일 선택
    if (file) {
      setMealImage(file)
    }
  }
  // 취소 버튼 핸들러
  const handleCancle = (e) => {
    e.preventDefault()
    setShowForm(false)
  }

  return (
    <div className='border border-gray-400 rounded p-4'>
      <form onSubmit={handleSubmit} className='flex flex-col space-y-4'>
        {/* 시간 입력 */}
        <div className='flex items-center'>
          <label className='flex-none w-[70px] text-sm text-gray-700'>시간</label>
          <input
            type='time'
            className='flex-grow border border-gray-400 rounded p-2'
            value={mealTime}
            onChange={(e) => setMealTime(e.target.value)}
            required
          />
        </div>
        {/* 제목 입력 */}
        <div className='flex items-center'>
          <label className='flex-none w-[70px] text-sm text-gray-700'>제목</label>
          <input
            type='text'
            className='flex-grow border border-gray-400 rounded p-2'
            placeholder='식사 제목'
            value={mealTitle}
            onChange={(e) => setMealTitle(e.target.value)}
            required
          />
        </div>
        {/* 칼로리 입력 */}
        <div className='flex items-center'>
          <label className='flex-none w-[70px] text-sm text-gray-700'>칼로리</label>
          <input
            type='number'
            className='flex-grow border border-gray-400 rounded p-2'
            placeholder='칼로리'
            value={mealCalories}
            onChange={(e) => setMealCalories(e.target.value)}
            required
          />
        </div>
        {/* 이미지 파일 입력 */}
        <div className='h-[55px] flex items-center'>
          <label className='flex-none w-[70px] text-sm text-gray-700'>이미지</label>
          <input
            type='file'
            onChange={handleImageChange}
            accept='image/*' // 이미지 파일만 선택 가능
          />
          {/* 이미지 미리보기 */}
          {mealImage && (
            <div>
              <img
                src={URL.createObjectURL(mealImage)} // 파일 객체 URL을 사용하여 미리보기
                alt='meal preview'
                className='w-auto h-[50px] object-cover '
              />
            </div>
          )}
        </div>

        {/* 제출 버튼 */}
        <div className='flex justify-center gap-5'>
          <button type='submit' className='text-indigo-600'>
            추가
          </button>
          <button className='text-red-600' onClick={handleCancle}>
            취소
          </button>
        </div>
      </form>
    </div>
  )
}

export default MyPageCalendarModalForm
