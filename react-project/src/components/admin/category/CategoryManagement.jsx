import React, { useState, useEffect } from 'react'
import { ChevronDown, ChevronUp, Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Breadcrumb from '../common/Breadcrumb'
import API from '../../../utils/API'

const CategoryManagementForm = () => {
  // Breadcrumb 경로 설정
  const breadcrumbPaths = [{ name: 'Home' }, { name: '카테고리관리' }]

  // 상태 관리
  const [categories, setCategories] = useState([])
  const [expandedCategories, setExpandedCategories] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [parentFormData, setParentFormData] = useState({ categoryName: '' })
  const [childFormData, setChildFormData] = useState({ categoryName: '', parent: '' })
  const navigate = useNavigate()

  useEffect(() => {
    fetchCategories()
  }, [])

  // 전체 카테고리 목록 가져오기 (API 요청)
  const fetchCategories = async () => {
    try {
      const response = await API.get('/categories')
      setCategories(response.data.result.data)
      console.log('✅ 전체 카테고리 데이터:', response.data.result.data)
    } catch (error) {
      console.error('카테고리 데이터를 불러오는 중 오류 발생:', error)
      alert('카테고리 데이터를 불러오는 데 실패했습니다.')
    }
  }

  const handleParentInputChange = (e) => {
    const { name, value } = e.target
    setParentFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleChildInputChange = (e) => {
    const { name, value } = e.target
    setChildFormData((prev) => ({ ...prev, [name]: value }))
  }

  // 날짜 형식 변환 함수
  const formatDate = (dateString) => {
    if (!dateString) return ''
    return `${dateString.substring(0, 4)}-${dateString.substring(4, 6)}-${dateString.substring(6, 8)}`
  }

  // 재귀적으로 카테고리 트리를 렌더링, level 인자로 자식 여부 판별
  const renderCategoryTree = (category, level = 0) => (
    <React.Fragment key={category.categoryNo}>
      <tr
        className={`border-b transition ${
          level > 0 ? 'bg-blue-50 hover:bg-blue-100' : 'hover:bg-gray-50'
        }`}
      >
        <td className='px-4 py-3 text-center'>{category.categoryNo}</td>
        <td className={`px-4 py-3 flex items-center justify-between ${level > 0 ? 'pl-8' : ''}`}>
          {category.name}
          {category.children && category.children.length > 0 && (
            <button
              onClick={() =>
                setExpandedCategories((prev) =>
                  prev.includes(category.categoryNo)
                    ? prev.filter((id) => id !== category.categoryNo)
                    : [...prev, category.categoryNo],
                )
              }
              className='text-blue-500 hover:text-blue-700 transition'
            >
              {expandedCategories.includes(category.categoryNo) ? (
                <ChevronUp size={20} />
              ) : (
                <ChevronDown size={20} />
              )}
            </button>
          )}
        </td>
        <td className='px-4 py-3 text-center'>
          <button
            onClick={() => navigate(`/admin/category/${category.categoryNo}`)}
            className='bg-transparent text-blue-500 hover:text-blue-700 transition-colors p-1 rounded-full hover:bg-blue-50'
          >
            <Search size={20} strokeWidth={2} />
          </button>
        </td>
      </tr>
      {expandedCategories.includes(category.categoryNo) &&
        category.children?.map((child) => renderCategoryTree(child, level + 1))}
    </React.Fragment>
  )

  // 신규 부모(중위) 카테고리 등록 저장 함수
  const handleSaveParentCategory = async () => {
    if (!parentFormData.categoryName) {
      alert('중위 카테고리명을 입력하세요.')
      return
    }
    try {
      await API.post('/categories', {
        name: parentFormData.categoryName,
        parentNo: null,
      })
      alert('중위 카테고리가 등록되었습니다.')
      setParentFormData({ categoryName: '' })
      fetchCategories()
    } catch (err) {
      console.error('중위 카테고리 등록 중 오류 발생:', err)
      alert('중위 카테고리 등록에 실패했습니다.')
    }
  }

  // 신규 세부(자식) 카테고리 등록 저장 함수
  const handleSaveChildCategory = async () => {
    if (!childFormData.parent) {
      alert('중위 카테고리를 선택하세요.')
      return
    }
    if (!childFormData.categoryName) {
      alert('세부 카테고리명을 입력하세요.')
      return
    }
    try {
      await API.post('/categories', {
        name: childFormData.categoryName,
        parentNo: childFormData.parent,
      })
      alert('세부 카테고리가 등록되었습니다.')
      setChildFormData({ categoryName: '', parent: '' })
      fetchCategories()
    } catch (err) {
      console.error('세부 카테고리 등록 중 오류 발생:', err)
      alert('세부 카테고리 등록에 실패했습니다.')
    }
  }

  return (
    <div className='p-6 bg-white rounded-lg'>
      <Breadcrumb paths={breadcrumbPaths} />
      <h1 className='text-2xl font-bold mb-6 text-gray-800'>카테고리 관리</h1>
      <h3 className='text-lg font-semibold mb-4'>| 전체 목록</h3>

      {/* 테이블 (좌측 정렬) */}
      <div className='overflow-x-auto max-w-3xl'>
        <table className='w-full text-sm text-left border border-gray-200 table-fixed'>
          <thead className='bg-gray-100'>
            <tr>
              <th className='px-4 py-3 w-1/12 text-center'>번호</th>
              <th className='px-4 py-3 w-1/12'>카테고리명</th>
              <th className='px-4 py-3 w-1/12 text-center'>상세</th>
            </tr>
          </thead>
          <tbody>{categories.map((category) => renderCategoryTree(category))}</tbody>
        </table>
      </div>

      {/* 신규 카테고리 등록 버튼 (디자인 업그레이드) - 테이블과의 간격 확대를 위해 mt-8 추가 */}
      <button
        onClick={() => setShowForm((prev) => !prev)}
        className='mt-8 bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white font-semibold py-2 px-6 rounded-md shadow-lg transition duration-200 ease-in-out mb-4 flex items-center gap-2'
      >
        신규 카테고리 등록
      </button>

      {/* 카테고리 등록 폼 (디자인 업그레이드) - 폼 가로폭 줄이기 위해 max-w-md 추가 */}
      {showForm && (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
          {/* 중위 카테고리 등록 */}
          <div className='bg-white border border-gray-300 shadow-sm p-6 rounded-lg max-w-md'>
            <h2 className='text-lg font-semibold mb-4'>중위 카테고리 등록</h2>
            <input
              type='text'
              name='categoryName'
              value={parentFormData.categoryName}
              onChange={handleParentInputChange}
              className='border border-gray-300 rounded-md px-4 py-2 w-full'
              placeholder='중위 카테고리명을 입력하세요'
            />
            <button
              onClick={handleSaveParentCategory}
              className='mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded-md transition'
            >
              저장
            </button>
          </div>
          {/* 세부 카테고리 등록 */}
          <div className='bg-white border border-gray-300 shadow-sm p-6 rounded-lg max-w-md'>
            <h2 className='text-lg font-semibold mb-4'>하위 카테고리 등록</h2>
            <select
              name='parent'
              value={childFormData.parent || ''}
              onChange={handleChildInputChange}
              className='border border-gray-300 rounded-md px-4 py-2 w-full'
            >
              <option value=''>중위 카테고리를 선택하세요</option>
              {categories.map((cat) => (
                <option key={cat.categoryNo} value={cat.categoryNo}>
                  {cat.name}
                </option>
              ))}
            </select>
            <input
              type='text'
              name='categoryName'
              value={childFormData.categoryName}
              onChange={handleChildInputChange}
              className='border border-gray-300 rounded-md px-4 py-2 w-full mt-2'
              placeholder='세부 카테고리명을 입력하세요'
            />
            <button
              onClick={handleSaveChildCategory}
              className='mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded-md transition'
            >
              저장
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default CategoryManagementForm
