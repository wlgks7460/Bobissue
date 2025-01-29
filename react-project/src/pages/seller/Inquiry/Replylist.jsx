import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './ReplyList.css'

const Replylist = () => {
  const [replyList, setReplyList] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    // 데이터 가져오기
    const fetchReplyList = async () => {
      // 예제 더미 데이터
      const dummyReplies = [
        { replyId: 1, inquiryId: 101, title: '첫 번째 답변' },
        { replyId: 2, inquiryId: 102, title: '두 번째 답변' },
        { replyId: 3, inquiryId: 103, title: '세 번째 답변' },
      ]
      setReplyList(dummyReplies)
    }

    fetchReplyList()
  }, [])

  const handleClick = (replyId) => {
    navigate(`/seller/replies/view?replyId=${replyId}`)
  }

  return (
    <div className='reply-list-container'>
      <h1 className='reply-list-title'>나의 답변 목록</h1>
      <table className='reply-list-table'>
        <thead>
          <tr>
            <th>답변 번호</th>
            <th>문의 번호</th>
            <th>제목</th>
          </tr>
        </thead>
        <tbody>
          {replyList.length > 0 ? (
            replyList.map((reply) => (
              <tr
                key={reply.replyId}
                onClick={() => handleClick(reply.replyId)}
                className='reply-row'
              >
                <td>{reply.replyId}</td>
                <td>{reply.inquiryId}</td>
                <td>{reply.title}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan='3' className='no-replies'>
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
