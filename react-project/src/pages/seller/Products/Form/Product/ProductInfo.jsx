import React, { useEffect, useState, useRef } from 'react'
import API from '@/utils/API'

const ProductInfo = ({ product, setProduct }) => {
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [hoveredCategory, setHoveredCategory] = useState(null)
  const [isOpenCategory, setIsOpenCategory] = useState(false)
  const categoryRef = useRef(null)

  // ✅ 카테고리 데이터 가져오기
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await API.get('categories')
        setCategories(response.data.result.data || [])
      } catch (error) {
        console.error('카테고리 목록 불러오기 실패:', error)
      }
    }
    fetchCategories()
  }, [])

  // ✅ 대분류 카테고리 선택 핸들러
  const handleCategorySelect = (category) => {
    if (category.children?.length > 0) {
      setHoveredCategory(category.categoryNo)
    } else {
      setSelectedCategory(category)
      setProduct((prev) => ({ ...prev, categoryNo: category.categoryNo }))
      setIsOpenCategory(false) // ✅ 선택 후 드롭다운 닫기
      setHoveredCategory(null)
    }
  }

  // ✅ 서브 카테고리 선택 핸들러
  const handleSubCategorySelect = (subCategory) => {
    setSelectedCategory(subCategory)
    setProduct((prev) => ({ ...prev, categoryNo: subCategory.categoryNo }))
    setIsOpenCategory(false) // ✅ 선택 후 드롭다운 닫기
    setHoveredCategory(null)
  }

  return (
    <div className="w-full mx-auto max-w-lg p-6 border border-brown-300 rounded-lg bg-white shadow-md space-y-6">
      {/* ✅ 상품명 입력 */}
      <div>
        <label className="text-lg font-bold text-brown-700">상품명</label>
        <input
          type="text"
          placeholder="상품명을 입력하세요"
          className="w-full mt-2 p-3 border border-brown-300 rounded-md focus:ring-2 focus:ring-brown-500 focus:outline-none"
          value={product.name}
          onChange={(e) => setProduct((prev) => ({ ...prev, name: e.target.value }))}
        />
      </div>

      {/* ✅ 카테고리 선택 */}
      <div className="relative">
        <label className="text-lg font-bold text-brown-700">카테고리 선택</label>
        <div
          className="mt-2 border border-brown-400 bg-brown-50 rounded-md p-3 cursor-pointer flex justify-between items-center hover:bg-brown-100"
          onClick={() => setIsOpenCategory((prev) => !prev)}
          aria-haspopup="true"
          aria-expanded={isOpenCategory}
        >
          {selectedCategory ? selectedCategory.name : '카테고리 선택'}
          <span className="text-brown-700">▼</span>
        </div>

        {/* ✅ 대분류 카테고리 드롭다운 */}
        {isOpenCategory && (
          <div className="absolute left-0 top-full w-full bg-white border border-brown-300 rounded-md shadow-lg z-10 max-h-60 overflow-auto transition-all duration-200 mt-2">
            {categories.map((category) => (
              <div
                key={category.categoryNo}
                className="p-3 cursor-pointer hover:bg-brown-100 flex justify-between"
                onClick={() => handleCategorySelect(category)}
              >
                {category.name}
                {category.children?.length > 0 && <span className="text-brown-700">▶</span>}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ✅ 서브 카테고리 선택 */}
      {hoveredCategory && (
        <div className="absolute left-[270px] top-[70px] bg-white border border-brown-300 rounded-md shadow-lg p-3 w-[250px] z-20">
          {categories
            .find((cat) => cat.categoryNo === hoveredCategory)
            ?.children?.map((subCategory) => (
              <div
                key={subCategory.categoryNo}
                className="cursor-pointer hover:bg-brown-100 p-2 rounded-md"
                onClick={() => handleSubCategorySelect(subCategory)}
              >
                {subCategory.name}
              </div>
            ))}
        </div>
      )}
    </div>
  )
}

export default ProductInfo
