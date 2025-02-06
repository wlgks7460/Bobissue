import React from 'react'
import { useOutletContext } from 'react-router-dom'

const Delete = () => {
  const { productId } = useOutletContext() // 부모에서 전달된 productId

  const handleDelete = () => {
    fetch(`/api/products/${productId}`, {
      method: 'DELETE',
    })
      .then((res) => res.json())
      .then(() => alert('삭제 요청이 접수되었습니다. 관리자 승인을 기다려주세요.'))
      .catch((err) => console.error('삭제 요청 실패:', err))
  }

  return (
    <div className='popup'>
      <h2>상품 삭제</h2>
      <p>상품 ID: {productId}을(를) 삭제하시겠습니까?</p>
      <button onClick={handleDelete}>삭제 요청</button>
    </div>
  )
}

export default Delete
