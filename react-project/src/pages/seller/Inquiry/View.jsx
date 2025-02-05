import React, { useEffect, useState } from 'react'
import dummyData from '../Dummy/Inquiries/inquiry' // 더미 데이터 import
import { useNavigate, useLocation } from 'react-router-dom'

const Inquiry = () => {
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const id = queryParams.get('id')
  const [inquiry, setInquiry] = useState(null) // Inquiry 상태
  const navigate = useNavigate()

  useEffect(() => {
    console.log(id)
    // id에 해당하는 데이터를 검색하여 상태 업데이트
    const fetchInquiry = () => {
      const numericId = parseInt(id, 10) // 문자열 id를 숫자로 변환
      const foundInquiry = dummyData.find((item) => item.id === numericId) // ID로 데이터 검색
      setInquiry(foundInquiry)
    }
    fetchInquiry()
  }, [id]) // id가 변경될 때마다 useEffect 실행

  const handleClickReply = () => {
    // 쿼리 스트링을 사용하여 데이터를 전달
    const queryParams = new URLSearchParams({
      id: inquiry.id,
      buyerId: inquiry.buyerId,
      title: inquiry.title,
    }).toString()
    navigate(`/seller/inquiries/reply?${queryParams}`)
  }

  const handleClickDelete = () => {
    if (window.confirm('삭제하시겠겠습니까?')) {
      alert('삭제되었습니다.')
      navigate('/seller/inquiries/list') // 리스트 페이지로 이동
    } else {
      alert('삭제가 취소되었습니다.')
    }
  }

  const handleClickReport = () => {
    navigate(`/seller/inquiries/report?id=${id}`) // report 페이지로 이동
  }

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
            <div className='space-x-3'>
              <button
                onClick={handleClickReply}
                className='px-4 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300'
              >
                ✉️ 답장
              </button>
              <button
                onClick={handleClickDelete}
                className='px-4 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300'
              >
                ❌ 삭제
              </button>
            </div>
            <button
              onClick={handleClickReport}
              className='px-4 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600'
            >
              🚨 신고
            </button>
          </div>
        </div>
      ) : (
        <p className='text-center text-gray-500'>게시글을 불러오는 중...</p>
      )}
    </div>
  )
}

export default Inquiry
