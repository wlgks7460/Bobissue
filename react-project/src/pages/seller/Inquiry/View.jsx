import React, { useEffect, useState } from 'react'
import dummyData from '../Dummy/Inquiries/inquiry' // 더미 데이터 import
import { useLocation, useNavigate } from 'react-router-dom'
import ReplyForm from './Form/Reply' // 답장 폼 import
import ReplyEditForm from './Form/ReplyEdit' // 답장 수정 폼 import
import DeleteButton from './Form/Delete' // 삭제 버튼 import
import ReportButton from './Form/Report' // 신고 버튼 import
import API from '@/utils/API' // API import

const Inquiry = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const queryParams = new URLSearchParams(location.search)
  const id = queryParams.get('id')
  const [inquiry, setInquiry] = useState(null) // Inquiry 상태
  const [isAnswered, setIsAnswered] = useState(false)
  const debug_mode = true // 디버그 모드

  useEffect(() => {
    const fetchInquiry = () => {
      if (debug_mode) {
        // 더미 데이터에서 해당 ID의 문의 가져오기
        const numericId = parseInt(id, 10)
        const foundInquiry = dummyData.find((item) => item.id === numericId)
        setInquiry(foundInquiry)
        setIsAnswered(foundInquiry ? foundInquiry.isAnswered : false)
      } else {
        const question_no = id
        // API에서 문의 데이터 가져오기
        API.get(`/questions/${question_no}`)
          .then((response) => {
            setInquiry(response.data)
            setIsAnswered(response.data.isAnswered)
          })
          .catch((error) => console.error('문의 불러오기 실패:', error))
      }
    }

    fetchInquiry()
  }, [id, debug_mode])

  return (
    <div className='max-w-4xl mx-auto mt-10 p-6 bg-white border border-gray-300 rounded-lg'>
      {inquiry ? (
        <div className='space-y-6'>
          <h1 className='text-2xl font-semibold text-gray-800 border-b pb-3'>📌 {inquiry.title}</h1>

          <div className='text-sm text-gray-500 flex justify-between border-b pb-2'>
            <span>
              <strong>작성자:</strong> {inquiry.buyerId}
            </span>
            <span>
              <strong>문의 유형:</strong> {inquiry.type}
            </span>
          </div>

          <div className='text-gray-800 leading-relaxed whitespace-pre-line border-b pb-4'>
            {inquiry.content}
          </div>

          <div className='flex justify-between pt-4'>
            {/* 답장이 있는 경우 `ReplyEditForm`으로 연결, 없는 경우 `ReplyForm` 표시 */}
            {isAnswered ? (
              <ReplyEditForm inquiryId={id} />
            ) : (
              <button
                onClick={() => navigate(`/seller/inquiries/reply?id=${id}`)}
                className='bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition'
              >
                답장하기
              </button>
            )}
          </div>

          <div className='flex justify-between pt-4'>
            <div className='space-x-3'>
              <DeleteButton inquiryId={id} />
            </div>
            <ReportButton inquiryId={id} />
          </div>
        </div>
      ) : (
        <p className='text-center text-gray-500'>게시글을 불러오는 중...</p>
      )}
    </div>
  )
}

export default Inquiry
