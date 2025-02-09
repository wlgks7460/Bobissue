import React, { useEffect, useState, useRef } from 'react'
import API from '@/utils/API'

const ProductInfo = ({ product, setProduct }) => {
  const [categories, setCategories] = useState([]) // 전체 카테고리 목록
  const [selectedCategory, setSelectedCategory] = useState(null) // 선택된 카테고리 (세부 카테고리 포함)
  const [hoveredCategory, setHoveredCategory] = useState(null) // 현재 마우스가 올라간 대분류 카테고리
  const [isOpenCategory, setIsOpenCategory] = useState(false) // 드롭다운 표시 여부
  const [company, setCompany] = useState(null) // 회사 정보
  const categoryRef = useRef(null) // 드롭다운 외부 클릭 감지

  // ✅ 카테고리 API 호출
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await API.get('categories') // 카테고리 API 호출
        setCategories(response.data.result.data || []) // 카테고리 데이터 저장
      } catch (error) {
        console.error('카테고리 목록 불러오기 실패:', error)
      }
    }
    fetchCategories()
  }, [])

  // ✅ 회사 정보 API 호출
  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const response = await API.get('/sellers/profile') // 회사 정보 API 호출
        const companyData = response.data.result.data
        if (companyData) {
          setCompany(companyData)
          setProduct((prev) => ({
            ...prev,
            companyNo: companyData.companyNo,
            companyName: companyData.name,
          }))
        }
      } catch (error) {
        console.error('회사 정보 불러오기 실패:', error)
      }
    }
    fetchCompany()
  }, [setProduct])

  // ✅ 드롭다운 외부 클릭 감지하여 닫기
 

  // ✅ 대분류 카테고리 선택 핸들러
  const handleCategorySelect = (category) => {
    if (category.children?.length > 0) {
      // 하위 카테고리가 있으면 hover 상태로 설정
      setHoveredCategory(category.categoryNo)
    } else {
      // 하위 카테고리가 없으면 바로 선택
      setSelectedCategory(category)
      setProduct((prev) => ({ ...prev, categoryNo: category.categoryNo }))
      setIsOpenCategory(false) // ✅ 선택 후 드롭다운 닫기
      setHoveredCategory(null) // ✅ 하위 카테고리 hover 상태 초기화
    }
  }

  // ✅ 서브 카테고리 선택 핸들러 (선택 후 드롭다운 닫기)
  const handleSubCategorySelect = (subCategory) => {
    setSelectedCategory(subCategory) // 선택된 카테고리 업데이트
    setProduct((prev) => ({ ...prev, categoryNo: subCategory.categoryNo })) // 선택된 값 적용
    setIsOpenCategory(false) // ✅ 선택 후 드롭다운 닫기
    setHoveredCategory(null) // ✅ 하위 카테고리 hover 상태 초기화
  }

  return (
    <div className="gap-4 relative">
      {/* ✅ 대분류 카테고리 선택 */}
      <div className="relative" ref={categoryRef}>
        <h3 className="text-lg font-bold">카테고리 선택</h3>
        <div
          className="relative border-2 rounded-[4px] border-black w-[200px] p-2 cursor-pointer"
          onClick={() => setIsOpenCategory((prev) => !prev)}
        >
          <div className="flex justify-between items-center">
            {selectedCategory ? selectedCategory.name : '카테고리 선택'}
            <span>▼</span>
          </div>
        </div>

        {/* ✅ 대분류 카테고리 드롭다운 */}
        {isOpenCategory && (
          <div className="absolute left-0 top-full w-[200px] bg-white border border-gray-300 rounded-md shadow-md z-10">
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
          className="absolute left-[210px] top-[70px] bg-white border border-gray-300 rounded-md shadow-md p-2 w-[200px] z-20"
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

      {/* ✅ 회사명 표시 (API에서 자동 설정) */}
      <div className="mt-4">
        <label className="block text-lg font-bold mb-2">회사명</label>
        <div className="w-[400px] p-2 border rounded bg-gray-100">
          {company ? company.name : '불러오는 중...'}
        </div>
      </div>
    </div>
  )
}

export default ProductInfo
