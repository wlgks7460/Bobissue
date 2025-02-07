import React, { useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import moment from 'moment'

const LiveApply = () => {
  const today = moment().date() // 오늘의 날짜 (1~31)
  const isApplicationPeriod = today >= 1 && today <= 14 // 1일~14일 사이인지 확인

  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedTime, setSelectedTime] = useState([])

  const availableTimes = [
    '09:00',
    '10:00',
    '11:00',
    '12:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
    '18:00',
  ]

  // 📌 시간 선택 핸들러 (연속 1시간 선택 가능)
  const handleTimeSelection = (time) => {
    if (selectedTime.length === 0) {
      setSelectedTime([time])
    } else {
      const lastTime = selectedTime[selectedTime.length - 1]
      const nextHour = moment(lastTime, 'HH:mm').add(1, 'hour').format('HH:mm')

      if (time === nextHour) {
        setSelectedTime([...selectedTime, time])
      } else {
        setSelectedTime([time]) // 연속 선택이 아닐 경우 초기화
      }
    }
  }

  return (
    <div className='p-6'>
      <h2 className='text-2xl font-bold mb-4'>📅 라이브 신청하기</h2>

      {/* 📌 1~14일이 아닐 경우 신청 불가 메시지 */}
      {!isApplicationPeriod ? (
        <div className='text-red-500 font-semibold text-lg'>
          ❌ 라이브 신청은 매월 1일 ~ 14일까지만 가능합니다.
        </div>
      ) : (
        <div className='bg-white p-6 border rounded-lg shadow-md max-w-md mx-auto'>
          <div className='text-lg font-semibold mb-4'>📅 날짜 선택</div>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            minDate={new Date()}
            dateFormat='yyyy-MM-dd'
            className='border p-2 w-full rounded'
            placeholderText='날짜를 선택하세요'
          />

          {/* 📌 시간 선택 */}
          <div className='mt-4'>
            <h3 className='text-lg font-semibold mb-2'>⏰ 시간대 선택 (연속 1시간 단위 가능)</h3>
            <div className='grid grid-cols-3 gap-2'>
              {availableTimes.map((time) => (
                <button
                  key={time}
                  onClick={() => handleTimeSelection(time)}
                  className={`px-4 py-2 rounded text-sm ${
                    selectedTime.includes(time)
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          {/* 📌 라이브 신청 버튼 */}
          <button
            className={`mt-6 w-full py-2 text-white font-semibold rounded ${
              selectedDate && selectedTime.length > 0
                ? 'bg-green-500 hover:bg-green-600'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
            disabled={!selectedDate || selectedTime.length === 0}
          >
            라이브 신청하기
          </button>
        </div>
      )}
    </div>
  )
}

export default LiveApply
