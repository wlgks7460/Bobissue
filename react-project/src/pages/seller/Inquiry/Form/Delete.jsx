import React from 'react'
import { useNavigate } from 'react-router-dom'

const DeleteButton = ({ inquiryId }) => {
  const navigate = useNavigate()

  const handleClickDelete = () => {
    if (window.confirm('삭제하시겠습니까?')) {
      alert('삭제되었습니다.')
      navigate('/seller/replies/list')
    } else {
      alert('삭제가 취소되었습니다.')
    }
  }

  return (
    <button className='px-3 py-1 bg-gray-200 text-gray-700 rounded' onClick={handleClickDelete}>
      ❌ 삭제
    </button>
  )
}

export default DeleteButton
