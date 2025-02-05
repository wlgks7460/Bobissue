import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const Reply = () => {
  const location = useLocation() // 현재 URL 정보
  const navigate = useNavigate()

  // 쿼리 스트링에서 데이터 추출
  const queryParams = new URLSearchParams(location.search)
  const inquiryId = queryParams.get('id') // ?id=123
  const buyerId = queryParams.get('buyerId') // ?buyerId=456
  const title = queryParams.get('title') // ?title=문의제목

  const [replyContent, setReplyContent] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()

    // 메시지를 구매자에게 전송하는 로직
    const message = `문의번호 '${inquiryId}'로 답변이 등록되었습니다.`
    console.log(`구매자 ID: ${buyerId}, 메시지: ${message}`)

    // 메시지 전송 후 페이지 이동
    navigate(`/seller/inquiries/view?id=${inquiryId}`)
  }

  const handleCancel = () => {
    // 취소 버튼 클릭 시 이전 페이지로 이동
    navigate(-1) // 브라우저 히스토리에서 뒤로 가기
  }

  return (
    <div className='max-w-2xl mx-auto mt-10 p-6 bg-white border border-gray-300 rounded-lg'>
      <h1 className='text-xl font-semibold pb-3 border-b text-gray-800'>✍️ 답변 작성</h1>

      <form onSubmit={handleSubmit} className='mt-4'>
        <p className='mb-2 text-gray-600 text-sm border-b pb-2'>
          <strong className='font-semibold'>문의번호:</strong> {inquiryId}
        </p>
        <p className='mb-4 text-gray-700 text-sm'>
          <strong className='font-semibold'>RE:</strong> {title}
        </p>

        <textarea
          value={replyContent}
          onChange={(e) => setReplyContent(e.target.value)}
          placeholder='답변 내용을 입력하세요...'
          className='w-full h-36 p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 resize-none'
        />

        <div className='flex justify-end space-x-2'>
          <button
            type='submit'
            className='px-4 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300'
          >
            ✅ 답변 등록
          </button>
          <button
            type='button'
            className='px-4 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300'
            onClick={handleCancel}
          >
            ❌ 취소
          </button>
        </div>
      </form>
    </div>
  )
}

export default Reply
