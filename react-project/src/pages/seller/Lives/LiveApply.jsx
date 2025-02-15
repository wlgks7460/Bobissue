import React, { useEffect, useState } from 'react';
import API from '@/utils/API';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';
import { FaCalendarAlt, FaClock, FaVideo, FaBoxOpen } from 'react-icons/fa';
import Guide from './Form/LiveGuide';

const LiveApply = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimes, setSelectedTimes] = useState([]); // 선택한 방송 시간
  const [title, setTitle] = useState('');
  const [content, setContent] = useState(''); // 설명 필드를 content로 변경
  const [selectedItems, setSelectedItems] = useState([]); // 선택한 상품 목록
  const [items, setItems] = useState([]); // API에서 불러온 상품 목록

  const availableTimes = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'];

  // ✅ API에서 상품 목록 불러오기
  useEffect(() => {
    async function fetchItems() {
      try {
        const response = await API.get('/item');
        setItems(response.data?.result?.data || []);
      } catch (error) {
        console.error('상품 정보 불러오기 실패:', error);
      }
    }
    fetchItems();
  }, []);

  // ✅ 연속된 시간인지 확인하는 함수
  const isConsecutive = (times) => {
    if (times.length < 2) return true;
    const indexes = times.map((t) => availableTimes.indexOf(t)).sort((a, b) => a - b);
    return indexes.length === 1 || indexes[1] - indexes[0] === 1;
  };

  // ✅ 방송 시간 선택 핸들러
  const handleTimeSelection = (time) => {
    if (selectedTimes.includes(time)) {
      setSelectedTimes((prev) => prev.filter((t) => t !== time));
    } else {
      const newTimes = [...selectedTimes, time];
      if (newTimes.length <= 1 && isConsecutive(newTimes)) {
        setSelectedTimes(newTimes);
      }
    }
  };

  // ✅ 상품 선택 핸들러 (다중 선택 가능, 중복 불가)
  const handleItemSelection = (itemNo) => {
    setSelectedItems((prev) =>
      prev.includes(itemNo) ? prev.filter((id) => id !== itemNo) : [...prev, itemNo]
    );
  };

  // ✅ 라이브 신청 핸들러
  const handleLiveApply = async () => {
    if (!selectedDate || selectedTimes.length === 0 || selectedItems.length === 0) return;

    // 📌 날짜 변환 (YYYYMMDD)
    const formattedDate = moment(selectedDate).format('YYYYMMDD');

    // 📌 시작 시간 설정
    const sortedTimes = selectedTimes.sort();
    const startTime = sortedTimes[0];
    const startAt = `${formattedDate} ${startTime.replace(':', '')}00`;

    // 📌 종료 시간 설정 (최대 1시간 방송)
    const startIndex = availableTimes.indexOf(startTime);
    const endTime = availableTimes[startIndex + 1] || startTime;
    const endAt = `${formattedDate} ${endTime.replace(':', '')}00`;

    // 📌 선택한 상품을 API 형식에 맞게 변환
    const items = selectedItems.map((itemNo) => ({ itemNo }));

    // 📌 최종 요청 데이터
    const requestData = {
      title,
      content, // 설명 필드 (`description` → `content` 변경)
      startAt,
      endAt,
      items
    };

    try {
      const response = await API.post('/live/apply', requestData);
      console.log('라이브 신청 성공:', response.data);
      alert('라이브 신청이 완료되었습니다!');
    } catch (error) {
      console.error('라이브 신청 실패:', error);
      alert('라이브 신청 중 오류가 발생했습니다.');
    }
  };

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
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        {/* 📌 상품 선택 (다중 선택 가능) */}
        <label className='block text-lg font-semibold mt-4 flex items-center'>
          <FaBoxOpen className='mr-2 text-orange-500' /> 상품 선택
        </label>
        <div className='grid grid-cols-2 gap-2'>
          {items.map((item) => (
            <button
              key={item.itemNo}
              onClick={() => handleItemSelection(item.itemNo)}
              className={`px-4 py-2 rounded text-sm ${
                selectedItems.includes(item.itemNo) ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              {item.name}
            </button>
          ))}
        </div>

        {/* 📌 날짜 선택 */}
        <label className='block text-lg font-semibold mt-4 flex items-center'>
          <FaCalendarAlt className='mr-2 text-blue-500' /> 방송 날짜
        </label>
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          minDate={moment().add(1, 'months').startOf('month').toDate()}
          maxDate={moment().add(1, 'months').endOf('month').toDate()}
          className='border p-2 w-full rounded'
          placeholderText='날짜 선택'
        />

        {/* 📌 시간 선택 */}
        <label className='block text-lg font-semibold mt-4 flex items-center'>
          <FaClock className='mr-2 text-green-500' /> 방송 시간 선택 (최대 1시간)
        </label>
        <div className='grid grid-cols-4 gap-2'>
          {availableTimes.map((time) => (
            <button
              key={time}
              onClick={() => handleTimeSelection(time)}
              className={`px-4 py-2 rounded text-sm ${
                selectedTimes.includes(time) ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              {time}
            </button>
          ))}
        </div>

        {/* 📌 라이브 신청 버튼 */}
        <button
          className='mt-6 w-full py-2 bg-green-500 text-white font-semibold rounded hover:bg-green-600'
          onClick={handleLiveApply}
        >
          <FaVideo className='mr-2' /> 라이브 신청하기
        </button>
      </div>

      {/* 오른쪽: 가이드 */}
      <div className='w-1/2 p-6 bg-white border border-black rounded-md shadow-md ml-6'>
        <Guide />
      </div>
    </div>
  );
};

export default LiveApply;
