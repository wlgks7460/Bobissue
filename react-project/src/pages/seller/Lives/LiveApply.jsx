import React, { useEffect, useState } from 'react'
import API from '@/utils/API'
import DatePicker from 'react-datepicker'
import moment from 'moment'
import 'react-datepicker/dist/react-datepicker.css'
import { FaCalendarAlt, FaClock, FaVideo, FaBoxOpen } from 'react-icons/fa'
import Guide from './Form/LiveGuide'

const LiveApply = () => {
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedTimes, setSelectedTimes] = useState([])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [selectedItems, setSelectedItems] = useState([])
  const [items, setItems] = useState([])

  const availableTimes = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00']

  useEffect(() => {
    async function fetchItems() {
      try {
        const response = await API.get('/item')
        setItems(response.data?.result?.data || [])
      } catch (error) {
        console.error('상품 정보 불러오기 실패:', error)
        setItems([])
      }
    }
    fetchItems()
  }, [])

  const handleTimeSelection = (time) => {
    setSelectedTimes((prev) =>
      prev.includes(time) ? prev.filter((t) => t !== time) : [...prev, time],
    )
  }

  const handleItemSelection = (itemNo) => {
    setSelectedItems((prev) =>
      prev.includes(itemNo) ? prev.filter((id) => id !== itemNo) : [...prev, itemNo],
    )
  }

  const handleLiveApply = async () => {
    if (
      !title.trim() ||
      !content.trim() ||
      !selectedDate ||
      selectedTimes.length === 0 ||
      selectedItems.length === 0
    ) {
      return alert('모든 항목을 입력해주세요.')
    }

    // 날짜 및 시간 포맷 변환
    const formattedDate = moment(selectedDate).format('YYYYMMDD')
    const startTime = selectedTimes[0] // 첫 번째 선택된 시간
    const startAt = `${formattedDate} ${startTime.replace(':', '')}00`

    // 2시간 후 endAt 설정
    const startMoment = moment(`${formattedDate} ${startTime}`, 'YYYYMMDD HH:mm')
    const endMoment = startMoment.add(2, 'hours') // 2시간 추가
    const endAt = endMoment.format('YYYYMMDD HHmmss')

    // 선택된 상품 변환
    const items = selectedItems.map((itemNo) => ({ itemNo }))

    const requestData = { title, content, startAt, endAt, items }
    console.log(requestData) // 콘솔 확인

    try {
      await API.post('/cast', requestData)
      alert('라이브 신청이 완료되었습니다!')
    } catch (error) {
      console.error('라이브 신청 실패:', error)
      alert('라이브 신청 중 오류가 발생했습니다.')
    }
  }

  return (
    <div className='p-6 min-h-screen flex flex-col md:flex-row gap-6 bg-warmBeige/20'>
      {/* 왼쪽: 라이브 신청 폼 */}
      <div className='w-full md:w-1/2 p-6 bg-white border border-latteBeige rounded-lg shadow-md'>
        <h2 className='text-3xl font-semibold mb-6 flex items-center text-espressoBlack'>
          라이브 방송 신청
        </h2>

        <label className='block text-lg font-medium text-darkGraphite mb-2'>방송 제목</label>
        <input
          type='text'
          className='border p-3 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-caramelTan'
          placeholder='방송 제목을 입력하세요'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label className='block text-lg font-medium text-darkGraphite mt-4'>방송 설명</label>
        <textarea
          className='border p-3 w-full rounded-md h-32 focus:outline-none focus:ring-2 focus:ring-caramelTan'
          placeholder='방송 내용을 입력하세요'
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <label className='block text-lg font-medium text-darkGraphite mt-4 flex items-center'>
          <FaBoxOpen className='mr-2 text-caramelTan' /> 상품 선택
        </label>
        <div className='grid grid-cols-2 gap-2 mt-2'>
          {items.length > 0 ? (
            items.map((item) => (
              <button
                key={item.itemNo}
                onClick={() => handleItemSelection(item.itemNo)}
                className={`px-4 py-2 rounded-md text-sm transition ${
                  selectedItems.includes(item.itemNo)
                    ? 'bg-caramelTan text-white'
                    : 'bg-latteBeige text-darkGraphite hover:bg-mochaBrown/80'
                }`}
              >
                {item.name}
              </button>
            ))
          ) : (
            <p className='text-darkGraphite text-sm'>상품이 없습니다.</p>
          )}
        </div>

        <label className='block text-lg font-medium text-darkGraphite mt-4 flex items-center'>
          <FaCalendarAlt className='mr-2 text-caramelTan' /> 방송 날짜
        </label>
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          minDate={moment().add(1, 'months').startOf('month').toDate()}
          maxDate={moment().add(1, 'months').endOf('month').toDate()}
          className='border p-3 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-caramelTan'
          placeholderText='날짜 선택'
        />

        <label className='block text-lg font-medium text-darkGraphite mt-4 flex items-center'>
          <FaClock className='mr-2 text-caramelTan' /> 방송 시간 선택
        </label>
        <div className='grid grid-cols-4 gap-2 mt-2'>
          {availableTimes.map((time) => (
            <button
              key={time}
              onClick={() => handleTimeSelection(time)}
              className={`px-4 py-2 rounded-md text-sm transition ${
                selectedTimes.includes(time)
                  ? 'bg-coffeeBrown text-white'
                  : 'bg-latteBeige text-darkGraphite hover:bg-mochaBrown/80'
              }`}
            >
              {time}
            </button>
          ))}
        </div>

        <button
          className='mt-6 w-full py-3 bg-coffeeBrown text-white font-semibold rounded-md hover:bg-mochaBrown transition'
          onClick={handleLiveApply}
        >
          <FaVideo className='mr-2 inline-block' /> 라이브 신청하기
        </button>
      </div>

      {/* 오른쪽: 가이드 */}
      <div className='w-full md:w-1/2 p-6 bg-white border border-latteBeige rounded-lg shadow-md'>
        <Guide />
      </div>
    </div>
  )
}

export default LiveApply
