import React, { useState, useEffect } from 'react'
import Breadcrumb from '../common/Breadcrumb'
import API from '../../../utils/API'

const CategoryManagementForm = () => {
  const breadcrumbPaths = [{ name: 'Home' }, { name: '카테고리관리' }]

  const [categories, setCategories] = useState([]) // 카테고리 목록
  const [formData, setFormData] = useState({ categoryName: '' }) // 새 카테고리 입력값
  const [showForm, setShowForm] = useState(false) // 폼 표시 여부
  const [editMode, setEditMode] = useState(null) // 현재 수정 중인 카테고리 ID
  const [editName, setEditName] = useState('') // 수정할 카테고리명

  // 날짜 포맷 변환 함수
  const formatDate = (dateString) => {
    if (!dateString) return ''
    const year = dateString.substring(0, 4)
    const month = dateString.substring(4, 6)
    const day = dateString.substring(6, 8)
    return `${year}년 ${month}월 ${day}일`
  }

  // 카테고리 목록 불러오기
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await API.get('/categories')
        setCategories(response.data.result.data)
        console.log(response.data.result.data)
      } catch (error) {
        console.error('카테고리 데이터를 불러오는 중 오류 발생:', error)
        alert('카테고리 데이터를 불러오는 데 실패했습니다.')
      }
    }
    fetchCategories()
  }, [])
  // 입력 값 변경 핸들러 (카테고리 입력 시 실행됨)
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    if (formData.categoryName.trim() === '') {
      alert('카테고리명을 입력해주세요.')
      return
    }

    try {
      const response = await API.post('/categories', { name: formData.categoryName })

      // API 응답에서 새로 추가된 카테고리 정보 추출
      const newCategory = response.data.result.data

      // 목록에 즉시 반영
      setCategories((prev) => [...prev, newCategory])
      setFormData({ categoryName: '' }) // 입력값 초기화
      setShowForm(false) // 폼 닫기
      alert('카테고리가 저장되었습니다.')
    } catch (error) {
      console.error('카테고리 저장 중 오류 발생:', error)
      alert('카테고리 등록에 실패했습니다.')
    }
  }

  // 카테고리 수정 활성화
  const handleEdit = (category) => {
    setEditMode(category.categoryNo)
    setEditName(category.name)
  }

  // 카테고리 수정 저장
  const handleUpdate = async (categoryNo) => {
    if (editName.trim() === '') {
      alert('카테고리명을 입력해주세요.')
      return
    }

    try {
      await API.put(`/categories/${categoryNo}`, { name: editName })
      setCategories((prev) =>
        prev.map((cat) => (cat.categoryNo === categoryNo ? { ...cat, name: editName } : cat)),
      )
      setEditMode(null)
      alert('카테고리가 수정되었습니다.')
    } catch (error) {
      console.error('카테고리 수정 중 오류 발생:', error)
      alert('카테고리 수정에 실패했습니다.')
    }
  }

  // 카테고리 삭제
  const handleDelete = async (categoryNo) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return

    try {
      await API.delete(`/categories/${categoryNo}`)
      setCategories((prev) => prev.filter((cat) => cat.categoryNo !== categoryNo))
      alert('카테고리가 삭제되었습니다.')
    } catch (error) {
      console.error('카테고리 삭제 중 오류 발생:', error)
      alert('카테고리 삭제에 실패했습니다.')
    }
  }

  return (
    <div className='p-6'>
      {/* Breadcrumb */}
      <Breadcrumb paths={breadcrumbPaths} />
      <h1 className='text-2xl font-bold mb-6'>카테고리 관리</h1>

      {/* 카테고리 목록 */}
      <h2 className='text-lg font-semibold mb-4'>| 카테고리 목록</h2>
      <table className='table-auto w-full border mb-6'>
        <thead>
          <tr className='bg-gray-100'>
            <th className='border px-4 py-2'>번호</th>
            <th className='border px-4 py-2'>카테고리명</th>
            <th className='border px-4 py-2'>생성일</th>
            <th className='border px-4 py-2'>수정일</th>
            <th className='border px-4 py-2'>수정/삭제</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => (
            <tr key={cat.categoryNo}>
              <td className='border px-4 py-2 text-center'>{cat.categoryNo}</td>
              <td className='border px-4 py-2'>
                {editMode === cat.categoryNo ? (
                  <input
                    type='text'
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className='border px-2 py-1 w-full'
                  />
                ) : (
                  cat.name
                )}
              </td>
              <td className='border px-4 py-2 text-center'>{formatDate(cat.createdAt)}</td>
              <td className='border px-4 py-2 text-center'>{formatDate(cat.updatedAt)}</td>
              <td className='border px-4 py-2 text-center'>
                {editMode === cat.categoryNo ? (
                  <button
                    onClick={() => handleUpdate(cat.categoryNo)}
                    className='bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 mr-2'
                  >
                    저장
                  </button>
                ) : (
                  <button
                    onClick={() => handleEdit(cat)}
                    className='bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 mr-2'
                  >
                    수정
                  </button>
                )}
                <button
                  onClick={() => handleDelete(cat.categoryNo)}
                  className='bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600'
                >
                  삭제
                </button>
              </td>
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
          <input
            type='text'
            name='categoryName'
            value={formData.categoryName}
            onChange={handleInputChange}
            className='border rounded-md px-3 py-2 w-full'
            placeholder='카테고리명을 입력하세요'
          />
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
