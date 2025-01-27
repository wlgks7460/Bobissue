
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../../../utils/API' // API.js 경로에 맞게 수정

const Inquiry = () => {
  const [products, setProducts] = useState([])
  const navigate = useNavigate()
  const dummy = [
    { id: 1, name: '무선 이어폰', category: '전자기기', price: 120000, stock: 10 },
    { id: 2, name: '게이밍 마우스', category: '전자기기', price: 65000, stock: 15 },
    { id: 3, name: '프로틴 바', category: '건강식품', price: 3500, stock: 50 },
  ]

  // 상품 데이터 가져오기 (API 호출)
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // 실제 API 호출로 변경
        const response = await API.get('/api/sellers') // Spring Boot의 엔드포인트
        console.log(response);
        setProducts(response.data)
      } catch (error) {
        console.error('상품 데이터 불러오기 실패:', error)
        setProducts(dummy) // 에러 발생 시 더미 데이터를 사용
      }
    }

    fetchProducts()
  }, [])

  // 상품 상세 페이지로 이동
  const handleProductClick = (product) => {
    navigate(`/seller/products/view/${product.id}`, { state: product })
  }

  return (
    <div className='p-6 bg-gray-100 min-h-screen'>
      <div className='max-w-6xl mx-auto bg-white shadow-md rounded-md p-6'>
        <h1 className='text-2xl font-bold text-gray-800 mb-6'>상품 목록</h1>
        {products.length === 0 ? (
          <p className='text-gray-600'>상품이 없습니다.</p>
        ) : (
          <table className='w-full table-auto border-collapse'>
            <thead>
              <tr className='bg-gray-200 text-gray-700 text-left'>
                <th className='border-b px-4 py-2'>번호</th>
                <th className='border-b px-4 py-2'>상품명</th>
                <th className='border-b px-4 py-2'>카테고리</th>
                <th className='border-b px-4 py-2'>가격</th>
                <th className='border-b px-4 py-2'>재고</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr
                  key={product.id}
                  className='border-b hover:bg-gray-50 cursor-pointer'
                  onClick={() => handleProductClick(product)}
                >
                  <td className='px-4 py-2'>{index + 1}</td>
                  <td className='px-4 py-2 text-blue-500 font-semibold'>{product.name}</td>
                  <td className='px-4 py-2'>{product.category}</td>
                  <td className='px-4 py-2'>{parseFloat(product.price).toLocaleString()}원</td>
                  <td className='px-4 py-2'>{product.stock} 개</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default Inquiry
