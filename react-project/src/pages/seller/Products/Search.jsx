import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SearchFilter from './Form/SearchFilter'
import API from '@/utils/API'

const Inquiry = () => {
  const navigate = useNavigate()
  const [products, setProducts] = useState([]) // 검색된 상품 리스트 저장

  // API 요청 (InquiryFilter에서 호출됨)
  const fetchProducts = async (filters) => {
    try {
      const response = await API.get('', { params: filters })
      const data = response.json()
      console.log(data)
      setProducts(data) // API 결과를 상태에 저장
    } catch (error) {
      console.error('상품 조회 실패:', error)
      const dummy = [
        {
          id: 1,
          name: '무선 이어폰',
          companyName: '삼성',
          status: '판매중',
          createdAt: '2024-01-01',
        },
        {
          id: 2,
          name: '게이밍 마우스',
          companyName: '로지텍',
          status: '판매완료',
          createdAt: '2024-01-15',
        },
        {
          id: 3,
          name: '프로틴 바',
          companyName: '헬스케어',
          status: '판매중',
          createdAt: '2024-02-01',
        },
      ]
      // 에러 발생 시 더미 데이터 사용
      setProducts(dummy)
    }
  }
  const handleClickNavigate = (productId) => {
    navigate(`/seller/products/view/${productId}`)
  }

  return (
    <div className='p-6'>
      <h1 className='font-bold text-2xl mb-10'>상품 조회</h1>

      {/* 검색 필터 (fetchProducts를 onSearch로 전달) */}
      <SearchFilter onSearch={fetchProducts} />

      {/* 검색 결과 리스트 */}
      <div className='mt-6 p-6 border rounded-lg bg-white'>
        {products.length === 0 ? (
          <p className='text-gray-600 text-center'>검색된 상품이 없습니다.</p>
        ) : (
          <table className='w-full border-collapse'>
            <thead>
              <tr className='bg-gray-200 text-left'>
                <th className='border px-4 py-2 w-[100px]'>번호</th>
                <th className='border px-4 py-2 w-[300px]'>등록상품명</th>
                <th className='border px-4 py-2 w-[200px]'>회사명</th>
                <th className='border px-4 py-2 w-[150px]'>판매 상태</th>
                <th className='border px-4 py-2 w-[200px]'>등록일</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr
                  key={product.id}
                  className='border-b hover:bg-gray-50 cursor-pointer'
                  onClick={() => handleClickNavigate(product.id)}
                >
                  <td className='border px-4 py-2 text-center'>{index + 1}</td>
                  <td className='border px-4 py-2 text-blue-500'>{product.name}</td>
                  <td className='border px-4 py-2'>{product.companyName}</td>
                  <td className='border px-4 py-2'>{product.status}</td>
                  <td className='border px-4 py-2'>{product.createdAt}</td>
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
