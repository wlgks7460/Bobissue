import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import dummyData from '../Dummy/Inquiries/Inquiry'

const View = () => {
  const [inquiries, setInquiries] = useState([]) // 전체 문의 목록
  const [filteredInquiries, setFilteredInquiries] = useState([]) // 필터링된 문의 목록
  const [answerFilter, setAnswerFilter] = useState('all') // 답변 여부 필터 ('all', 'unanswered', 'answered')
  const [typeFilter, setTypeFilter] = useState('all') // 문의 유형 필터

  const navigate = useNavigate() // 네비게이션 훅

  // 더미 데이터 설정
  useEffect(() => {
    setInquiries(dummyData)
    setFilteredInquiries(dummyData) // 초기값 설정
  }, [])

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
    navigate(`/seller/inquiries/view?id=${inquiryId}`) // 문의 상세 페이지 이동
  }

  return (
    <div className='p-6 w-[800px]'>
      <h1 className='text-[28px] font-bold mb-4'>문의 목록</h1>

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
      <table className='w-full border border-gray-300 bg-white'>
        {/* 테이블 헤더 */}
        <thead className='bg-gray-100 border-b border-gray-300'>
          <tr className='text-gray-700 text-sm'>
            <th className='py-3 px-4 w-[100px] text-center'>문의번호</th>
            <th className='py-3 px-4 w-[150px] text-center'>문의유형</th>
            <th className='py-3 px-4 w-[400px] text-center'>제목</th>
            <th className='py-3 px-4 w-[150px] text-center'>답변여부</th>
          </tr>
        </thead>

        {/* 테이블 본문 */}
        <tbody>
          {filteredInquiries.length > 0 ? (
            filteredInquiries.map((inquiry) => (
              <tr
                key={inquiry.id}
                className={`cursor-pointer hover:bg-gray-50 ${
                  inquiry.isAnswered ? 'bg-green-50' : 'bg-red-50'
                }`}
                onClick={() => handleInquiryClick(inquiry.id)}
              >
                <td className='py-3 px-4 text-center text-gray-800'>#{inquiry.id}</td>
                <td className='py-3 px-4 text-center text-gray-600'>{inquiry.type}</td>
                <td className='py-3 px-4 text-left text-gray-900'>{inquiry.title}</td>
                <td
                  className={`py-3 px-4 text-center font-medium ${
                    inquiry.isAnswered ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {inquiry.isAnswered ? '답변 완료' : '미답변'}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan='4' className='py-4 text-center text-gray-500'>
                해당하는 문의가 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default View
