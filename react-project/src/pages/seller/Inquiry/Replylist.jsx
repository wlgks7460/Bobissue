import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Replylist = () => {
  const [replyList, setReplyList] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    // 더미 데이터
    const dummyReplies = [
      { replyId: 1, inquiryId: 101, title: '첫 번째 답변' },
      { replyId: 2, inquiryId: 102, title: '두 번째 답변' },
      { replyId: 3, inquiryId: 103, title: '세 번째 답변' },
    ]
    setReplyList(dummyReplies)
  }, [])

  const handleClick = (replyId) => {
    navigate(`/seller/replies/view?replyId=${replyId}`)
  }

  return (
    <div className='max-w-3xl mx-auto mt-10 p-4 bg-white border border-gray-300 rounded-lg'>
      <h1 className='text-xl font-semibold text-gray-800 border-b pb-3'>📌 나의 답변 목록</h1>

      <table className='w-full text-left border-collapse mt-4 text-sm'>
        <thead>
          <tr className='border-b bg-gray-100'>
            <th className='p-2 w-20'>답변 번호</th>
            <th className='p-2 w-24'>문의 번호</th>
            <th className='p-2'>제목</th>
          </tr>
        </thead>
        <tbody>
          {replyList.length > 0 ? (
            replyList.map((reply) => (
              <tr
                key={reply.replyId}
                onClick={() => handleClick(reply.replyId)}
                className='border-b hover:bg-gray-200 cursor-pointer'
              >
                <td className='p-2 text-center'>{reply.replyId}</td>
                <td className='p-2 text-center'>{reply.inquiryId}</td>
                <td className='p-2'>{reply.title}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan='3' className='p-4 text-center text-gray-500'>
                답변이 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default Replylist
