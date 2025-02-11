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
  const debug_mode = false // 디버그 모드 설정
  const sellerEmail = localStorage.getItem('userId') // 판매자 이메일 가져오기

  // ✅ 데이터 로딩

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        if (debug_mode) {
          setInquiries(dummyData)
          setFilteredInquiries(dummyData)
        } else {
          const response = await API.get(`/question`)
          console.log(response.data.result.data)
          setInquiries(response.data.result.data)
          setFilteredInquiries(response.data)
        }
      } catch (error) {
        console.error('Error fetching inquiries:', error)
      }
    }

    fetchInquiries()
  }, [debug_mode, sellerEmail])

  // ✅ 필터 적용
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

  // ✅ 카테고리 클릭 핸들러
  const handleCategoryClick = (category) => {
    setTypeFilter(category === typeFilter ? 'all' : category) // 같은 카테고리 클릭 시 전체 보기
  }

  // ✅ 문의글 클릭 핸들러
  const handleInquiryClick = (inquiryId) => {
    navigate(`/seller/inquiries/view?id=${inquiryId}`)
  }

  return (
    <div className='max-w-4xl mx-auto mt-10 p-6 bg-white border border-gray-300 rounded-lg shadow-md'>
      <h1 className='text-2xl font-bold text-gray-800 border-b pb-3 text-center'>상품 문의</h1>

      {/* ✅ 클릭 가능한 카테고리 버튼 */}
      <div className='flex space-x-6 justify-center text-[16px] font-medium my-6'>
        {['제품', '배송', '결제', '환불', '기타'].map((category) => (
          <button
            key={category}
            onClick={() => handleCategoryClick(category)}
            className={`border-b-2 pb-1 px-3 transition ${
              typeFilter === category
                ? 'border-indigo-500 text-indigo-600 font-semibold'
                : 'border-transparent text-gray-600 hover:text-indigo-500 hover:border-indigo-500'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* ✅ 필터 선택 옵션 */}
      <div className='flex gap-6 mb-6 items-center'>
        {/* 답변 여부 필터 */}
        <div className='flex items-center gap-2'>
          <label htmlFor='answerFilter' className='text-sm font-medium text-gray-700'>
            답변 여부:
          </label>
          <select
            id='answerFilter'
            value={answerFilter}
            onChange={(e) => setAnswerFilter(e.target.value)}
            className='w-[110px] border border-gray-300 rounded-md p-2 text-sm focus:ring-indigo-500 focus:border-indigo-500'
          >
            <option value='all'>전체</option>
            <option value='unanswered'>미답변</option>
            <option value='answered'>답변 완료</option>
          </select>
        </div>
      </div>

      {/* ✅ 문의 리스트 테이블 */}
      <div className='overflow-x-auto'>
        <table className='w-full text-left border-collapse mt-4 text-sm'>
          <thead>
            <tr className='border-b bg-gray-100 text-gray-700'>
              <th className='p-3 w-20 text-center'>번호</th>
              <th className='p-3 w-28 text-center'>문의 유형</th>
              <th className='p-3 text-center'>제목</th>
              <th className='p-3 w-40 text-center'>답변 상태</th>
            </tr>
          </thead>
          <tbody>
            {filteredInquiries.length > 0 ? (
              filteredInquiries.map((inquiry) => (
                <tr
                  key={inquiry.id}
                  onClick={() => handleInquiryClick(inquiry.id)}
                  className='border-b hover:bg-gray-100 cursor-pointer transition'
                >
                  <td className='p-3 text-center'>{inquiry.id}</td>
                  <td className='p-3 text-center'>{inquiry.type}</td>
                  <td className='p-3 text-center'>{inquiry.title}</td>
                  <td
                    className={`p-3 text-center font-semibold ${
                      inquiry.isAnswered ? 'text-green-500' : 'text-red-500'
                    }`}
                  >
                    {inquiry.isAnswered ? '답변 완료' : '미답변'}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan='4' className='p-6 text-center text-gray-500'>
                  해당하는 문의가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default InquiryList
