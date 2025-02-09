import React, { useState, useEffect } from 'react'
import { ChevronDown, ChevronUp, Eye, Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Breadcrumb from '../common/Breadcrumb'
import API from '../../../utils/API'

const CategoryManagementForm = () => {
  const breadcrumbPaths = [{ name: 'Home' }, { name: '카테고리관리' }]
  const [categories, setCategories] = useState([])
  const [expandedCategories, setExpandedCategories] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [parentFormData, setParentFormData] = useState({ categoryName: '' })
  const [childFormData, setChildFormData] = useState({ categoryName: '', parent: '' })
  const navigate = useNavigate()

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await API.get('/categories')
      setCategories(response.data.result.data)
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

  const formatDate = (dateString) => {
    if (!dateString) return ''
    return `${dateString.substring(0, 4)}-${dateString.substring(4, 6)}-${dateString.substring(6, 8)}`
  }

  const renderCategoryTree = (category) => (
    <React.Fragment key={category.categoryNo}>
      <tr className='border-b hover:bg-gray-50 transition'>
        <td className='px-4 py-3 text-center'>{category.categoryNo}</td>
        <td className='px-4 py-3 flex items-center justify-between w-full'>
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
        <td className='px-4 py-3 text-center'>{formatDate(category.createdAt)}</td>
        <td className='px-4 py-3 text-center'>{formatDate(category.updatedAt)}</td>
        <td className='px-4 py-3 text-center'>
          <button
            onClick={() => navigate(`/admin/category/${category.categoryNo}`)}
            className='bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md transition'
          >
            <Eye size={16} />
          </button>
        </td>
      </tr>
      {expandedCategories.includes(category.categoryNo) &&
        category.children?.map(renderCategoryTree)}
    </React.Fragment>
  )

  return (
    <div className='p-6 bg-white rounded-lg'>
      <Breadcrumb paths={breadcrumbPaths} />
      <h1 className='text-2xl font-bold mb-6 text-gray-800'>카테고리 관리</h1>
      <button
        onClick={() => setShowForm((prev) => !prev)}
        className='bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md flex items-center gap-2 mb-4'
      >
        <Plus size={16} /> 카테고리 등록
      </button>
      {showForm && (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
          <div className='bg-gray-100 p-4 rounded-lg'>
            <h2 className='text-lg font-semibold mb-4'>| 중위 카테고리 등록</h2>
            <input
              type='text'
              name='categoryName'
              value={parentFormData.categoryName}
              onChange={handleParentInputChange}
              className='border rounded-md px-3 py-2 w-full'
              placeholder='중위 카테고리명을 입력하세요'
            />
            <button className='bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 mt-4 w-full'>
              저장
            </button>
          </div>
          <div className='bg-gray-100 p-4 rounded-lg'>
            <h2 className='text-lg font-semibold mb-4'>| 세부 카테고리 등록</h2>
            <select
              name='parent'
              value={childFormData.parent || ''}
              onChange={handleChildInputChange}
              className='border rounded-md px-3 py-2 w-full'
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
              className='border rounded-md px-3 py-2 w-full mt-2'
              placeholder='세부 카테고리명을 입력하세요'
            />
            <button className='bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 mt-4 w-full'>
              저장
            </button>
          </div>
        </div>
      )}
      <div className='overflow-x-auto'>
        <table className='w-full text-sm text-left border border-gray-200 table-fixed'>
          <thead className='bg-gray-100'>
            <tr>
              <th className='px-4 py-3 w-1/12'>번호</th>
              <th className='px-4 py-3 w-5/12'>카테고리명</th>
              <th className='px-4 py-3 w-2/12'>생성일</th>
              <th className='px-4 py-3 w-2/12'>수정일</th>
              <th className='px-4 py-3 w-2/12'>상세</th>
            </tr>
          </thead>
          <tbody>{categories.map(renderCategoryTree)}</tbody>
        </table>
      </div>
    </div>
  )
}

export default CategoryManagementForm
