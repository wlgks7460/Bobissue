import React, { useRef, useState } from 'react'
import dayjs from 'dayjs'
import calendarDefaultImg from '../../../assets/consumer/calendarDefault.webp'

const MyPageCalendarModalItem = ({ meal, updateData, deleteData }) => {
  const [mode, setMode] = useState('read')

  const nameRef = useRef()
  const timeRef = useRef()
  const calorieRef = useRef()
  const [mealImage, setMealImage] = useState(null)

  // 시간 데이터 가공
  const handleTime = (timeData) => {
    const date = timeData.split(' ')[0]
    const time = timeData.split(' ').pop()
    return `${date} ${time}`
  }
  const [hour, setHour] = useState(dayjs(handleTime(meal.eatTime)).hour())
  const [minute, setMinute] = useState(dayjs(handleTime(meal.eatTime)).minute())

  // 이미지 파일 핸들러
  const handleImageChange = (e) => {
    const file = e.target.files[0] // 첫 번째 파일 선택
    if (file) {
      setMealImage(file)
    }
  }

  // 시간 출력
  const handleHour = (hour) => {
    const result = hour > 13 ? hour - 12 : hour === 0 ? hour + 12 : hour
    return String(result).padStart(2, '0')
  }
  // 식단 수정 핸들러러
  const handleUpdate = (e) => {
    e.preventDefault()
    updateData(
      nameRef.current.value,
      timeRef.current.value,
      calorieRef.current.value,
      meal.calendarNo,
      mealImage,
    )
    setMode('read')
  }
  // 식단 삭제 핸들러
  const handleDelete = (e) => {
    e.preventDefault()
    deleteData(meal.calendarNo)
  }

  return (
    <div>
      {mode === 'read' && (
        <div className='flex items-center space-x-4 mb-4'>
          <div className='border border-gray-300 rounded'>
            <img
              src={meal.images[0]?.imageUrl || calendarDefaultImg}
              alt={meal.title}
              className='w-[80px] h-[80px] object-cover rounded'
              onError={(e) => {
                e.target.src = calendarDefaultImg
              }}
            />
          </div>
          <div>
            <h4 className='font-bold'>{meal.name}</h4>
            <div>
              <span className='me-5'>
                {`${hour < 12 ? '오전' : '오후'} ${handleHour(hour)}:${String(minute).padStart(2, '0')}`}
              </span>
              <span className='text-sm text-gray-500'>{meal.calorie} kcal</span>
            </div>
            <div className='flex gap-3'>
              <button className='p-1 text-[#6F4E37]' onClick={() => setMode('update')}>
                수정
              </button>
              <button className='p-1 text-red-600' onClick={handleDelete}>
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
      {mode === 'update' && (
        <div>
          <div className='flex items-center space-x-4 mb-1'>
            <div className='border border-gray-300 rounded'>
              <img
                src={
                  (mealImage && URL.createObjectURL(mealImage)) ||
                  meal.images[0]?.imageUrl ||
                  calendarDefaultImg
                }
                alt={meal.title}
                className='w-[80px] h-[80px] object-cover rounded'
                onError={(e) => {
                  e.target.src = calendarDefaultImg
                }}
              />
            </div>
            <div>
              <input
                type='text'
                defaultValue={meal.name}
                ref={nameRef}
                className='font-bold px-2 py-1 border border-gray-300 rounded mb-2'
              />
              <div className='flex gap-3 mb-2'>
                <input
                  type='time'
                  defaultValue={`${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`}
                  ref={timeRef}
                  className='px-2 py-1 border border-gray-300 rounded'
                />
                <span className='flex px-2 py-1 border border-gray-300 rounded'>
                  <input
                    type='number'
                    defaultValue={meal.calorie}
                    ref={calorieRef}
                    className='text-right w-[80px]'
                  />
                  kcal
                </span>
              </div>
              <div className='flex gap-3'>
                <input
                  type='file'
                  className='w-[250px]'
                  accept='image/*'
                  onChange={handleImageChange}
                />
                <button className='p-1 text-[#6F4E37]' onClick={handleUpdate}>
                  수정
                </button>
                <button className='p-1 text-red-600' onClick={() => setMode('read')}>
                  취소
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MyPageCalendarModalItem
