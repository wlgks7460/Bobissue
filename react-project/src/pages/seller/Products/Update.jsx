import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Update = () => {
  const [Products, setProducts] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    fetch('api/products')
      .then((response) => response.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error('상품 불러오기 실패', error))
  })

  return <div>업데이트 요청을 보낸 항목 리스트 보여줌</div>
}

export default Update
