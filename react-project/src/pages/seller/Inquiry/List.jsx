import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '@/utils/API'

const InquiryList = () => {
  const [inquiries, setInquiries] = useState([])
  const [filteredInquiries, setFilteredInquiries] = useState([])
  const [answerFilter, setAnswerFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const navigate = useNavigate()

  const debug_mode = localStorage.getItem('debug_mode') === 'true'

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        const response = await API.get(`/question`)
        setInquiries(response.data.result.data)
        setFilteredInquiries(response.data.result.data)
      } catch (error) {
        console.error('❌ Error fetching inquiries:', error)
      }
    }

    fetchInquiries()
  }, [debug_mode])

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

    setFilteredInquiries([...updatedList])
  }, [answerFilter, typeFilter, inquiries])

  const handleCategoryClick = (category) => {
    setTypeFilter(category === typeFilter ? 'all' : category)
  }

  const handleInquiryClick = (inquiryId) => {
    navigate(`/seller/inquiries/view?id=${inquiryId}`)
  }

  return (
    <div className='w-full mx-auto p-6 min-h-screen bg-warmBeige/20 rounded-xl'>
      {/* 헤더 */}
      <h1 className='text-3xl font-extrabold text-espressoBlack border-b pb-3 text-center'>
        상품 문의
      </h1>
      <p className='text-md text-hazelnutBrown text-center mt-2'>
        문의사항을 확인하고 답변을 관리하세요.
      </p>

      {/* ✅ 카테고리 버튼 */}
      <div className='flex space-x-6 justify-center text-[16px] font-medium my-6'>
        {['제품', '배송', '결제', '환불', '기타'].map((category) => (
          <button
            key={category}
            onClick={() => handleCategoryClick(category)}
            className={`border-b-2 pb-1 px-3 transition ${
              typeFilter === category
                ? 'border-caramelTan text-caramelTan font-semibold'
                : 'border-transparent text-hazelnutBrown hover:text-goldenAmber hover:border-goldenAmber'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* ✅ 필터 옵션 */}
      <div className='flex gap-6 mb-6 items-center'>
        <div className='flex items-center gap-2'>
          <label htmlFor='answerFilter' className='text-sm font-medium text-hazelnutBrown'>
            답변 여부:
          </label>
          <select
            id='answerFilter'
            value={answerFilter}
            onChange={(e) => setAnswerFilter(e.target.value)}
            className='border border-mochaBrown bg-latteBeige rounded-md p-2 text-md focus:ring-caramelTan focus:border-caramelTan'
          >
            <option value='all'>전체</option>
            <option value='unanswered'>미답변</option>
            <option value='answered'>답변 완료</option>
          </select>
        </div>
      </div>

      {/* ✅ 문의 리스트 테이블 */}
      <div className='overflow-x-auto bg-latteBeige/40 shadow-md border border-caramelTan rounded-lg p-4'>
        <table className='w-full text-left border-collapse mt-4 text-sm bg-white'>
          <thead className='bg-caramelTan text-white'>
            <tr>
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
                  className='border-b border-hazelnutBrown hover:bg-goldenAmber/20 cursor-pointer transition'
                >
                  <td className='p-3 text-center'>{inquiry.id}</td>
                  <td className='p-3 text-center text-hazelnutBrown font-medium'>{inquiry.type}</td>
                  <td className='p-3 text-center'>{inquiry.title}</td>
                  <td
                    className={`p-3 text-center font-semibold ${
                      inquiry.isAnswered ? 'text-mochaBrown' : 'text-goldenAmber'
                    }`}
                  >
                    {inquiry.isAnswered ? '답변 완료' : '미답변'}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan='4' className='p-6 text-center text-hazelnutBrown'>
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
