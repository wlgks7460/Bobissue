import React, { useEffect, useState } from 'react'
import API from '@/utils/API'

const ProductInfo = ({ product, setProduct }) => {
  const [categories, setCategories] = useState([]) // API에서 불러올 카테고리 목록

  // 카테고리 목록 불러오기
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await API.get('api/categories') // 카테고리 목록 API 호출
        setCategories(response.data.result) // API 응답 데이터 설정
      } catch (error) {
        console.error('카테고리 목록 불러오기 실패:', error)
      }
    }

    fetchCategories()
  }, [])

  return (
    <div className='w-[700px] border-black border p-2'>
      <h2 className='text-[16px] font-bold'>상품 기본 정보</h2>

      {/* 상품명 입력 */}
      <input
        className='w-[500px] mt-2 p-2 border-b-2 border-black'
        type='text'
        value={product.name}
        onChange={(e) => setProduct((prev) => ({ ...prev, name: e.target.value }))}
        placeholder='상품명을 입력해주세요'
      />

      {/* 카테고리 선택 */}
      <div className='mt-3'>
        <label className='block text-[16px] font-bold mb-2'>카테고리</label>
        <select
          className='w-[400px] p-2 border-b-2 border-black'
          value={product.categoryNo}
          onChange={(e) => setProduct((prev) => ({ ...prev, categoryNo: e.target.value }))}
        >
          <option value=''>카테고리 선택</option>
          {categories.map((category) => (
            <option key={category.categoryNo} value={category.categoryNo}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* 회사명 입력 */}
      <div className='mt-3'>
        <label className='block text-[16px] font-bold mb-2'>회사명</label>
        <input
          className='w-[400px] p-2 border-b-2 border-black'
          type='text'
          placeholder='회사명을 입력하세요'
          value={product.companyNo}
          onChange={(e) => setProduct((prev) => ({ ...prev, companyNo: e.target.value }))}
        />
      </div>
    </div>
  )
}

export default ProductInfo
