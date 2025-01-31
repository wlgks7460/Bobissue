import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './List.css' // 스타일을 위한 CSS 파일
import dummyData from '../Dummy/Inquiries/Inquiry'

const View = () => {
  const [inquiries, setInquiries] = useState([])
  const navigate = useNavigate() // 네비게이션 훅

  // 더미 데이터

  // 더미 데이터 설정
  useEffect(() => {
    const nonAnswered = setInquiries(dummyData.filter((item) => item.isAnswered === false))
    console.log(nonAnswered)
  }, [])

  // 문의글 클릭 핸들러
  const handleInquiryClick = (inquiryId) => {
    const queryString = new URLSearchParams({
      id: inquiryId,
    }).toString()

    navigate(`/seller/inquiries/view?${queryString}`) // Inquiry 페이지로 네비게이트하며 id 전송
  }

  return (
    <div className='inquiry-container'>
      <h1>문의 목록</h1>
      <ul className='inquiry-list'>
        {inquiries.map((inquiry) => (
          <li
            key={inquiry.id}
            className='inquiry-item'
            onClick={() => handleInquiryClick(inquiry.id)} // 클릭 이벤트 핸들러
          >
            <span className='inquiry-id'>#{inquiry.id}</span>
            <span className='inquiry-type'>{inquiry.type}</span> {/* 문의 타입 추가 */}
            <span className='inquiry-title'>{inquiry.title}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default View
