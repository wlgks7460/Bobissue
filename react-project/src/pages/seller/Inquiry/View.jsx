import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import ReplyForm from './Form/Reply'
import ReplyEditForm from './Form/ReplyEdit'
import DeleteButton from './Form/Delete'
import ReportButton from './Form/Report'
import API from '@/utils/API'
import { FaTrash, FaFlag } from 'react-icons/fa'

const InquiryDetail = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const queryParams = new URLSearchParams(location.search)
  const id = queryParams.get('id')
  const [inquiry, setInquiry] = useState(null)
  const [reply, setReply] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [status, setStatus] = useState('')

  useEffect(() => {
    async function fetchInquiry() {
      try {
        const response = await API.get(`/question/${id}`)
        setInquiry(response.data.result.data)
        setStatus(response.data.result.data.status)

        if (response.data.result.data.status === 'Y') {
          await fetchReply()
        }
      } catch (err) {
        setError('문의 정보를 불러오는 중 오류가 발생했습니다.')
      } finally {
        setIsLoading(false)
      }
    }

    async function fetchReply() {
      try {
        const response = await API.get(`/question/${id}/answer`)
        setReply(response.data.result.data)
      } catch (err) {
        setError('답변 정보를 불러오는 중 오류가 발생했습니다.')
      }
    }

    fetchInquiry()
  }, [id])

  if (isLoading) {
    return <p className='text-center text-gray-500'>📦 게시글을 불러오는 중...</p>
  }

  return (
    <div className='max-w-4xl mx-auto mt-10 p-8 bg-white border border-gray-200 rounded-xl shadow-lg'>
      <div className='border-b pb-4'>
        <h1 className='text-3xl font-bold text-gray-900'>{inquiry.title}</h1>
      </div>

      <div className='text-sm text-gray-500 flex justify-between border-b py-3'>
        <span>
          <strong>작성자:</strong> {inquiry.createdUser}
        </span>
        <span>
          <strong>문의 유형:</strong> {inquiry.category}
        </span>
      </div>

      <div className='text-gray-800 leading-relaxed whitespace-pre-line py-6 border-b'>
        {inquiry.content}
      </div>

      <div className='pt-6'>
        {status === 'Y' && reply ? (
          <ReplyEditForm inquiryId={id} replyData={reply} />
        ) : (
          <ReplyForm inquiryId={id} />
        )}
      </div>

      <div className='flex justify-between pt-6'>
        <button className='flex items-center px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition'>
          <FaTrash className='mr-2' /> 삭제
        </button>
        <button className='flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg shadow hover:bg-gray-700 transition'>
          <FaFlag className='mr-2' /> 신고
        </button>
      </div>
    </div>
  )
}

export default InquiryDetail
