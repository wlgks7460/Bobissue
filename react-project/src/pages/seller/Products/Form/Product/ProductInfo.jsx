import React, { useEffect, useState } from 'react'
import API from '@/utils/API'

const ProductInfo = ({ product, setProduct }) => {
  const [categories, setCategories] = useState([]) // 전체 카테고리 목록
  const [selectedCategory, setSelectedCategory] = useState(null) // 선택된 최종 카테고리

  // ✅ 카테고리 API 호출
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await API.get('categories') // 카테고리 API 호출
        console.log(response);
        setCategories(response.data.result.data) // 카테고리 데이터 저장
      } catch (error) {
        console.error('카테고리 목록 불러오기 실패:', error)
      }
    }
    fetchCategories()
  }, [])

  // ✅ 하위 카테고리 가져오기
  const getChildCategories = (parentCategory) => {
    return parentCategory?.children || []
  }

  // ✅ 최종 선택된 카테고리 처리
  const handleCategorySelect = (category) => {
    setSelectedCategory(category) // 선택된 카테고리 저장
    setProduct((prev) => ({ ...prev, categoryNo: category.categoryNo })) // API 요청용 데이터 업데이트
  }

  return (
    <div className='w-full  gap-4'>
      {/* ✅ 대분류 카테고리 */}
      <div className='relative'>
        <h3 className='text-lg font-bold mb-2'>📂 대분류 카테고리</h3>
        <ul className='border p-2'>
          {categories.map((category) => (
            <li
              key={category.categoryNo}
              className='p-2 cursor-pointer hover:bg-gray-100 relative'
              onMouseEnter={() => setSelectedCategory(category)} // 마우스 호버 시 중분류 표시
            >
              {category.name}

              {/* ✅ 중분류 카테고리 */}
              {selectedCategory?.categoryNo === category.categoryNo && (
                <ul className='absolute top-0 left-[200px] border p-2 bg-white'>
                  {getChildCategories(category).map((child) => (
                    <li
                      key={child.categoryNo}
                      className='p-2 cursor-pointer hover:bg-gray-100'
                      onClick={() => handleCategorySelect(child)} // 중분류 선택
                    >
                      {child.name}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* ✅ 회사명 입력 */}
      <div className='mt-4'>
        <label className='block text-lg font-bold mb-2'>🏢 회사명</label>
        <input
          className='w-[400px] p-2 border rounded'
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
