import React, { useState } from 'react'
import DatePicker from 'react-datepicker'
import moment from 'moment'
import 'react-datepicker/dist/react-datepicker.css'
import { FaCalendarAlt, FaClock, FaVideo, FaInfoCircle } from 'react-icons/fa'

const LiveApply = () => {
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedTime, setSelectedTime] = useState([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('패션')

  const availableTimes = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00']
  const categories = ['패션', '전자제품', '뷰티', '식품', '헬스', '교육', '기타']

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
          <FaClock className='mr-2 text-green-500' /> 방송 시간 선택
        </label>
        <div className='grid grid-cols-3 gap-2'>
          {availableTimes.map((time) => (
            <button
              key={time}
              onClick={() => setSelectedTime([time])}
              className={`px-4 py-2 rounded text-sm ${selectedTime.includes(time) ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              {time}
            </button>
          ))}
        </div>

        {/* 📌 라이브 신청 버튼 */}
        <button
          className={`mt-6 w-full py-2 text-white font-semibold rounded flex items-center justify-center ${
            selectedDate && selectedTime.length > 0
              ? 'bg-green-500 hover:bg-green-600'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
          disabled={!selectedDate || selectedTime.length === 0}
        >
          <FaVideo className='mr-2' />
          라이브 신청하기
        </button>
      </div>

      {/* 오른쪽: 라이브 신청 가이드 */}
      <div className='w-1/2 p-6 bg-white border border-black rounded-md shadow-md ml-6'>
        <h2 className='text-xl font-bold mb-4 flex items-center'>
          <FaInfoCircle className='mr-2 text-blue-500' /> 라이브 신청 가이드
        </h2>

        {/* 📌 신청 가능 기간 */}
        <div className='mb-4'>
          <h3 className='text-lg font-semibold text-red-500'>📌 신청 가능 기간</h3>
          <p className='text-gray-600'>
            ✔ 라이브 방송 신청은 매월 <strong>1일~14일</strong>까지만 가능합니다.
          </p>
          <p className='text-gray-600'>
            ✔ 방송 날짜는 <strong>다음 달부터</strong> 선택할 수 있습니다.
          </p>
        </div>

        {/* 📌 신청 절차 */}
        <div className='mb-4'>
          <h3 className='text-lg font-semibold text-green-500'>📌 라이브 신청 절차</h3>
          <ul className='list-disc pl-5 text-gray-600'>
            <li>📍 방송 제목 & 설명 입력</li>
            <li>📍 적절한 카테고리 선택</li>
            <li>📍 원하는 날짜와 시간 선택</li>
            <li>📍 라이브 신청 버튼 클릭</li>
          </ul>
        </div>

        {/* 📌 방송 유의사항 */}
        <div>
          <h3 className='text-lg font-semibold text-yellow-500'>📌 라이브 방송 유의사항</h3>
          <ul className='list-disc pl-5 text-gray-600'>
            <li>
              ✔ 라이브 방송은 승인 후 최대 <strong>2시간</strong> 가능
            </li>
            <li>✔ 상품 소개 시 사전 준비 필요</li>
            <li>✔ 원활한 인터넷 환경에서 방송 진행</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default LiveApply
