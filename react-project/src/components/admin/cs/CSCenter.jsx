import React, { useState } from 'react'
import Breadcrumb from '../common/Breadcrumb'

const CSCenter = () => {
  // Breadcrumb 경로 데이터
  const breadcrumbPaths = [{ name: 'Home' }, { name: 'CS관리' }, { name: '고객센터관리' }]

  // 상태 관리
  const [searchKeyword, setSearchKeyword] = useState('')
  const [searchField, setSearchField] = useState('title') // 검색 기준
  const [searchDate, setSearchDate] = useState('')
  const [inquiries, setInquiries] = useState([
    {
      id: 1,
      userId: 'user123',
      title: '배송이 지연되고 있어요',
      status: '대기 중',
      date: '2025-01-25',
    },
    {
      id: 2,
      userId: 'user456',
      title: '상품이 불량이에요',
      status: '처리 완료',
      date: '2025-01-24',
    },
    {
      id: 3,
      userId: 'user789',
      title: '환불 진행이 안 돼요',
      status: '대기 중',
      date: '2025-01-23',
    },
  ]) // 예시 데이터
  const [filteredInquiries, setFilteredInquiries] = useState(inquiries)
  const [selectedInquiry, setSelectedInquiry] = useState(null) // 선택된 문의
  const [replyText, setReplyText] = useState('') // 답변 내용

  // 검색 핸들러
  const handleSearch = () => {
    const filtered = inquiries.filter((inquiry) => {
      const matchesField =
        searchField === 'title'
          ? inquiry.title.toLowerCase().includes(searchKeyword.toLowerCase())
          : inquiry.userId.toLowerCase().includes(searchKeyword.toLowerCase())
      const matchesDate = searchDate ? inquiry.date === searchDate : true
      return matchesField && matchesDate
    })

    setFilteredInquiries(filtered)
  }

  // 답변 전송 핸들러
  const handleReply = () => {
    if (!replyText.trim()) {
      alert('답변 내용을 입력하세요.')
      return
    }

    console.log('답변 전송:', {
      inquiryId: selectedInquiry.id,
      reply: replyText,
    })

    alert('답변이 전송되었습니다!')
    setReplyText('')
    setSelectedInquiry(null)
  }

  return (
    <div className='p-6'>
      {/* Breadcrumb */}
      <Breadcrumb paths={breadcrumbPaths} />

      <h2 className='text-2xl font-bold mb-6'>고객센터 관리</h2>

      {/* 검색 섹션 */}
      <section className='mb-6'>
        <h3 className='text-lg font-semibold mb-4'>| 문의 검색</h3>
        <div className='flex items-center mb-4 space-x-4'>
          {/* 검색 기준 */}
          <select
            value={searchField}
            onChange={(e) => setSearchField(e.target.value)}
            className='border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500'
          >
            <option value='title'>제목</option>
            <option value='userId'>아이디</option>
          </select>

          {/* 검색 입력 */}
          <input
            type='text'
            placeholder='검색어를 입력하세요'
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className='flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500'
          />

          {/* 날짜 검색 */}
          <input
            type='date'
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
            className='border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500'
          />

          <button
            onClick={handleSearch}
            className='bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600'
          >
            검색
          </button>
        </div>
      </section>

      {/* 문의 목록 */}
      <section className='mb-6'>
        <h3 className='text-lg font-semibold mb-4'>| 문의 목록</h3>
        <table className='w-full border-collapse border'>
          <thead>
            <tr>
              <th className='border p-2'>번호</th>
              <th className='border p-2'>아이디</th>
              <th className='border p-2'>제목</th>
              <th className='border p-2'>상태</th>
              <th className='border p-2'>문의 날짜</th>
              <th className='border p-2'>보기</th>
            </tr>
          </thead>
          <tbody>
            {filteredInquiries.map((inquiry) => (
              <tr key={inquiry.id}>
                <td className='border p-2'>{inquiry.id}</td>
                <td className='border p-2'>{inquiry.userId}</td>
                <td className='border p-2'>{inquiry.title}</td>
                <td className='border p-2'>{inquiry.status}</td>
                <td className='border p-2'>{inquiry.date}</td>
                <td className='border p-2 text-center'>
                  <button
                    onClick={() => setSelectedInquiry(inquiry)}
                    className='bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600'
                  >
                    보기
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* 문의 상세 및 답변 */}
      {selectedInquiry && (
        <section>
          <h3 className='text-lg font-semibold mb-4'>| 문의 상세</h3>
          <div className='border p-4 rounded-md mb-4'>
            <h4 className='font-bold text-lg mb-2'>{selectedInquiry.title}</h4>
            <p className='mb-2'>아이디: {selectedInquiry.userId}</p>
            <p className='mb-2'>상태: {selectedInquiry.status}</p>
            <p className='mb-2'>문의 날짜: {selectedInquiry.date}</p>
          </div>

          <textarea
            className='w-full border p-2 rounded mb-4'
            rows='5'
            placeholder='답변 내용을 입력하세요'
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
          />
          <button
            onClick={handleReply}
            className='bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600'
          >
            답변 전송
          </button>
        </section>
      )}
    </div>
  )
}

export default CSCenter
