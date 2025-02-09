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
    <div className="gap-4 relative">
      <div className='text-lg font-bold mb-2'>상품명</div>
      <input
        type="text"
        placeholder="상품명을 입력하세요"
        className='w-full p-2 border rounded mb-4'
        value={product.name}
        onChange={(e) => setProduct((prev) => ({ ...prev, name: e.target.value }))}
      />

      {/* ✅ 카테고리 선택 */}
      <div className="relative" ref={categoryRef}>
        <h3 className="text-lg font-bold mb-2">카테고리 선택</h3>
        <div
          className="relative border-2 rounded-[4px] border-black w-[250px] p-2 cursor-pointer"
          onClick={() => setIsOpenCategory((prev) => !prev)}
        >
          <div className="flex justify-between items-center">
            {selectedCategory ? selectedCategory.name : '카테고리 선택'}
            <span>▼</span>
          </div>
        </div>

        {/* ✅ 대분류 카테고리 드롭다운 */}
        {isOpenCategory && (
          <div className="absolute left-0 top-full w-[250px] bg-white border border-gray-300 rounded-md shadow-md z-10">
            {categories.map((category) => (
              <div
                key={category.categoryNo}
                className="p-2 cursor-pointer hover:bg-gray-200 flex justify-between"
                onClick={() => handleCategorySelect(category)}
              >
                {category.name}
                {category.children?.length > 0 && <span>▶</span>}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ✅ 서브 카테고리 (클릭해서 선택 가능) */}
      {hoveredCategory && (
        <div
          className="absolute left-[260px] top-[70px] bg-white border border-gray-300 rounded-md shadow-md p-2 w-[250px] z-20"
        >
          {categories
            .find((cat) => cat.categoryNo === hoveredCategory)
            ?.children?.map((subCategory) => (
              <div
                key={subCategory.categoryNo}
                className="cursor-pointer hover:bg-gray-200 p-2"
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
