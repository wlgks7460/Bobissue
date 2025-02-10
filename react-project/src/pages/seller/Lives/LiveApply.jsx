import React, { useState } from 'react'
import DatePicker from 'react-datepicker'
import moment from 'moment'
import 'react-datepicker/dist/react-datepicker.css'
import { FaCalendarAlt, FaClock, FaVideo } from 'react-icons/fa'
import Guide from './Form/LiveGuide' // ✅ 가이드 컴포넌트 추가

const LiveApply = () => {
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedTimes, setSelectedTimes] = useState([]) // ✅ 최대 2개까지 선택 가능
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('패션')

  const availableTimes = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00']
  const categories = ['패션', '전자제품', '뷰티', '식품', '헬스', '교육', '기타']

  // ✅ 연속된 시간인지 확인하는 함수
  const isConsecutive = (times) => {
    if (times.length < 2) return true
    const indexes = times.map((t) => availableTimes.indexOf(t)).sort((a, b) => a - b)
    return indexes.length === 1 || indexes[1] - indexes[0] === 1
  }

  // ✅ 방송 시간 선택 핸들러
  const handleTimeSelection = (time) => {
    if (selectedTimes.includes(time)) {
      // ✅ 이미 선택된 시간 클릭 시 제거
      setSelectedTimes((prev) => prev.filter((t) => t !== time))
    } else {
      // ✅ 새 시간 선택 (최대 2개 & 연속된 시간대만 선택 가능)
      const newTimes = [...selectedTimes, time]
      if (newTimes.length <= 2 && isConsecutive(newTimes)) {
        setSelectedTimes(newTimes)
      }
    }
  }

  return (
    <div className='p-6 min-h-screen flex flex-row' style={{ backgroundColor: '#EDFFE6' }}>
      {/* 왼쪽: 라이브 신청 폼 */}
      <div className='w-1/2 p-6 bg-white border border-black rounded-md shadow-md'>
        <h2 className='text-2xl font-bold mb-4 flex items-center'>
          <FaVideo className='mr-2 text-red-500' /> 라이브 신청하기
        </h2>

        {/* 📌 방송 제목 입력 */}
        <label className='block text-lg font-semibold mb-2'>방송 제목</label>
        <input
          type='text'
          className='border p-2 w-full rounded'
          placeholder='방송 제목을 입력하세요'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* 📌 방송 설명 입력 */}
        <label className='block text-lg font-semibold mt-4'>방송 설명</label>
        <textarea
          className='border p-2 w-full rounded h-[150px]'
          placeholder='방송 내용을 간략히 설명하세요'
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* 📌 카테고리 선택 */}
        <label className='block text-lg font-semibold mt-4'>카테고리</label>
        <select
          className='border p-2 w-full rounded'
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {/* 📌 날짜 선택 */}
        <label className='block text-lg font-semibold mt-4 flex items-center'>
          <FaCalendarAlt className='mr-2 text-blue-500' /> 방송 날짜
        </label>
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          minDate={moment().add(1, 'months').startOf('month').toDate()} // 다음 달의 첫째 날부터 선택 가능
          maxDate={moment().add(1, 'months').endOf('month').toDate()}
          className='border p-2 w-full rounded'
          placeholderText='날짜 선택'
        />

        {/* 📌 시간 선택 */}
        <label className='block text-lg font-semibold mt-4 flex items-center'>
          <FaClock className='mr-2 text-green-500' /> 방송 시간 선택 (최대 2시간)
        </label>
        <div className='grid grid-cols-4 gap-2'>
          {availableTimes.map((time) => (
            <button
              key={time}
              onClick={() => handleTimeSelection(time)}
              className={`px-4 py-2 rounded text-sm ${
                selectedTimes.includes(time)
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              {time}
            </button>
          ))}
        </div>

        {/* 📌 라이브 신청 버튼 */}
        <button
          className={`mt-6 w-full py-2 text-white font-semibold rounded flex items-center justify-center ${
            selectedDate && selectedTimes.length > 0
              ? 'bg-green-500 hover:bg-green-600'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
          disabled={!selectedDate || selectedTimes.length === 0}
        >
          <FaVideo className='mr-2' />
          라이브 신청하기
        </button>
      </div>

      {/* 오른쪽: 라이브 신청 가이드 */}
      <div className='w-1/2 p-6 bg-white border border-black rounded-md shadow-md ml-6'>
        <Guide /> {/* ✅ 외부 가이드 컴포넌트 삽입 */}
      </div>
    </div>
  )
}

export default LiveApply
