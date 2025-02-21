import React, { useEffect, useState } from 'react'
import API from '@/utils/API' // API 호출용
import dummyData from '../../Dummy/Inquiries/inquiry' // 더미 데이터

const ReplyForm = ({ inquiryId, debug_mode }) => {
  const [reply, setReply] = useState('')
  const [existingReply, setExistingReply] = useState(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const sellerEmail = localStorage.getItem('seller_email')

  useEffect(() => {
    if (debug_mode) {
      // 더미 데이터에서 답변 조회
      const foundInquiry = dummyData.find((item) => item.id === parseInt(inquiryId, 10))
      if (foundInquiry) {
        setIsAnswered(foundInquiry.isAnswered)
        setExistingReply(foundInquiry.isAnswered ? foundInquiry.answer : null)
      }
    } else {
      const question_no = inquiryId
      // API 요청으로 기존 답변 조회
      API.get(`/questions/reply/${question_no}/answer`)
        .then((response) => {
          if (response.data) {
            setExistingReply(response.data.reply)
            setIsAnswered(true)
          }
        })
        .catch((error) => console.error('답변 불러오기 실패:', error))
    }
  }, [inquiryId, debug_mode, sellerEmail])

  const handleReplyChange = (e) => {
    setReply(e.target.value)
  }

  const handleSubmit = () => {
    if (!reply.trim()) {
      alert('답변을 입력해주세요.')
      return
    }

    const payload = {
      sellerEmail,
      inquiryId,
      reply,
    }

    API.post(`/questions/seller/${sellerEmail}/reply/${inquiryId}`, payload)
      .then(() => {
        alert('답변이 저장되었습니다.')
        setExistingReply(reply)
        setIsAnswered(true)
      })
      .catch((error) => {
        console.error('답변 저장 실패:', error)
        alert('답변 저장에 실패했습니다.')
      })
  }

  // 답변이 없고 디버그 모드도 아닐 경우 아무것도 표시하지 않음
  if (!debug_mode && !isAnswered) {
    return null
  }

  return (
    <div className='mt-6 border-t pt-4'>
      {debug_mode && (
        <div className='text-sm text-gray-500 mb-2'>
          <p>⚠ 디버그 모드입니다.</p>
          <p>답변 여부: {isAnswered ? '있음' : '없음'}</p>
        </div>
      )}

      {isAnswered ? (
        <div className='bg-gray-100 p-4 mt-2 rounded'>
          <p className='text-gray-700'>{existingReply}</p>
        </div>
      ) : debug_mode ? null : (
        <div className='mt-2'>
          <textarea
            className='w-full border border-gray-300 rounded p-2'
            placeholder='답변을 입력하세요...'
            value={reply}
            onChange={handleReplyChange}
            rows={4}
          />
          <button
            className='mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
            onClick={handleSubmit}
          >
            답변 저장
          </button>
        </div>
      )}
    </div>
  )
}

export default ReplyForm
