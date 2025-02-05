import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '@/utils/API' // Import API
import dummyData from '../Dummy/Inquiries/Inquiry'

const InquiryList = () => {
  const [inquiries, setInquiries] = useState([]) // 전체 문의 목록
  const [filteredInquiries, setFilteredInquiries] = useState([]) // 필터링된 문의 목록
  const [answerFilter, setAnswerFilter] = useState('all') // 답변 여부 필터 ('all', 'answered', 'unanswered')
  const [typeFilter, setTypeFilter] = useState('all') // 문의 유형 필터
  const navigate = useNavigate() // 네비게이션 훅
  const debug_mode = true // 디버그 모드 설정
  const sellerEmail = localStorage.getItem('userId') // 판매자 이메일 가져오기

  // 데이터 로딩
  useEffect(() => {
    if (debug_mode) {
      setInquiries(dummyData)
      setFilteredInquiries(dummyData)
    } else {
      API.get(`/questions/seller/${sellerEmail}`)
        .then((response) => {
          setInquiries(response.data)
          setFilteredInquiries(response.data)
        })
        .catch((error) => console.error('Error fetching inquiries:', error))
    }
  }, [debug_mode, sellerEmail])

  // 필터 변경 핸들러 (답변 여부)
  const handleAnswerFilterChange = (e) => {
    setAnswerFilter(e.target.value)
  }

  // 필터 변경 핸들러 (문의 유형)
  const handleTypeFilterChange = (e) => {
    setTypeFilter(e.target.value)
  }

  // 필터 적용
  useEffect(() => {
    let updatedList = inquiries

    if (answerFilter !== 'all') {
      updatedList = updatedList.filter((item) =>
        answerFilter === 'answered' ? item.isAnswered : !item.isAnswered,
      )
    }

    if (typeFilter !== 'all') {
      updatedList = updatedList.filter((item) => item.type === typeFilter)
    }

    setFilteredInquiries(updatedList)
  }, [answerFilter, typeFilter, inquiries])

  // 문의글 클릭 핸들러
  const handleInquiryClick = (inquiryId) => {
    navigate(`/seller/inquiries/view?id=${inquiryId}`)
  }

  return (
    <div className='max-w-3xl mx-auto mt-10 p-4 bg-white border border-gray-300 rounded-lg'>
      <h1 className='text-xl font-semibold text-gray-800 border-b pb-3'>📌 나의 문의 목록</h1>

      {/* 필터 선택 옵션 */}
      <div className='flex gap-4 mb-4'>
        {/* 답변 여부 필터 */}
        <div className='flex items-center gap-2'>
          <label htmlFor='answerFilter' className='text-sm font-medium text-gray-700'>
            답변 여부:
          </label>
          <select
            id='answerFilter'
            value={answerFilter}
            onChange={handleAnswerFilterChange}
            className='border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500'
          >
            <option value='all'>전체</option>
            <option value='unanswered'>미답변</option>
            <option value='answered'>답변 완료</option>
          </select>
        </div>

        {/* 문의 유형 필터 */}
        <div className='flex items-center gap-2'>
          <label htmlFor='typeFilter' className='text-sm font-medium text-gray-700'>
            문의 유형:
          </label>
          <select
            id='typeFilter'
            value={typeFilter}
            onChange={handleTypeFilterChange}
            className='border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500'
          >
            <option value='all'>전체</option>
            <option value='제품'>제품</option>
            <option value='배송'>배송</option>
            <option value='결제'>결제</option>
            <option value='반품'>반품</option>
            <option value='기타'>기타</option>
          </select>
        </div>
      </div>

      {/* 문의 리스트 테이블 */}
      <table className='w-full text-left border-collapse mt-4 text-sm'>
        <thead>
          <tr className='border-b bg-gray-100'>
            <th className='p-2 w-20 text-center'>문의 번호</th>
            <th className='p-2 w-32 text-center'>문의 유형</th>
            <th className='p-2 text-center'>제목</th>
            <th className='p-2 w-32 text-center'>답변 등록 여부</th>
          </tr>
        </thead>
        <tbody>
          {filteredInquiries.length > 0 ? (
            filteredInquiries.map((inquiry) => (
              <tr
                key={inquiry.id}
                onClick={() => handleInquiryClick(inquiry.id)}
                className='border-b hover:bg-gray-200 cursor-pointer'
              >
                <td className='p-2 text-center'>{inquiry.id}</td>
                <td className='p-2 text-center'>{inquiry.type}</td>
                <td className='p-2 text-center'>{inquiry.title}</td>
                <td
                  className={`p-2 text-center font-medium ${
                    inquiry.isAnswered ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {inquiry.isAnswered ? '답변 완료' : '미답변'}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan='4' className='p-4 text-center text-gray-500'>
                해당하는 문의가 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default InquiryList
