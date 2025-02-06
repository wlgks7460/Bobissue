import React from 'react'
import { useNavigate } from 'react-router-dom'

const ReportButton = ({ inquiryId }) => {
  const navigate = useNavigate()

  const handleClickReport = () => {
    navigate(`/seller/replies/report?id=${inquiryId}`)
  }

  return (
    <button
      className='px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600'
      onClick={handleClickReport}
    >
      🚨 신고
    </button>
  )
}

export default ReportButton
