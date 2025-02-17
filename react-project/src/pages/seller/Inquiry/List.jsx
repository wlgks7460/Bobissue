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
    <div className=' mx-auto h-[60vh] p-6 min-h-screen border border-frozenSilver-300 rounded-xl '>
      <h1 className='text-2xl font-extrabold text-deepCobalt border-b pb-3 text-center'>상품 문의</h1>

      {/* ✅ 카테고리 버튼 */}
      <div className='flex space-x-6 justify-center text-[16px] font-medium my-6'>
        {['제품', '배송', '결제', '환불', '기타'].map((category) => (
          <button
            key={category}
            onClick={() => handleCategoryClick(category)}
            className={`border-b-2 pb-1 px-3 transition ${
              typeFilter === category
                ? 'border-rose-500 text-rose-500 font-semibold'
                : 'border-transparent text-gray-600 hover:text-rose-400'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* ✅ 필터 옵션 */}
      <div className='flex gap-6 mb-6 items-center'>
        <div className='flex items-center gap-2'>
          <label htmlFor='answerFilter' className='text-sm font-medium text-gray-700'>
            답변 여부:
          </label>
          <select
            id='answerFilter'
            value={answerFilter}
            onChange={(e) => setAnswerFilter(e.target.value)}
            className='border border-deepCobalt rounded-md p-2 text-md focus:ring-graphiteBlack focus:border-graphiteBlack'
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
            <tr className='border-b bg-frostWhite text-gray-700'>
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
                  className='border-b hover:bg-frostWhite cursor-pointer transition'
                >
                  <td className='p-3 text-center'>{inquiry.id}</td>
                  <td className='p-3 text-center'>{inquiry.type}</td>
                  <td className='p-3 text-center'>{inquiry.title}</td>
                  <td
                    className={`p-3 text-center font-semibold ${
                      inquiry.isAnswered ? 'text-steelBlue' : 'text-neonAqua'
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
