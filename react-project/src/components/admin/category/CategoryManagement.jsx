import React, { useState, useEffect } from 'react'
import Breadcrumb from '../common/Breadcrumb'
import API from '../../../utils/API'

const CategoryManagementForm = () => {
  // Breadcrumb에 사용할 경로 데이터
  const breadcrumbPaths = [{ name: 'Home' }, { name: '카테고리관리' }]

  const [categories, setCategories] = useState([]) // 카테고리 데이터를 저장할 상태
  const [formData, setFormData] = useState({
    categoryName: '',
  })
  const [showForm, setShowForm] = useState(false) // 폼 표시 여부 상태

  // 카테고리 데이터 불러오기
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await API.get('/categories')
        setCategories(response.data.result.data) // 서버에서 받은 데이터를 상태에 저장
      } catch (error) {
        console.error('카테고리 데이터를 불러오는 중 오류 발생:', error)
        alert('카테고리 데이터를 불러오는 데 실패했습니다.')
      }
    }

    fetchCategories()
  }, [])

  // 입력 값 변경 핸들러
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // 새로운 카테고리 저장
  const handleSave = async () => {
    if (formData.categoryName.trim() === '') {
      alert('카테고리명을 입력해주세요.')
      return
    }

    try {
      const response = await API.post('/categories', {
        name: formData.categoryName,
      })

      // 서버에서 반환된 새로운 카테고리 추가
      const newCategory = response.data.result
      setCategories((prev) => [...prev, newCategory])
      setFormData({ categoryName: '' }) // 폼 초기화
      setShowForm(false) // 폼 숨기기
      alert('카테고리가 저장되었습니다.')
    } catch (error) {
      console.error('카테고리 저장 중 오류 발생:', error)
      alert('카테고리 등록에 실패했습니다.')
    }
  }

  return (
    <div className='p-6'>
      {/* Breadcrumb */}
      <Breadcrumb paths={breadcrumbPaths} />
      <h1 className='text-2xl font-bold mb-6'>카테고리 관리</h1>

      {/* 카테고리 목록 */}
      <h2 className='text-lg font-semibold mb-4'>카테고리 목록</h2>
      <table className='table-auto w-full border mb-6'>
        <thead>
          <tr className='bg-gray-100'>
            <th className='border px-4 py-2'>번호</th>
            <th className='border px-4 py-2'>카테고리명</th>
            <th className='border px-4 py-2'>생성일</th>
            <th className='border px-4 py-2'>수정일</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => (
            <tr key={cat.categoryNo}>
              <td className='border px-4 py-2 text-center'>{cat.categoryNo}</td>
              <td className='border px-4 py-2'>{cat.name}</td>
              <td className='border px-4 py-2 text-center'>{cat.createdAt}</td>
              <td className='border px-4 py-2 text-center'>{cat.updatedAt}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 카테고리 등록 버튼 */}
      <button
        onClick={() => setShowForm((prev) => !prev)}
        className='bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 mb-4'
      >
        {showForm ? '등록 취소' : '카테고리 등록'}
      </button>

      {/* 카테고리 등록 폼 */}
      {showForm && (
        <div className='mt-4'>
          <h2 className='text-lg font-semibold mb-2'>카테고리 등록</h2>
          <div className='grid grid-cols-1 gap-4'>
            <div>
              <label className='block text-sm font-medium mb-1'>카테고리명</label>
              <input
                type='text'
                name='categoryName'
                value={formData.categoryName}
                onChange={handleInputChange}
                className='border rounded-md px-3 py-2 w-full'
                placeholder='카테고리명을 입력하세요'
              />
            </div>
          </div>
          <button
            onClick={handleSave}
            className='bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 mt-4'
          >
            저장
          </button>
        </div>
      )}
    </div>
  )
}

export default CategoryManagementForm
