import React, { useEffect, useState } from 'react'
import API from '@/utils/API'

const ProductInfo = ({ product, setProduct }) => {
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [subCategories, setSubCategories] = useState([])
  const [isOpenCategory, setIsOpenCategory] = useState(false)

  // ✅ 카테고리 데이터 가져오기
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await API.get('categories')
        console.log(response.data.result.data)
        setCategories(response.data.result.data || [])
      } catch (error) {
        console.error('카테고리 목록 불러오기 실패:', error)
      }
    }
    fetchCategories()
  }, [])

  // ✅ 대분류 카테고리 선택 핸들러
  const handleCategorySelect = (category) => {
    setSelectedCategory(category)
    setSubCategories(category.children || []) // 하위 카테고리 설정
    setIsOpenCategory(true)
  }

  // ✅ 서브 카테고리 선택 핸들러
  const handleSubCategorySelect = (subCategory) => {
    setSelectedCategory(subCategory)
    setProduct((prev) => ({ ...prev, categoryNo: subCategory.categoryNo }))
    setIsOpenCategory(false) // ✅ 선택 후 드롭다운 닫기
  }

  return (
    <div className='w-full mx-auto p-6 shadow-md shadow-coffeeBrown/20 rounded-lg bg-white shadow-md space-y-6'>
      {/* ✅ 상품명 입력 */}
      <div className='w-full'>
        <label className='text-lg font-bold text-gray-700'>상품명</label>
        <input
          type='text'
          placeholder='상품명을 입력하세요'
          className='w-full mt-2 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:outline-none'
          value={product.name}
          onChange={(e) => setProduct((prev) => ({ ...prev, name: e.target.value }))}
        />
      </div>

      {/* ✅ 카테고리 선택 */}
      <div className='relative w-full'>
        <label className='text-lg font-bold text-gray-700'>카테고리 선택</label>
        <div
          className='w-full mt-2 border border-gray-400 bg-gray-50 rounded-md p-3 cursor-pointer flex justify-between items-center hover:bg-gray-200'
          onClick={() => setIsOpenCategory((prev) => !prev)}
          aria-haspopup='true'
          aria-expanded={isOpenCategory}
        >
          {selectedCategory ? selectedCategory.name : '카테고리 선택'}
          <span className='text-gray-700'>▼</span>
        </div>

        {/* ✅ 카테고리 선택창 (대분류 + 하위 카테고리) */}
        {isOpenCategory && (
          <div className='absolute left-0 top-full w-full bg-white border border-gray-300 rounded-md shadow-lg z-10 mt-2'>
            <div className='grid grid-cols-2 divide-x divide-gray-300'>
              {/* 대분류 카테고리 목록 */}
              <div className='max-h-60 overflow-auto'>
                {categories.map((category) => (
                  <div
                    key={category.categoryNo}
                    className={`p-3 cursor-pointer hover:bg-gray-200 ${
                      selectedCategory?.categoryNo === category.categoryNo ? 'bg-gray-300' : ''
                    }`}
                    onClick={() => handleCategorySelect(category)}
                  >
                    {category.name}
                  </div>
                ))}
              </div>

              {/* 하위 카테고리 목록 (왼쪽에 표시) */}
              <div className='max-h-60 overflow-auto bg-gray-50'>
                {subCategories.length > 0 ? (
                  subCategories.map((subCategory) => (
                    <div
                      key={subCategory.categoryNo}
                      className='p-3 cursor-pointer hover:bg-gray-200'
                      onClick={() => handleSubCategorySelect(subCategory)}
                    >
                      {subCategory.name}
                    </div>
                  ))
                ) : (
                  <div className='p-3 text-gray-500'>하위 카테고리 없음</div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductInfo
